import { Router } from "express";
import userRoutes from "./users";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.use("/users", userRoutes);

export default router;
