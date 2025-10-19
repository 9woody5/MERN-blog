import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { Types } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET;

export const createPost = async (req: Request, res: Response) => {
  const { title, summary, content } = req.body;

  if (!title || !req.file || !content) {
    return res
      .status(400)
      .json("제목, 썸네일 이미지, 내용은 필수 입력 항목입니다.");
  }
  const { originalname, path } = req.file as any;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  const fs = await import("fs");
  fs.default.renameSync(path, newPath);

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
  let newPath: string | null = null;
  if (req.file) {
    const { originalname, path } = req.file as any;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    const fs = await import("fs");
    fs.default.renameSync(path, newPath);
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

    const isAuthor =
      JSON.stringify(updatedPost.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      res.status(401).json("수정 권한이 없습니다.");
      throw "수정 권한이 없습니다.";
    }

    res.json(updatedPost);
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();

    // 페이지네이션 파라미터
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // 병렬로 총 개수와 포스트 목록 조회
    const [posts, totalCount] = await Promise.all([
      Post.find(
        {},
        {
          // 필요한 필드만 선택하여 전송량 감소
          title: 1,
          summary: 1,
          thumb: 1,
          createdAt: 1,
          author: 1,
        }
      )
        .populate("author", ["username"]) // author는 username만
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.min(limit, 12))
        .lean(), // lean() 추가로 성능 향상
      Post.countDocuments(), // 총 개수 조회
    ]);

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("포스트 목록 조회 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let userId: string | null = null;
    try {
      const { token } = req.cookies as any;
      if (token) {
        const info = jwt.verify(token, secret as string, {}) as jwt.JwtPayload;
        userId =
          info && typeof info === "object" && (info as any).id
            ? String((info as any).id)
            : null;
      }
    } catch {}

    // ✅ 포스트와 댓글 개수를 병렬로 조회
    const [postDoc, commentCount] = await Promise.all([
      Post.findById(id, {
        title: 1,
        summary: 1,
        content: 1,
        thumb: 1,
        createdAt: 1,
        author: 1,
        likes: 1,
        likedBy: 1,
      })
        .populate("author", ["username"])
        .lean(),
      Comment.countDocuments({ post: id }),
    ]);

    if (!postDoc) {
      return res.status(404).json("게시글을 찾을 수 없습니다.");
    }

    // liked 확인
    let liked = false;
    if (userId && postDoc.likedBy) {
      liked = postDoc.likedBy.some(
        (id: Types.ObjectId) => String(id) === String(userId)
      );
    }

    // likedBy는 응답에서 제거
    const { likedBy, ...responseData } = postDoc;

    // commentCount 포함해서 반환
    res.json({ ...responseData, liked, commentCount });
  } catch (error) {
    console.error("게시글 조회 오류", error);
    res.status(500).json({ error: "서버 오류" });
  }
};

export const toggleLike = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const { id } = req.params; // post id
  const { token } = req.cookies;

  try {
    const info = jwt.verify(token, secret as string, {}) as jwt.JwtPayload;
    if (!info || typeof info !== "object")
      return res.status(401).json("로그인이 필요합니다");

    const userId = info.id;

    // 단일 쿼리로 업데이트 (findById + save 대신)
    const result = await Post.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            likedBy: {
              $cond: {
                if: { $in: [new Types.ObjectId(String(userId)), "$likedBy"] },
                then: {
                  $setDifference: [
                    "$likedBy",
                    [new Types.ObjectId(String(userId))],
                  ],
                },
                else: {
                  $concatArrays: [
                    "$likedBy",
                    [new Types.ObjectId(String(userId))],
                  ],
                },
              },
            },
            likes: {
              $cond: {
                if: { $in: [new Types.ObjectId(String(userId)), "$likedBy"] },
                then: { $max: [0, { $subtract: ["$likes", 1] }] },
                else: { $add: ["$likes", 1] },
              },
            },
          },
        },
      ],
      { new: true, select: "likes likedBy" }
    );

    if (!result) return res.status(404).json("게시글을 찾을 수 없습니다.");

    const likedByIds: Types.ObjectId[] = result.likedBy || [];
    const hasLiked = likedByIds.some((u) => String(u) === String(userId));

    res.json({ likes: result.likes, liked: hasLiked });
  } catch (e) {
    console.error("좋아요 토글 오류", e);
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

    const isAuthor =
      JSON.stringify(postToDelete.author) === JSON.stringify(info.id);

    if (!isAuthor) {
      return res.status(401).json("삭제 권한이 없습니다.");
    }

    // 파일시스템 파일 삭제
    if ((postToDelete as any).thumb) {
      try {
        const fs = await import("fs");
        fs.default.unlinkSync((postToDelete as any).thumb);
      } catch {}
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
