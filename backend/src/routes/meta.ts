import { Router } from "express";
import {
  obtenerMetas,
  crearMeta,
  toggleMeta,
  borrarMeta,
} from "../controllers/metaController.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

router.get("/", autenticar, obtenerMetas);
router.post("/", autenticar, crearMeta);
router.put("/:id/toggle", autenticar, toggleMeta);
router.delete("/:id", autenticar, borrarMeta);

export default router;
