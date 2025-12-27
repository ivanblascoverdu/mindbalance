import mongoose, { Document, Schema } from "mongoose";

export interface IRecurso extends Document {
  titulo: string;
  descripcion: string;
  tipo: "articulo" | "video" | "audio";
  url: string; // Link al contenido o archivo
  categoria: string; // Ej: "Ansiedad", "Depresión", "Autoestima"
  tags: string[];
  imagen?: string;
  esPremium: boolean;
  createdAt: Date;
}

const recursoSchema = new Schema<IRecurso>({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: { type: String, enum: ["articulo", "video", "audio"], required: true },
  url: { type: String, required: true },
  categoria: { type: String, required: true },
  tags: [{ type: String }],
  imagen: { type: String },
  esPremium: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRecurso>("Recurso", recursoSchema);
