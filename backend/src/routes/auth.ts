import { Router } from "express";
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
} from "../controllers/authController.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/me", autenticar, obtenerPerfil);
router.put("/me", autenticar, actualizarPerfil);

export default router;
