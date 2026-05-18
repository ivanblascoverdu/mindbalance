import { Router } from "express";
import { chatWithAI, chatSuggestions } from "../controllers/chatController.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

// Sugerencias iniciales (no requiere autenticación, no expone nada sensible)
router.get("/suggestions", chatSuggestions);

// Chat protegido — solo usuarios autenticados
router.post("/", autenticar, chatWithAI);

export default router;
