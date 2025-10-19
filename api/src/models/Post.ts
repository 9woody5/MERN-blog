import * as mongoose from "mongoose";
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: String,
    content: { type: String, required: true },
    thumb: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

// 인덱스 추가로 쿼리 성능 향상
PostSchema.index({ createdAt: -1 }); // 정렬을 위한 인덱스
PostSchema.index({ author: 1 }); // populate를 위한 인덱스
PostSchema.index({ title: "text", summary: "text", content: "text" }); // 텍스트 검색을 위한 인덱스

const Post = model("Post", PostSchema);

export default Post;
