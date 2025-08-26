import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  id: number;
  username: string;
}

export function authRequired(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
