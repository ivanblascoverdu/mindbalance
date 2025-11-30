import type { Request, Response } from "express";
import Recurso from "../models/Recurso.js";

export const obtenerRecursos = async (req: Request, res: Response) => {
  try {
    const { categoria, tipo } = req.query;
    const filtro: any = {};
    if (categoria) filtro.categoria = categoria;
    if (tipo) filtro.tipo = tipo;

    const recursos = await Recurso.find(filtro).sort({ createdAt: -1 });
    res.json(recursos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener recursos", error });
  }
};

export const crearRecurso = async (req: Request, res: Response) => {
  try {
    const nuevoRecurso = new Recurso(req.body);
    await nuevoRecurso.save();
    res.status(201).json(nuevoRecurso);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear recurso", error });
  }
};
