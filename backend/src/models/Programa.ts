import mongoose, { Document, Schema } from "mongoose";

export interface ISesionContenido {
  titulo: string;
  descripcion?: string;
  videoUrl?: string;
  puntos?: number;
  duracion?: string;
}

export interface IPrograma extends Document {
  titulo: string;
  descripcion: string;
  duracion: string;
  sesiones: number;
  sesionesCompletadas: number;
  color: string;
  categoria: string;
  contenido: ISesionContenido[];
  isPremium?: boolean;
  createdAt: Date;
}

const sesionContenidoSchema = new Schema<ISesionContenido>(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String },
    videoUrl: { type: String },
    puntos: { type: Number, default: 50 },
    duracion: { type: String },
  },
  { _id: false }
);

const programaSchema = new Schema<IPrograma>({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  duracion: {
    type: String,
    required: true,
  },
  sesiones: {
    type: Number,
    required: true,
  },
  sesionesCompletadas: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: "#1479fb",
  },
  categoria: {
    type: String,
    enum: ["mindfulness", "emoción", "sueño", "estrés"],
    required: true,
  },
  contenido: {
    type: [sesionContenidoSchema],
    default: [],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IPrograma>("Programa", programaSchema);
