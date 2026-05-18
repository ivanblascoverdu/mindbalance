import { Router } from "express";
import {
  listarCitas,
  crearCita,
  actualizarCita,
  listarProfesionales,
  cancelarCita,
} from "../controllers/citaController.js";
import { autenticar } from "../middleware/auth.js";
import { requireRol } from "../middleware/authRole.js";

const router = Router();

router.get("/", autenticar, listarCitas);
router.post("/", autenticar, crearCita);
router.put("/:id", autenticar, requireRol("profesional", "admin"), actualizarCita);
router.delete("/:id", autenticar, cancelarCita);
router.get("/profesionales", autenticar, listarProfesionales);

export default router;
