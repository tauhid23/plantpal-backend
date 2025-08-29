import { Op } from "sequelize";
import { Plant, User, Comment } from "../models";

export type SearchResult =
  | {
      kind: "plant";
      id: number;
      name: string;
      imageUrl?: string | null;
      snippet?: string | null;
    }
  | { kind: "user"; id: number; username: string }
  | { kind: "comment"; id: number; plantId: number; snippet: string };

export async function searchAll(q: string): Promise<SearchResult[]> {
  const term = q.trim();
  if (!term) return [];

  const like = { [Op.iLike]: `%${term}%` };

  const [plants, users, comments] = await Promise.all([
    Plant.findAll({
      where: {
        [Op.or]: [{ name: like }, { category: like }, { description: like }],
      },
      attributes: ["id", "name", "imageUrl", "category"],
      limit: 5,
      order: [["updatedAt", "DESC"]],
    }),
    User.findAll({
      where: { username: like },
      attributes: ["id", "username"],
      limit: 5,
      order: [["username", "ASC"]],
    }),
    Comment.findAll({
      where: { content: like },
      attributes: ["id", "plantId", "content"],
      limit: 5,
      order: [["createdAt", "DESC"]],
    }),
  ]);

  const plantRes: SearchResult[] = plants.map((p: any) => ({
    kind: "plant",
    id: p.id,
    name: p.name,
    imageUrl: p.imageUrl,
    snippet: p.category ?? null,
  }));

  const userRes: SearchResult[] = users.map((u: any) => ({
    kind: "user",
    id: u.id,
    username: u.username,
  }));

  const commentRes: SearchResult[] = comments.map((c: any) => ({
    kind: "comment",
    id: c.id,
    plantId: c.plantId,
    snippet: c.content.slice(0, 100),
  }));

  return [...plantRes, ...userRes, ...commentRes].slice(0, 12);
}
