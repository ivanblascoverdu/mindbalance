import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario";

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-super-secreta";

// Autenticación básica (verifica el token)
export const autenticar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ mensaje: "Token no proporcionado" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const usuario = await Usuario.findById(payload.id);
    if (!usuario) return res.status(401).json({ mensaje: "Token inválido" });
    (req as any).usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

// Control de rol - solo administrador o profesional pueden crear/editar/borrar programas
export const requireRol = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;
    if (!usuario || !roles.includes(usuario.rol)) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }
    next();
  };
};
