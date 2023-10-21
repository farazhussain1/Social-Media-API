import JOI from "joi";
import { Request, Response } from "express";
import { CommentsService } from "./service";
import { error } from "../helpers/errorHelper";

export class CommentsController {
  constructor(
    private commentsService: CommentsService = new CommentsService()
  ) {}
  async get(req: Request, res: Response) {
    try {
      let comments = await this.commentsService.get(req.userId);
      return res.status(200).json({ message: "Success", comments });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        postId: JOI.number().required(),
        comment: JOI.string().required(),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }

    try {
      const { postId, comment } = req.body;
      const comments = await this.commentsService.create(
        req.userId,
        postId,
        comment
      );
      if (comments) {
        const postUpdate = await this.commentsService.UpdateActivity(postId);
        console.log(postUpdate);
      }
      return res
        .status(200)
        .json({ message: "Commented on Post Successfully", comments });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        comment: JOI.string().optional(),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }
    try {
      const comments = await this.commentsService.update(
        req.userId,
        +req.params.id,
        req.body
      );
      console.log(comments);
      if (!comments.count) {
        return res.status(400).json({ message: "Post Comment does not exist" });
      }
      return res
        .status(200)
        .json({ message: "Comment on Post Updated Successfully", comments });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const comments = await this.commentsService.delete(
        +req.params.id,
        req.userId
      );
      console.log(comments);
      if (!comments.count) {
        return res.status(404).json({ message: "Post Comment not found" });
      }
      return res
        .status(200)
        .json({ message: "Post Comment Deleted Sucessfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
