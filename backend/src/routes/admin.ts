import { Router } from "express";
import { listarUsuarios, aprobarUsuario, cambiarEstadoUsuario } from "../controllers/adminController.js";
import { autenticar } from "../middleware/auth.js";
import { requireRol } from "../middleware/authRole.js";

const router = Router();

// Todas las rutas requieren ser admin
router.use(autenticar, requireRol("admin"));

router.get("/usuarios", listarUsuarios);
router.put("/usuarios/:id/aprobar", aprobarUsuario);
router.put("/usuarios/:id/estado", cambiarEstadoUsuario);

export default router;
