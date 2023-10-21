import express from "express";
import { ConnectionController } from "./controller";
import { AuthMap } from "../middleware/Auth";
import { isAuthutenticated } from "../middleware/auth.middleware";
import upload from "../middleware/multerUpload";

export const connectionRouter = express.Router();

const connection = new ConnectionController();

connectionRouter.get("/user", connection.user);

connectionRouter.post("/request", connection.request);

connectionRouter.put("/accept", connection.accept);
