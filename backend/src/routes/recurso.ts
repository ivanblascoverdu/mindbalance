import { Router } from "express";
import { obtenerRecursos, crearRecurso } from "../controllers/recursoController.js";
import { autenticar } from "../middleware/auth.js";
import { requireRol } from "../middleware/authRole.js";

const router = Router();

router.get("/", autenticar, obtenerRecursos);
router.post("/", autenticar, requireRol("admin", "profesional"), crearRecurso);

export default router;
