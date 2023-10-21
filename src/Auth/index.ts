import express from "express";
import { AuthController } from "./controller";
// import { UserController } from "../controllers/userController";
import { UserService } from "./service";
import { AuthMap } from "../middleware/Auth";
import { isAuthutenticated } from "../middleware/auth.middleware";
import upload from "../middleware/multerUpload";

export const authRouter = express.Router();

const auth = new AuthController();

authRouter.post("/register", auth.signUp);

authRouter.post("/login", auth.signIn);

authRouter.post("/logout", auth.signOut);
