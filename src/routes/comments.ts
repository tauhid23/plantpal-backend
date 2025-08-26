import { Router } from "express";
import {
  addComment,
  getComments,
  removeComment,
} from "../contollers/comment.controller";
import { authRequired } from "../middlewares/auth";

const router = Router();

router.get("/plants/:plantId/comments", getComments);

router.post("/plants/:plantId/comments", authRequired, addComment);

router.delete("/comments/:commentId", authRequired, removeComment);

export default router;
