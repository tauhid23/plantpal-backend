import { Plant } from "../models";
import { TPlant, TPlantCreateInput } from "../types/plant";

export async function createPlant(input: TPlantCreateInput): Promise<TPlant> {
  const plant = await Plant.create(input);
  return plant.get({ plain: true }) as TPlant;
}

export async function getMyPlants(userId: number) {
  const rows = await Plant.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  return rows.map((r) => r.get({ plain: true }) as TPlant);
}

export async function getPlantById(id: number, userId?: number) {
  const where: any = { id };
  // if userId is passed, enforce ownership (used for edit/delete endpoints)
  if (typeof userId === "number") where.userId = userId;
  const plant = await Plant.findOne({ where });
  return plant ? (plant.get({ plain: true }) as TPlant) : null;
}

export async function updatePlant(
  id: number,
  userId: number,
  patch: Partial<TPlantCreateInput>
) {
  const plant = await Plant.findOne({ where: { id, userId } });
  if (!plant) return null;
  await plant.update(patch);
  return plant.get({ plain: true }) as TPlant;
}

export async function deletePlant(id: number, userId: number) {
  const count = await Plant.destroy({ where: { id, userId } });
  return count > 0;
}

export async function listAllPlants() {
  const rows = await Plant.findAll({ order: [["updatedAt", "DESC"]] });
  return rows.map((r) => r.get({ plain: true }) as TPlant);
}
