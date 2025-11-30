import { Router } from "express";
import {
  obtenerPosts,
  crearPost,
  darLike,
  comentarPost,
} from "../controllers/postController.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

router.get("/", autenticar, obtenerPosts);
router.post("/", autenticar, crearPost);
router.put("/:id/like", autenticar, darLike);
router.post("/:id/comentar", autenticar, comentarPost);

export default router;
