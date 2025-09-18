import * as express from "express";
import * as postController from "../controllers/postController";
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // text field (e.g., content) up to 10MB
    fileSize: 10 * 1024 * 1024,  // single file up to 10MB
    files: 1,
    fields: 20,
  },
});

const postRouter = express.Router();

postRouter.post("/", uploadMiddleware.single("file"), postController.createPost);
postRouter.put("/:id", uploadMiddleware.single("file"), postController.updatePost);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:id", postController.getPostById);
postRouter.post("/:id/like", postController.toggleLike);
postRouter.delete("/:id", postController.deletePost);

export default postRouter;
