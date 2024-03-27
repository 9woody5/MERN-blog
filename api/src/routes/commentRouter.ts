import * as express from "express";
import * as commentController from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.post("/post/:postId/comments", commentController.createComment);
commentRouter.get("/post/:postId/comments", commentController.getCommentsByPostId);
commentRouter.put("/comments/:id", commentController.updateComment);
commentRouter.delete("/comments/:id", commentController.deleteComment);

export default commentRouter;
