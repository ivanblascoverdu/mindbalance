import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const JWT_SECRET = env.JWT_SECRET;

export const autenticar = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        mensaje: "Token no proporcionado",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).usuarioId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({
      mensaje: "Token inválido o expirado",
    });
  }
};
