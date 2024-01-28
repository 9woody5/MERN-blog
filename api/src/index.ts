import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import * as mongoose from "mongoose";
import cookieparser from "cookie-parser";
import multer from "multer";
import path from "path";
import * as dotenv from "dotenv";
import userRouter from "./routes/userRouter";
import { fileURLToPath } from "url";
import postRouter from "./routes/postRouter";
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

// express 세팅
app.use(cors({ credentials: true, origin: process.env.CLIENT_PORT }));
app.use(express.json());
app.use(cookieparser());

const __dirname = fileURLToPath(new URL(".", import.meta.url));
// const __filename = fileURLToPath(import.meta.url);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

mongoose.connect(process.env.MONGODB_API!);

app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const uploadMiddleware = multer({ storage: storage });
app.use(uploadMiddleware.single("file"));

// router 세팅
app.use("/user", userRouter);
app.use("/post", postRouter);

// 서버 실행
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
