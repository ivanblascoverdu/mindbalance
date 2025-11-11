import mongoose, { Document, Schema } from "mongoose";

export interface IPrograma extends Document {
  titulo: string;
  descripcion: string;
  duracion: string;
  sesiones: number;
  sesionesCompletadas: number;
  color: string;
  categoria: string;
  contenido: string[];
  createdAt: Date;
}

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
  contenido: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IPrograma>("Programa", programaSchema);
