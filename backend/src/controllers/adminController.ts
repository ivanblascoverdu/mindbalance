import type { Request, Response } from "express";
import Usuario from "../models/Usuario.js";

// Listar todos los usuarios (para admin)
export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    console.log("[AdminController] Listing users...");
    const usuarios = await Usuario.find().select("-password").sort({ fechaRegistro: -1 });
    console.log(`[AdminController] Found ${usuarios.length} users`);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar usuarios", error });
  }
};

// Aprobar usuario (profesional pendiente -> activo)
export const aprobarUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.estado = "activo";
    await usuario.save();

    res.json({ mensaje: "Usuario aprobado correctamente", usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al aprobar usuario", error });
  }
};

// Rechazar/Desactivar usuario
export const cambiarEstadoUsuario = async (req: Request, res: Response) => {
    try {
      const { estado } = req.body; // 'inactivo', 'pendiente', 'activo'
      const usuario = await Usuario.findByIdAndUpdate(
        req.params.id, 
        { estado }, 
        { new: true }
      );
      
      if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
      
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al cambiar estado", error });
    }
  };
