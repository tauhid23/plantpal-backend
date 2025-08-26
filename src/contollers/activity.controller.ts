import { Request, Response } from "express";
import {
  completeActivity,
  createActivity,
  deleteActivity,
  getActivityById,
  listMyActivities,
  listPlantActivities,
  updateActivity,
} from "../services/activity.service";
import { TActivityCreateInput } from "../types/activity";

const ALLOWED_TYPES = new Set([
  "water",
  "fertilize",
  "insecticide",
  "weed",
  "custom",
]);

export const listMine = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const { from, to, onlyOpen } = req.query;

  const opts: { from?: Date; to?: Date; onlyOpen?: boolean } = {
    onlyOpen: onlyOpen === "true",
  };
  if (from) opts.from = new Date(String(from));
  if (to) opts.to = new Date(String(to));

  const activities = await listMyActivities(me.id, opts);
  res.json({ activities });
};

export const listByPlant = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const plantId = Number(req.params.plantId);
  const activities = await listPlantActivities(me.id, plantId);
  res.json({ activities });
};

export const getOne = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const id = Number(req.params.id);
  const activity = await getActivityById(id, me.id);
  if (!activity) return res.status(404).json({ error: "Not found" });
  res.json({ activity });
};

export const createOne = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const { plantId, title, type, notes, dueAt } = req.body ?? {};

  if (!plantId || !title || !type || !dueAt) {
    return res
      .status(400)
      .json({ error: "plantId, title, type, dueAt are required" });
  }
  if (!ALLOWED_TYPES.has(type)) {
    return res.status(400).json({ error: "Invalid type" });
  }
  const d = new Date(dueAt);
  if (Number.isNaN(d.getTime())) {
    return res.status(400).json({ error: "Invalid dueAt date" });
  }

  const input: TActivityCreateInput = {
    plantId: Number(plantId),
    userId: me.id,
    title,
    type,
    notes: notes ?? null,
    dueAt: d, // service will convert to UTC
    completedAt: null,
  };

  const activity = await createActivity(input);
  res.status(201).json({ activity });
};

export const updateOne = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const id = Number(req.params.id);

  const patch: any = {};
  const { title, type, notes, dueAt } = req.body ?? {};
  if (title !== undefined) patch.title = title;
  if (type !== undefined) {
    if (!ALLOWED_TYPES.has(type))
      return res.status(400).json({ error: "Invalid type" });
    patch.type = type;
  }
  if (notes !== undefined) patch.notes = notes;
  if (dueAt !== undefined) {
    const d = new Date(dueAt);
    if (Number.isNaN(d.getTime()))
      return res.status(400).json({ error: "Invalid dueAt" });
    patch.dueAt = d;
  }

  const updated = await updateActivity(id, me.id, patch);
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ activity: updated });
};

export const removeOne = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const id = Number(req.params.id);
  const ok = await deleteActivity(id, me.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
};

export const quickComplete = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const id = Number(req.params.id);
  const updated = await completeActivity(id, me.id);
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ activity: updated });
};
