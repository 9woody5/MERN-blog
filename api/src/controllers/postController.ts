import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import Post from "../models/Post";
import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET;

export const createPost = async (req: Request, res: Response) => {
  const { title, summary, content } = req.body;

  if (!title || !req.file || !content) {
    return res.status(400).json("제목, 썸네일 이미지, 내용은 필수 입력 항목입니다.");
  }
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;

  // 파일명에 확장자를 붙여서 수정하기 위해 fs 모듈 사용
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  const info = jwt.verify(token, secret as string, {}) as jwt.JwtPayload;

  if (!info || typeof info !== "object") {
    return res.status(401).json("로그인이 필요합니다");
  }

  const postDoc = await Post.create({
    title,
    summary,
    content,
    thumb: newPath,
    author: info.id,
  });
  res.json(postDoc);
};

export const updatePost = async (req: Request, res: Response) => {
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
  const info = jwt.verify(token, secret as string, {}) as jwt.JwtPayload;

  if (!info || typeof info !== "object") {
    return res.status(401).json("로그인이 필요합니다");
  } else {
    const { id } = req.params;
    const { title, summary, content } = req.body;
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
};

export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await Post.find().populate("author", ["username"]).sort({ createdAt: -1 }).limit(20);
  res.json(posts);
};

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);

    if (!postDoc) {
      return res.status(404).json("게시글을 찾을 수 없습니다.");
    }
    res.json(postDoc);
  } catch (error) {
    console.error("게시글 조회 오류", error);
    res.status(500).json({ error: "서버 오류" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { token } = req.cookies;
  const info = jwt.verify(token, secret as string, {}) as jwt.JwtPayload;

  if (!info || typeof info !== "object") {
    return res.status(401).json("로그인이 필요합니다");
  }

  try {
    const postToDelete = await Post.findById(id);

    if (!postToDelete) {
      return res.status(404).json("게시글을 찾을 수 없습니다.");
    }

    const isAuthor = JSON.stringify(postToDelete.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(401).json("삭제 권한이 없습니다.");
    }

    if (postToDelete.thumb) {
      fs.unlinkSync(postToDelete.thumb);
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json("게시글을 찾을 수 없습니다.");
    }

    res.json({ message: "게시글이 삭제되었습니다!" });
  } catch (error) {
    console.error("게시글 삭제 오류", error);
    res.status(500).json({ error: "서버 오류" });
  }
};
