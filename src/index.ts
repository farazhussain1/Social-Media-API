import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./Auth/index";
import cors from "cors";
import { connectionRouter } from "./Connection";
import { isAuthutenticated } from "./middleware/auth.middleware";
import { postRouter } from "./Posts";
import { likesRouter } from "./Likes";
import { commentsRouter } from "./comments";

const port = process.env.PORT || 5000;

const app = express();

app.get("/", (req, res) => res.json("service is running & up!"));

app.use(
  cors({
    origin: ["http://localhost:5000", "*"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/connection", isAuthutenticated, connectionRouter);
app.use("/api/post", isAuthutenticated, postRouter);
app.use("/api/likes", isAuthutenticated, likesRouter);
app.use("/api/comments", isAuthutenticated, commentsRouter);

app.listen(Number(port), () =>
  console.log("server is running at port " + Number(port))
);

// process.on("exit", () => {
//   process.exit(1);
// })
