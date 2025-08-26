import { Request, Response } from "express";
import {
  createUser,
  findByCredentials,
  publicUser,
  signToken,
} from "../services/user.service";
import { User } from "../models";
import { TUser } from "../types/user";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body ?? {};
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "username, email, password are required" });
  }

  try {
    const u = await createUser({ username, email, password });
    const token = signToken(u);
    return res.status(201).json({ user: publicUser(u), token });
  } catch (err: any) {
    const message =
      err?.name === "SequelizeUniqueConstraintError"
        ? "Username or email already in use"
        : "Failed to create user";
    return res.status(400).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body ?? {}; // identifier = username or email
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "identifier and password are required" });
  }

  const u = await findByCredentials(identifier, password);
  if (!u) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(u);
  return res.json({ user: publicUser(u), token });
};

// export const me = async (req: Request, res: Response) => {
//   // `authRequired` puts payload at req.user
//   const user = (req as any).user;
//   return res.json({ user });
// };

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const dbUser = await User.findByPk(req.user.id);
  if (!dbUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const plain = dbUser.get({ plain: true }) as TUser;
  return res.json({ user: publicUser(plain) });
};
