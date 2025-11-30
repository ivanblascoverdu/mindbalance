import { Router } from "express";
import {
  crearPrograma,
  listarProgramas,
  obtenerPrograma,
  editarPrograma,
  borrarPrograma,
} from "../controllers/programaController.js";
import { autenticar, requireRol } from "../middleware/authRole.js";

const router = Router();

router.get("/", listarProgramas);
router.get("/:id", obtenerPrograma);
// SOLO admin y profesional
router.post("/", autenticar, requireRol("admin", "profesional"), crearPrograma);
router.put(
  "/:id",
  autenticar,
  requireRol("admin", "profesional"),
  editarPrograma
);
router.delete(
  "/:id",
  autenticar,
  requireRol("admin", "profesional"),
  borrarPrograma
);

export default router;
