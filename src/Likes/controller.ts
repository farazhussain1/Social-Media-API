import JOI from "joi";
import { Request, Response } from "express";
import { LikesService } from "./service";
import { error } from "../helpers/errorHelper";

export class LikesController {
  constructor(private likesService: LikesService = new LikesService()) {}
  async get(req: Request, res: Response) {
    try {
      let likes = await this.likesService.get(req.userId);
      return res.status(200).json({ message: "Success", likes });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        postId: JOI.number().required(),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }

    try {
      const { postId } = req.body;

      const likeExist = await this.likesService.isExist(req.userId, postId);
      if (likeExist) {
        return res
          .status(409)
          .json({ message: "Already liked Post", likeExist });
      }

      const like = await this.likesService.create(req.userId, postId);
      if (like) {
        const postUpdate = await this.likesService.UpdateActivity(postId);
        console.log(postUpdate);
      }
      return res.status(200).json({ message: "Post liked Successfully", like });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const unliked = await this.likesService.delete(
        +req.params.id,
        req.userId
      );
      console.log(unliked);
      if (!unliked.count) {
        return res.status(404).json({ message: "Post liked not found" });
      }
      return res.status(200).json({ message: "Post Unliked Sucessfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
