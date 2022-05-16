import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];
  if (!token) return res.status(400).json("unauthorized");
  jwt.verify(token, process.env.SECRET_KEY as string, (error, user) => {
    if (error) return res.status(403).json({ error: error });
    req.user = user;
  });
  next();
}
