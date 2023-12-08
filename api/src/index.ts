import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import helmet from "helmet";
import { Request, Response } from "express";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as cookieparser from "cookie-parser";
import * as multer from "multer";
import * as fs from "fs";
import User from "../models/User";
import Post from "../models/Post";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const uploadMiddleware = multer({ dest: "uploads/" });
const app = express();
const PORT = process.env.PORT || 4000;

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

// express 세팅
app.use(cors({ credentials: true, origin: process.env.CLIENT_PORT }));
app.use(express.json());
app.use(cookieparser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

mongoose.connect(process.env.MONGODB_API);

app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());

// router 세팅
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get("/check-username", async (req: Request, res: Response) => {
  const { username } = req.query;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error("유저 이름 확인 오류", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  // db의 hashed password와 입력된 값 비교
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    // 로그인 시 필요한 정보 가져오기
    // 에러 발생 시, err 정보, 에러 없으면 token 발급
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("로그인에 실패했습니다.");
  }
});

app.get("/profile", (req: Request, res: Response) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json("로그인이 필요합니다");
    } else {
      res.json(info);
    }
  });
});

app.post("/logout", (req: Request, res: Response) => {
  res.cookie("token", "").json("Ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req: Request, res: Response) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;

  // 파일명에 확장자를 붙여서 수정하기 위해 fs 모듈 사용
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  const info = jwt.verify(token, secret, {}) as jwt.JwtPayload;

  if (!info || typeof info !== "object") {
    return res.status(401).json("로그인이 필요합니다");
  } else {
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      thumb: newPath,
      author: info.id,
    });
    res.json(postDoc);
  }
});

app.put("/post", uploadMiddleware.single("file"), async (req: Request, res: Response) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    // 파일명에 확장자를 붙여서 수정하기 위해 fs 모듈 사용
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  const info = jwt.verify(token, secret, {}) as jwt.JwtPayload;

  if (!info || typeof info !== "object") {
    return res.status(401).json("로그인이 필요합니다");
  } else {
    const { id, title, summary, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        content,
        thumb: newPath || undefined,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json("게시글을 찾을 수 없습니다.");
    }

    const isAuthor = JSON.stringify(updatedPost.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      res.status(401).json("수정 권한이 없습니다.");
      throw "수정 권한이 없습니다.";
    }

    res.json(updatedPost);
  }
});

app.get("/post", async (req: Request, res: Response) => {
  const posts = await Post.find().populate("author", ["username"]).sort({ createdAt: -1 }).limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const postDoc = await (await Post.findById(id)).populate("author", ["username"]);
  res.json(postDoc);
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
