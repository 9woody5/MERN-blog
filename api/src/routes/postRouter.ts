import * as express from "express";
import * as postController from "../controllers/postController";

const postRouter = express.Router();

postRouter.post("/", postController.createPost);
postRouter.put("/", postController.updatePost);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:id", postController.getPostById);

export default postRouter;
