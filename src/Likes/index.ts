import { Router } from "express";
import { LikesController } from "./controller";

export const likesRouter = Router();

const like = new LikesController();

likesRouter.get("/get-user-likes", like.get.bind(like));

likesRouter.post("/", like.create.bind(like));

likesRouter.delete("/unlike/:id", like.delete.bind(like));
