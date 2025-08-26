import { Router } from "express";
import userRoutes from "./users";
import plantRoutes from "./plants";
import commentRoutes from "./comments";
import activityRoutes from "./activities";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.use("/users", userRoutes);
router.use("/plants", plantRoutes);
router.use("/", commentRoutes);
router.use("/activities", activityRoutes);

export default router;
