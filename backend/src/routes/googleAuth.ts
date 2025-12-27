import { Router } from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-super-secreta";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Generar Token
const generarToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Verificar token de Google y crear/autenticar usuario
// @route   POST /api/auth/google
// @access  Public
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ mensaje: "Token de Google requerido" });
        }

        // Decodificar el JWT de Google (el token ya viene verificado del frontend)
        const payload = JSON.parse(
            Buffer.from(credential.split(".")[1], "base64").toString()
        );

        const { sub: googleId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ mensaje: "Email no disponible en el token" });
        }

        // Buscar usuario por googleId o email
        let usuario = await Usuario.findOne({
            $or: [{ googleId }, { email }],
        });

        if (usuario) {
            // Usuario existe, actualizar googleId si no lo tiene
            if (!usuario.googleId) {
                usuario.googleId = googleId;
                await usuario.save();
            }

            // Verificar estado del usuario
            if (usuario.estado === "pendiente") {
                return res.status(403).json({
                    mensaje: "Tu cuenta está pendiente de aprobación.",
                });
            }

            if (usuario.estado === "inactivo") {
                return res.status(403).json({
                    mensaje: "Tu cuenta ha sido desactivada.",
                });
            }
        } else {
            // Crear nuevo usuario con Google
            usuario = await Usuario.create({
                nombre: name || email.split("@")[0],
                email,
                googleId,
                rol: "usuario",
                estado: "activo",
            });
        }

        // Generar JWT y responder
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            puntos: usuario.puntos,
            nivel: usuario.nivel,
            suscripcion: usuario.suscripcion,
            token: generarToken(usuario._id as string),
        });
    } catch (error) {
        console.error("Error en autenticación con Google:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

export default router;
