import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(password);
  console.log(req.body);
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (err) {
    console.error("회원 가입 오류", err);
    res.status(400).json({ error: "회원 가입 오류 발생" });
  }
};

export const checkUserNameAvailable = async (req: Request, res: Response) => {
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
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    // 사용자를 찾지 못한 경우
    return res.status(400).json("사용자를 찾을 수 없습니다.");
  }

  // db의 hashed password와 입력된 값 비교
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    // 로그인 시 필요한 정보 가져오기
    // 에러 발생 시, err 정보, 에러 없으면 token 발급
    jwt.sign({ username, id: userDoc._id }, secret as string, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("로그인에 실패했습니다.");
  }
};

export const getUserProfile = (req: Request, res: Response) => {
  const { token } = req.cookies;

  if (!token) {
    // 토큰이 없는 경우, 로그인하지 않은 상태로 간주하여 특정 메시지를 응답함
    return res.status(200).json("로그인이 필요합니다.");
  }

  jwt.verify(token, secret as string, {}, (err, info) => {
    if (err) {
      return res.status(401).json("로그인이 필요합니다");
    } else {
      res.json(info);
    }
  });
};

export const logoutUser = (req: Request, res: Response) => {
  res.cookie("token", "").json("Ok");
};
