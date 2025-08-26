import { Request, Response } from "express";
import {
  createPlant,
  deletePlant,
  getMyPlants,
  getPlantById,
  updatePlant,
} from "../services/plant.service";
import { uploadImage } from "../services/upload.service";
import { TPlantCreateInput } from "../types/plant";

export const listMyPlants = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const plants = await getMyPlants(me.id);
  res.json({ plants });
};

export const getPlant = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const plant = await getPlantById(id);
  if (!plant) return res.status(404).json({ error: "Not found" });
  res.json({ plant });
};

export const createPlantCtrl = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const { name, description, category, waterFrequency } = req.body;

  if (!name || !description || !category) {
    return res
      .status(400)
      .json({ error: "name, description, category are required" });
  }

  let imageUrl: string | undefined;
  if ((req as any).file?.buffer) {
    imageUrl = await uploadImage(
      (req as any).file.buffer,
      `plant-${Date.now()}`
    );
  }

  const input: TPlantCreateInput = {
    name,
    description,
    category,
    waterFrequency: Number(waterFrequency ?? 0),
    imageUrl: imageUrl ?? (undefined as any),
    userId: me.id,
  };

  const plant = await createPlant(input);
  res.status(201).json({ plant });
};

export const updatePlantCtrl = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const id = Number(req.params.id);
  const patch: Partial<TPlantCreateInput> = {};

  const { name, description, category, waterFrequency } = req.body;
  if (name !== undefined) patch.name = name;
  if (description !== undefined) patch.description = description;
  if (category !== undefined) patch.category = category;
  if (waterFrequency !== undefined)
    patch.waterFrequency = Number(waterFrequency);

  if ((req as any).file?.buffer) {
    patch.imageUrl = await uploadImage(
      (req as any).file.buffer,
      `plant-${id}-${Date.now()}`
    );
  }

  const updated = await updatePlant(id, me.id, patch);
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json({ plant: updated });
};

export const deletePlantCtrl = async (req: Request, res: Response) => {
  const me = (req as any).user as { id: number };
  const id = Number(req.params.id);
  const ok = await deletePlant(id, me.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
};
