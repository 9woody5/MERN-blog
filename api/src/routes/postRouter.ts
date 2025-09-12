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

const uploadMiddleware = multer({ storage: storage });

const postRouter = express.Router();

postRouter.post("/", uploadMiddleware.single("file"), postController.createPost);
postRouter.put("/:id", uploadMiddleware.single("file"), postController.updatePost);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:id", postController.getPostById);
postRouter.delete("/:id", postController.deletePost);

export default postRouter;
