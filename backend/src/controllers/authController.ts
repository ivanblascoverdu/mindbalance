import type { Request, Response } from "express";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-super-secreta";

// Generar Token
const generarToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/registro
// @access  Public
// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/registro
// @access  Public
export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, confirmPassword, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Por favor complete todos los campos" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ mensaje: "Las contraseñas no coinciden" });
    }

    // Verificar si el usuario existe
    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Determinar estado inicial
    const rolUsuario = rol === "profesional" ? "profesional" : "usuario";
    const estadoInicial = rolUsuario === "profesional" ? "pendiente" : "activo";

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      rol: rolUsuario,
      estado: estadoInicial,
    });

    if (usuario) {
      // Si es profesional, no devolvemos token aún (o devolvemos mensaje específico)
      if (estadoInicial === "pendiente") {
        return res.status(201).json({
          mensaje: "Registro exitoso. Tu cuenta de profesional está pendiente de aprobación por un administrador.",
          pendiente: true,
        });
      }

      res.status(201).json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        puntos: usuario.puntos,
        nivel: usuario.nivel,
        token: generarToken(usuario._id as string),
      });
    } else {
      res.status(400).json({ mensaje: "Datos de usuario inválidos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Public
export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Verificar email
    const usuario = await Usuario.findOne({ email }).select("+password");

    if (usuario && (await usuario.matchPassword(password))) {
      if (usuario.estado === "pendiente") {
        return res.status(403).json({ 
          mensaje: "Tu cuenta está pendiente de aprobación. Contacta con el administrador." 
        });
      }

      if (usuario.estado === "inactivo") {
        return res.status(403).json({ 
          mensaje: "Tu cuenta ha sido desactivada." 
        });
      }

      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        puntos: usuario.puntos,
        nivel: usuario.nivel,
        token: generarToken(usuario._id as string),
      });
    } else {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};

// @desc    Obtener datos del usuario actual
// @route   GET /api/auth/me
// @access  Private
export const obtenerPerfil = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findById((req as any).usuarioId);

    if (usuario) {
      res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        puntos: usuario.puntos,
        nivel: usuario.nivel,
      });
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
