import { Router } from "express";
import { authRequired } from "../middlewares/auth";
import {
  createOne,
  getOne,
  listByPlant,
  listMine,
  quickComplete,
  removeOne,
  updateOne,
} from "../contollers/activity.controller";

const router = Router();

// all routes authed
router.use(authRequired);

// Mine
router.get("/", listMine); // /api/activities?from=...&to=...&onlyOpen=true

// By plant
router.get("/plant/:plantId", listByPlant);

// get, post, update and delete
router.get("/:id", getOne);
router.post("/", createOne);
router.put("/:id", updateOne);
router.delete("/:id", removeOne);

// Quick complete
router.post("/:id/complete", quickComplete);

export default router;
