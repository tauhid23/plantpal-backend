import { Request, Response } from "express";
import {
  createComment,
  deleteComment,
  listCommentsForPlant,
} from "../services/comment.service";

export const getComments = async (req: Request, res: Response) => {
  const plantId = Number(req.params.plantId);
  const comments = await listCommentsForPlant(plantId);
  res.json({ comments });
};

export const addComment = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const plantId = Number(req.params.plantId);
  const { content } = req.body ?? {};
  if (!content) return res.status(400).json({ error: "content is required" });

  const created = await createComment({ content, plantId, userId: me.id });
  res.status(201).json({ comment: created });
};

export const removeComment = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const id = Number(req.params.commentId);
  const ok = await deleteComment(id, me.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
};
