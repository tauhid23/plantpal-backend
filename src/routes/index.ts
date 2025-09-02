import { Router } from "express";
import userRoutes from "./users";
import plantRoutes from "./plants";
import commentRoutes from "./comments";
import activityRoutes from "./activities";
import searchRoutes from "./search";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "Welcome to PlantPal API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      users: "/users",
      plants: "/plants",
      comments: "/comments",
      activities: "/activities",
      search: "/search"
    }
  });
});

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.use("/users", userRoutes);
router.use("/plants", plantRoutes);
router.use("/comments", commentRoutes);
router.use("/activities", activityRoutes);
router.use("/search", searchRoutes);

export default router;
