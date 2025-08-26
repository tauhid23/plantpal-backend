import { Router } from "express";
import {
  createPlantCtrl,
  deletePlantCtrl,
  getPlant,
  listMyPlants,
  updatePlantCtrl,
} from "../contollers/plant.controller";
import { authRequired } from "../middlewares/auth";
import { upload } from "../middlewares/multer";

const router = Router();

// Public: read single plant
router.get("/:id", getPlant);

// Auth: my plants
router.get("/", authRequired, listMyPlants);

// Auth: create/update/delete (image optional as multipart/form-data key "image")
router.post("/", authRequired, upload.single("image"), createPlantCtrl);
router.put("/:id", authRequired, upload.single("image"), updatePlantCtrl);
router.delete("/:id", authRequired, deletePlantCtrl);

export default router;
