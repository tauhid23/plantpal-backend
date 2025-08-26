import { Op } from "sequelize";
import { Activity } from "../models";
import { TActivity, TActivityCreateInput } from "../types/activity";

//always store utc timestamp
function toUtcDate(input: string | Date): Date {
  const d = typeof input === "string" ? new Date(input) : input;
  // If invalid date, let controller validate; here we just return
  return new Date(d.toISOString()); //convert date to date obj if string/utc time
}

export async function createActivity(
  input: TActivityCreateInput
): Promise<TActivity> {
  const row = await Activity.create({
    ...input,
    dueAt: toUtcDate(input.dueAt),
  });
  return row.get({ plain: true }) as TActivity;
}

export async function listMyActivities(
  userId: number,
  opts?: { from?: Date; to?: Date; onlyOpen?: boolean }
) {
  const where: any = { userId };
  if (opts?.onlyOpen) where.completedAt = { [Op.is]: null };
  if (opts?.from || opts?.to) {
    where.dueAt = {};
    if (opts.from) where.dueAt[Op.gte] = opts.from;
    if (opts.to) where.dueAt[Op.lte] = opts.to;
  }
  const rows = await Activity.findAll({ where, order: [["dueAt", "ASC"]] });
  return rows.map((r) => r.get({ plain: true }) as TActivity);
}

export async function listPlantActivities(userId: number, plantId: number) {
  const rows = await Activity.findAll({
    where: { userId, plantId },
    order: [["dueAt", "ASC"]],
  });
  return rows.map((r) => r.get({ plain: true }) as TActivity);
}

export async function getActivityById(id: number, userId: number) {
  const row = await Activity.findOne({ where: { id, userId } });
  return row ? (row.get({ plain: true }) as TActivity) : null;
}

export async function updateActivity(
  id: number,
  userId: number,
  patch: Partial<TActivityCreateInput>
) {
  const row = await Activity.findOne({ where: { id, userId } });
  if (!row) return null;

  // Normalize UTC if dueAt provided
  const updates: any = { ...patch };
  if (patch.dueAt) updates.dueAt = toUtcDate(patch.dueAt);

  await row.update(updates);
  return row.get({ plain: true }) as TActivity;
}

export async function deleteActivity(id: number, userId: number) {
  const count = await Activity.destroy({ where: { id, userId } });
  return count > 0;
}

export async function completeActivity(id: number, userId: number) {
  const row = await Activity.findOne({ where: { id, userId } });
  if (!row) return null;
  await row.update({ completedAt: new Date() }); // now (UTC by default in PG)
  return row.get({ plain: true }) as TActivity;
}

/** simple finder for reminders: due in [now, now+minutes], still open */
export async function getDueActivitiesWithin(minutes: number) {
  const now = new Date();
  const later = new Date(now.getTime() + minutes * 60 * 1000);
  const rows = await Activity.findAll({
    where: {
      completedAt: { [Op.is]: null },
      dueAt: { [Op.gte]: now, [Op.lte]: later },
    },
    order: [["dueAt", "ASC"]],
  });
  return rows.map((r) => r.get({ plain: true }) as TActivity);
}
