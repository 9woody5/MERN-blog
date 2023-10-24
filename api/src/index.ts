import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import helmet from "helmet";
import { Request, Response } from "express";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as cookieparser from "cookie-parser";
import User from "../models/User";

const app = express();
const PORT = 4000;

const salt = bcrypt.genSaltSync(10);
const secret = "hQD5DB2PeCQMwMewEBSgGj9xe9sP8WVcqsHj3EXWsD55RpYYjB";

// express 세팅
app.use(cors({ credentials: true, origin: "http://localhost:4173" }));
app.use(express.json());
app.use(cookieparser());

mongoose.connect("mongodb+srv://blog:t0DIvF8o7Pqx6ANS@cluster0.kjnnsat.mongodb.net/?retryWrites=true&w=majority");

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

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  // db의 hashed password와 입력된 값 비교
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    // 로그인 시 필요한 정보 가져오기
    // 에러 발생 시, err 정보, 에러 없으면 token 발급
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw new Error();
      res.cookie("token", token).json("ok");
    });
  } else {
    res.status(400).json("로그인에 실패했습니다.");
  }
});

app.get("/profile", (req: Request, res: Response) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw new Error();
    res.json(info);
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
