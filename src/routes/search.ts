import { Router } from "express";
import { searchController } from "../contollers/search.controller";

const router = Router();
router.get("/", searchController);

export default router;
