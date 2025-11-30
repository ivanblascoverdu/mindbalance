import type { Request, Response, NextFunction } from "express";
import Programa from "../models/Programa.js";

// Crear programa
export const crearPrograma = async (req: Request, res: Response) => {
  try {
    const nuevoPrograma = new Programa(req.body);
    await nuevoPrograma.save();
    res.status(201).json(nuevoPrograma);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el programa", error });
  }
};

// Listar todos
export const listarProgramas = async (req: Request, res: Response) => {
  try {
    const programas = await Programa.find();
    res.json(programas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar programas", error });
  }
};

// Obtener uno por ID
export const obtenerPrograma = async (req: Request, res: Response) => {
  try {
    const programa = await Programa.findById(req.params.id);
    if (!programa)
      return res.status(404).json({ mensaje: "Programa no encontrado" });
    res.json(programa);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar el programa", error });
  }
};

// Editar programa
export const editarPrograma = async (req: Request, res: Response) => {
  try {
    const programa = await Programa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!programa)
      return res.status(404).json({ mensaje: "Programa no encontrado" });
    res.json(programa);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar el programa", error });
  }
};

// Borrar programa
export const borrarPrograma = async (req: Request, res: Response) => {
  try {
    const programa = await Programa.findByIdAndDelete(req.params.id);
    if (!programa)
      return res.status(404).json({ mensaje: "Programa no encontrado" });
    res.json({ mensaje: "Programa borrado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al borrar el programa", error });
  }
};
