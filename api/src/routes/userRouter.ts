import * as express from "express";
import * as userController from "../controllers/userController";

const userRouter = express.Router();

// 회원 가입
userRouter.post("/register", userController.registerUser);
// 유저 네임 중복 여부 조회
userRouter.get("/check-username", userController.checkUserNameAvailable);
// 로그인
userRouter.post("/login", userController.loginUser);
// 로그인 여부 확인
userRouter.get("/profile", userController.getUserProfile);
// 로그아웃
userRouter.post("/logout", userController.logoutUser);

export default userRouter;
