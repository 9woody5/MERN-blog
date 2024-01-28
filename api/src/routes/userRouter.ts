import * as express from "express";
import * as userController from "../controllers/userController";

const router = express.Router();

// 회원 가입
router.post("/register", userController.registerUser);
// 유저 네임 중복 여부 조회
router.get("/check-username", userController.checkUserNameAvailable);
// 로그인
router.post("/login", userController.loginUser);
// 로그인 여부 확인
router.get("/profile", userController.getUserProfile);
// 로그아웃
router.post("/logout", userController.logoutUser);

export default router;
