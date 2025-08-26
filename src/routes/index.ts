import { Router } from "express";
import userRoutes from "./users";
import plantRoutes from "./plants";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.use("/users", userRoutes);
router.use("/plants", plantRoutes);

export default router;
