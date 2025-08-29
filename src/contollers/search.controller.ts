import { Request, Response } from "express";
import { searchAll } from "../services/search.services";

export async function searchController(req: Request, res: Response) {
  const q = String(req.query.q ?? "").trim();
  if (!q) return res.json({ results: [] });
  const results = await searchAll(q);
  res.json({ results });
}
