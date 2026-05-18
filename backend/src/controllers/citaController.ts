import type { Request, Response } from "express";
import Cita from "../models/Cita.js";
import Usuario from "../models/Usuario.js";

// Listar citas (si es profesional ve todas las suyas, si es usuario ve las suyas)
export const listarCitas = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).usuarioId;
    const usuario = await Usuario.findById(usuarioId);

    let filtro = {};
    if (usuario?.rol === "profesional") {
      filtro = { profesional: usuarioId };
    } else {
      filtro = { cliente: usuarioId };
    }

    const citas = await Cita.find(filtro)
      .populate("cliente", "nombre email")
      .populate("profesional", "nombre email")
      .sort({ fecha: 1 });

    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar citas", error });
  }
};

// Crear cita (Usuario solicita a un profesional)
export const crearCita = async (req: Request, res: Response) => {
  try {
    const { profesionalId, fecha, notas } = req.body;
    const clienteId = (req as any).usuarioId;

    const nuevaCita = new Cita({
      cliente: clienteId,
      profesional: profesionalId,
      fecha,
      notas,
      estado: "pendiente",
    });

    await nuevaCita.save();
    res.status(201).json(nuevaCita);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear cita", error });
  }
};

// Actualizar estado (Profesional confirma/cancela)
export const actualizarCita = async (req: Request, res: Response) => {
  try {
    const { estado, linkReunion } = req.body;
    const cita = await Cita.findByIdAndUpdate(
      req.params.id,
      { estado, linkReunion },
      { new: true }
    );
    res.json(cita);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar cita", error });
  }
};

// Listar profesionales disponibles (para que el usuario elija)
export const listarProfesionales = async (req: Request, res: Response) => {
  try {
    const profesionales = await Usuario.find({ rol: "profesional" }).select(
      "nombre email"
    );
    res.json(profesionales);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar profesionales", error });
  }
};

// Cancelar cita (el cliente que la creó o el profesional asignado)
export const cancelarCita = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).usuarioId;
    const cita = await Cita.findById(req.params.id);

    if (!cita) {
      return res.status(404).json({ mensaje: "Cita no encontrada" });
    }

    const esCliente = cita.cliente.toString() === usuarioId;
    const esProfesional = cita.profesional.toString() === usuarioId;
    const usuario = await Usuario.findById(usuarioId);
    const esAdmin = usuario?.rol === "admin";

    if (!esCliente && !esProfesional && !esAdmin) {
      return res.status(403).json({ mensaje: "No tienes permiso para cancelar esta cita" });
    }

    await Cita.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Cita cancelada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cancelar cita", error });
  }
};
