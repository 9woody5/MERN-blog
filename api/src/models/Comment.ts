import * as mongoose from "mongoose";
const { Schema, model } = mongoose;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", CommentSchema);

export default Comment;
