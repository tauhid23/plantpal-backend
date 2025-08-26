import { env } from "../config/env";
import { TUser, TUserCreateInput } from "../types/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models";
import { Op } from "sequelize";

const SALT_ROUNDS = 10;

export async function createUser(input: TUserCreateInput): Promise<TUser> {
  const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await User.create({ ...input, password: hashed });
  return user.get({ plain: true }) as TUser;
}

export async function findByCredentials(
  usernameOrEmail: string,
  password: string
): Promise<TUser | null> {
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    },
  });

  if (!user) return null;
  const ok = await bcrypt.compare(
    password,
    (user.get("password") as string) ?? ""
  );
  if (!ok) return null;
  return user.get({ plain: true }) as TUser;
}

export function signToken(user: Pick<TUser, "id" | "username" | "email">) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function publicUser(u: TUser) {
  const { password, ...rest } = u;
  return rest;
}
