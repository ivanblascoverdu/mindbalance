import type { Request, Response } from "express";
import Post from "../models/Post.js";

export const obtenerPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("usuario", "nombre email")
      .populate("comentarios.usuario", "nombre")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener posts", error });
  }
};

export const crearPost = async (req: Request, res: Response) => {
  try {
    const { texto } = req.body;
    const nuevoPost = new Post({
      usuario: (req as any).usuarioId,
      texto,
    });
    await nuevoPost.save();
    const postPoblado = await Post.findById(nuevoPost._id).populate(
      "usuario",
      "nombre"
    );
    res.status(201).json(postPoblado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear post", error });
  }
};

export const darLike = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ mensaje: "Post no encontrado" });

    const usuarioId = (req as any).usuarioId;

    if (post.likes.includes(usuarioId)) {
      post.likes = post.likes.filter((id) => id.toString() !== usuarioId);
    } else {
      post.likes.push(usuarioId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al dar like", error });
  }
};

export const comentarPost = async (req: Request, res: Response) => {
  try {
    const { texto } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ mensaje: "Post no encontrado" });

    const nuevoComentario = {
      usuario: (req as any).usuarioId,
      texto,
      createdAt: new Date(),
    };

    post.comentarios.push(nuevoComentario);
    await post.save();
    
    // Repopular para devolver el comentario con nombre
    const postActualizado = await Post.findById(req.params.id)
        .populate("usuario", "nombre")
        .populate("comentarios.usuario", "nombre");

    res.json(postActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al comentar", error });
  }
};
