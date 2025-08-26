import { Router } from "express";
import { login, me, signup } from "../contollers/user.controller";
import { authRequired } from "../middlewares/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authRequired, me);
