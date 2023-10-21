import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken";
import { envConfig } from "../config/envConfig";

/**
 * Authentication Middleware
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns If success then proceed to next() , else error response
 */
export function isAuthutenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Response<any, Record<string, any>> | undefined {
  try {
    let token = req.cookies.authorization;

    if (!token) {
      return res.status(403).json({ message: "Unauthenticated!" });
    }

    const user: any = verify(token, envConfig.JWT_SECRET);
    req.userId = user.id;

    next();
  } catch (error: any) {
    res
      .status(401)
      .json({ message: "Authentication Error.", error: error.message });
    if (error instanceof JsonWebTokenError) {
      console.log(error instanceof JsonWebTokenError);
      res.status(401).json({ message: "Unauthenticated" });
    }
    return res;
  }
}
