import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
import Comment from "../models/Comment";
import * as dotenv from "dotenv";
import Post from "../models/Post";
dotenv.config();

const secret = process.env.SECRET;

// 댓글 작성
export const createComment = async (req: Request, res: Response) => {
  const { content, author, parent } = req.body;
  const { postId } = req.params;

  try {
    const newComment = await Comment.create({
      content,
      author,
      post: postId,
      parent: parent || null,
    });

    // 해당 게시글에 댓글 추가
    const targetPost = await Post.findById(postId);
    if (!targetPost) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    targetPost.comments.push(newComment._id);
    await targetPost.save();

    const populated = await newComment.populate("author", ["username"]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "댓글 생성 오류", error });
  }
};

// 댓글 조회
export const getCommentsByPostId = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId })
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "댓글 조회 오류", error });
  }
};

// 댓글 수정
export const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    ).populate("author", ["username"]);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "댓글 수정 오류", error });
  }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Comment.findByIdAndDelete(id);
    res.status(204).json({ message: "댓글 삭제 완료" });
  } catch (error) {
    res.status(500).json({ message: "댓글 삭제 오류", error });
  }
};
