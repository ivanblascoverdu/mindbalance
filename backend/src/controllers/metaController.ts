import type { Request, Response } from "express";
import Meta from "../models/Meta.js";

export const obtenerMetas = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).usuarioId;
    const metas = await Meta.find({ usuario: usuarioId }).sort({ createdAt: -1 });
    res.json(metas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener metas", error });
  }
};

export const crearMeta = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, fechaObjetivo } = req.body;
    const nuevaMeta = new Meta({
      usuario: (req as any).usuarioId,
      titulo,
      descripcion,
      fechaObjetivo,
    });
    await nuevaMeta.save();
    res.status(201).json(nuevaMeta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear meta", error });
  }
};

export const toggleMeta = async (req: Request, res: Response) => {
  try {
    const meta = await Meta.findById(req.params.id);
    if (!meta) return res.status(404).json({ mensaje: "Meta no encontrada" });

    meta.completada = !meta.completada;
    await meta.save();
    res.json(meta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar meta", error });
  }
};

export const borrarMeta = async (req: Request, res: Response) => {
    try {
      const meta = await Meta.findByIdAndDelete(req.params.id);
      if (!meta) return res.status(404).json({ mensaje: "Meta no encontrada" });
      res.json({ mensaje: "Meta eliminada" });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al eliminar meta", error });
    }
  };
