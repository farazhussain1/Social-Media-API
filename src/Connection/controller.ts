import JOI, { object } from "joi";
import { Request, Response } from "express";
import { ForgetPassword } from "../model";
import { envConfig } from "../config/envConfig";
import { ConnectionService } from "./service";
import { error } from "../helpers/errorHelper";
import { FriendshipStatus, User } from "@prisma/client";

export class ConnectionController {
  protected forgetPasswordData: ForgetPassword = {};

  async user(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const connectionService = new ConnectionService();
      const query = req.query;

      let user: any = await connectionService.getUser(req.userId);
      user["friends"] = [];
      user["request"] = [];
      user?.friendReqSent.filter((obj: any) => {
        user.friends.push(obj.user2);
      });
      user?.friendReqReceived.filter((obj: any) => {
        user.friends.push(obj.user1);
        obj.friendStatus == "Requested" ? user.request.push(obj) : false;
      });
      delete user.friendReqReceived;
      delete user.friendReqSent;
      console.log(user);

      const userToConn: any = await connectionService.getUserToConn(
        req.userId,
        user.friends
      );
      if (!userToConn) {
        return res.status(400).json({ message: "No User to Connect" });
      }

      return res.status(200).json({
        message: `Recommended Connections`,
        user,
        userToConn,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async request(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        requestedUser: JOI.number().required(),
        connectionType: JOI.string()
          .valid(...Object.values(FriendshipStatus))
          .required(),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }

    try {
      const { requestedUser, connectionType } = req.body;
      const connectionService = new ConnectionService();

      const exist: any = await connectionService.requestExist(
        req.userId,
        requestedUser
      );
      if (exist) {
        return res.status(409).json({ message: "Request already exist" });
      }

      const user: any = await connectionService.createRequest(
        req.userId,
        requestedUser,
        connectionType
      );

      return res.status(200).json({
        message: "Successfuly Requested connection ",
        user,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async accept(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        connectionId: JOI.number().required(),
        connectionType: JOI.string()
          .valid(...Object.values(FriendshipStatus))
          .required(),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }
    try {
      const { connectionId, connectionType } = req.body;
      console.log(connectionId, connectionType);

      const connectionService = new ConnectionService();
      const user = await connectionService.updateConnection(
        connectionId,
        connectionType
      );
      console.log(user);

      res.status(200).json({
        message: "Connection Status Updated Successfully",
        user,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
