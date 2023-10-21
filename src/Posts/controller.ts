import JOI from "joi";
import { Request, Response } from "express";
import { PostService } from "./service";
import { error } from "../helpers/errorHelper";

export class PostController {
  constructor(private postService: PostService = new PostService()) {}

  async getByKeyword(req: Request, res: Response) {
    try {
      let user: any = await this.postService.getUserFriends(req.userId);
      user["friends"] = [];
      user?.friendReqSent.filter((obj: any) => {
        user.friends.push(obj.user2);
      });
      user?.friendReqReceived.filter((obj: any) => {
        user.friends.push(obj.user1);
      });
      delete user.friendReqReceived;
      delete user.friendReqSent;
      const posts = await this.postService.getByKeyword(
        req.userId,
        user.friends,
        req.params.keyword
      );
      return res.status(200).json({ message: "Success", posts });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      let user: any = await this.postService.getUserFriends(req.userId);
      user["friends"] = [];
      user?.friendReqSent.filter((obj: any) => {
        user.friends.push(obj.user2);
      });
      user?.friendReqReceived.filter((obj: any) => {
        user.friends.push(obj.user1);
      });
      delete user.friendReqReceived;
      delete user.friendReqSent;
      const posts = await this.postService.get(req.userId, user.friends);
      return res.status(200).json({ message: "Success", posts });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        title: JOI.string().required(),
        description: JOI.string().required(),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }

    try {
      const { title, description } = req.body;
      const post = await this.postService.create(
        req.userId,
        title,
        description
      );
      return res
        .status(200)
        .json({ message: "Post published Successfully", post });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        title: JOI.string().optional(),
        description: JOI.string().optional(),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }
    try {
      const post = await this.postService.update(
        req.userId,
        +req.params.id,
        req.body
      );
      console.log(post);
      if (!post.count) {
        return res.status(400).json({ message: "Post does not exist" });
      }
      return res
        .status(200)
        .json({ message: "Post Updated Successfully", post });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      console.log("here");

      const post = await this.postService.delete(+req.params.id, req.userId);
      console.log(post);
      if (!post.count) {
        console.log("here");
        return res.status(404).json({ message: "Post not found", post });
      }
      return res.status(200).json({ message: "Post Deleted Sucessfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
