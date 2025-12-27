import { Router } from "express";
import { chatWithAI } from "../controllers/chatController.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

// Protegemos la ruta para que solo usuarios autenticados puedan usar el chat
router.post("/", autenticar, chatWithAI);

export default router;
