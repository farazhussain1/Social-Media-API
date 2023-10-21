import { Router } from "express";
import { CommentsController } from "./controller";

export const commentsRouter = Router();

const comments = new CommentsController();

commentsRouter.get("/get-user-comments", comments.get.bind(comments));

commentsRouter.post("/", comments.create.bind(comments));

commentsRouter.put("/:id", comments.update.bind(comments));

commentsRouter.delete("/:id", comments.delete.bind(comments));
