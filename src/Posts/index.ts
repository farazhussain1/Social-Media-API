import { Router } from "express";
import { PostController } from "./controller";
import upload from "../middleware/multerUpload";

export const postRouter = Router();

const post = new PostController();

postRouter.get("/", post.get.bind(post));

postRouter.post("/", post.create.bind(post));

postRouter.put("/:id", post.update.bind(post));

postRouter.delete("/:id", post.delete.bind(post));
