import { Router } from "express";
import {
  registro,
  login,
  obtenerUsuarioActual,
} from "../controllers/authController";
import { autenticar } from "../middlewares/auth";

const router = Router();

router.post("/registro", registro);
router.post("/login", login);
router.get("/me", autenticar, obtenerUsuarioActual);

export default router;
