import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import JOI from "joi";
import { Request, Response } from "express";
import { ForgetPassword } from "../model";
import { envConfig } from "../config/envConfig";
import { UserService } from "./service";
import { error } from "../helpers/errorHelper";

export class AuthController {
  protected forgetPasswordData: ForgetPassword = {};

  async signUp(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const validation = JOI.object()
      .keys({
        username: JOI.string().required().min(3),
        email: JOI.string().required().email(),
        password: JOI.string().required().min(8),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }

    try {
      const userService = new UserService();
      const { username, email, password } = req.body;

      const existingUser = await userService.isExists(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      req.body.password = hashPassword;

      const token = sign({ email: email }, envConfig.SECRET_KEY, {
        expiresIn: "24h",
      });

      const user: any = await userService.create(req.body);

      return res.status(200).json({
        message: `Your account has been created successfully! on ${user.email} </b>`,
        user,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    const validation = JOI.object()
      .keys({
        email: JOI.string().required().email(),
        password: JOI.string().required().min(8),
      })
      .validate(req.body, { abortEarly: false });

    if (validation.error) {
      return error("validationError", validation, res);
    }
    try {
      const { email, password } = req.body;
      const userService: UserService = new UserService();
      const user: any = await userService.get(req.body);

      if (!user) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

      const matchPassword = bcrypt.compareSync(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({ message: "Invalid Email or Password" });
      }

      const token = sign(
        { email: user.email, id: user.id },
        envConfig.SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.cookie("authorization", token, {
        //  httpOnly: true,
        //  secure: true,
        //  sameSite: "strict"
      });

      user["token"] = token;
      delete user.password;

      return res.status(200).json({
        message: "Successfuly Login ",
        user,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async signOut(req: Request, res: Response) {
    try {
      res.cookie("authorization", "null", { maxAge: 1 });
      res.status(200).json({ message: "Logout Successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
