import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Usuario, { IUsuario } from "../models/Usuario";

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-super-secreta";

// Generar token JWT
const generarToken = (usuarioId: string) => {
  return jwt.sign({ id: usuarioId }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTRO
export const registro = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, confirmPassword } = req.body;

    // Validaciones
    if (!nombre || !email || !password || !confirmPassword) {
      return res.status(400).json({
        mensaje: "Por favor, completa todos los campos",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        mensaje: "Las contraseñas no coinciden",
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: "Este email ya está registrado",
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password,
    });

    await nuevoUsuario.save();

    // Generar token
    const token = generarToken(nuevoUsuario._id.toString());

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        mensaje: "Email y contraseña son requeridos",
      });
    }

    // Buscar usuario y incluir password (normalmente está oculto)
    const usuario = await Usuario.findOne({ email }).select("+password");

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    // Verificar password
    const passwordValida = await usuario.matchPassword(password);
    if (!passwordValida) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas",
      });
    }

    // Generar token
    const token = generarToken(usuario._id.toString());

    res.json({
      mensaje: "Sesión iniciada correctamente",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
};

// OBTENER USUARIO ACTUAL (requiere token)
export const obtenerUsuarioActual = async (req: Request, res: Response) => {
  try {
    // El middleware de autenticación debería setear req.usuarioId
    const usuarioId = (req as any).usuarioId;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: "No autorizado",
      });
    }

    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    });
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({
      mensaje: "Error en el servidor",
    });
  }
};
