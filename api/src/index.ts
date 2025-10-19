import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieparser from "cookie-parser";
import multer from "multer";
import path from "path";
import * as dotenv from "dotenv";
import userRouter from "./routes/userRouter";
import { fileURLToPath } from "url";
import postRouter from "./routes/postRouter";
import commentRouter from "./routes/commentRouter";
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;
// express 세팅
const allowedOrigins = (process.env.CLIENT_PORT || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// 개발 환경에서는 localhost:5173을 기본으로 허용
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173");
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());

const __dirname = fileURLToPath(new URL(".", import.meta.url));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: process.env.NODE_ENV === "production" ? "7d" : 0,
    etag: true,
    immutable: process.env.NODE_ENV === "production",
  })
);

mongoose.connect(process.env.MONGODB_API!, {
  maxPoolSize: 10, // 연결 풀 크기
  serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃
  socketTimeoutMS: 45000, // 소켓 타임아웃
});

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

// router 세팅
app.use("/user", userRouter);
app.use(commentRouter);
app.use("/post", postRouter);

// 서버 실행
const server = app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

// 정상 종료 훅: 포트/DB 정리 후 종료
const gracefulShutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(0);
  });
  // 타임아웃 강제 종료
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
