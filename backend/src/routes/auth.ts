import { Router } from "express";
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
} from "../controllers/authController.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/me", autenticar, obtenerPerfil);

export default router;
