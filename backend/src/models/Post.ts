import mongoose, { Document, Schema } from "mongoose";

export interface IComentario {
  usuario: mongoose.Types.ObjectId;
  texto: string;
  createdAt: Date;
}

export interface IPost extends Document {
  usuario: mongoose.Types.ObjectId;
  texto: string;
  likes: mongoose.Types.ObjectId[]; // Array de IDs de usuarios que dieron like
  comentarios: IComentario[];
  createdAt: Date;
}

const comentarioSchema = new Schema<IComentario>({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  texto: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new Schema<IPost>({
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  texto: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "Usuario" }],
  comentarios: [comentarioSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>("Post", postSchema);
