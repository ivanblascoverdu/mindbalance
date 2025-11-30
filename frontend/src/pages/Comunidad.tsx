import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useAuth } from "../context/AuthContext";

interface Comentario {
  usuario: { _id: string; nombre: string };
  texto: string;
  createdAt: string;
}

interface Post {
  _id: string;
  usuario: { _id: string; nombre: string; email: string };
  texto: string;
  likes: string[];
  comentarios: Comentario[];
  createdAt: string;
}

export default function Comunidad() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nuevoPost, setNuevoPost] = useState("");
  const [comentarioTexto, setComentarioTexto] = useState<{ [key: string]: string }>({});
  const [mostrarComentarios, setMostrarComentarios] = useState<{ [key: string]: boolean }>({});
  const { usuario } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (error) {
      console.error("Error cargando posts:", error);
    }
  };

  const handleCrearPost = async () => {
    if (!nuevoPost.trim()) return;
    try {
      await api.post("/posts", { texto: nuevoPost });
      setNuevoPost("");
      fetchPosts();
    } catch (error) {
      console.error("Error creando post:", error);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await api.put(`/posts/${id}/like`);
      fetchPosts(); // Recargar para ver like actualizado (o actualizar localmente)
    } catch (error) {
      console.error("Error dando like:", error);
    }
  };

  const handleComentar = async (id: string) => {
    const texto = comentarioTexto[id];
    if (!texto?.trim()) return;
    try {
      await api.post(`/posts/${id}/comentar`, { texto });
      setComentarioTexto({ ...comentarioTexto, [id]: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error comentando:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Comunidad
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Comparte tu progreso, conecta con otros usuarios y encuentra apoyo
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={`¿Qué quieres compartir hoy, ${usuario?.nombre}?`}
            variant="outlined"
            value={nuevoPost}
            onChange={(e) => setNuevoPost(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleCrearPost}
            disabled={!nuevoPost.trim()}
          >
            Publicar
          </Button>
        </CardContent>
      </Card>

      {posts.map((post) => (
        <Card key={post._id} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                {post.usuario.nombre.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{post.usuario.nombre}</Typography>
                <Typography fontSize={12} color="text.secondary">
                  {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
            <Typography mb={2}>{post.texto}</Typography>

            <Box display="flex" gap={2} alignItems="center">
              <Button
                startIcon={
                  post.likes.includes(usuario?._id || "") ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )
                }
                size="small"
                onClick={() => handleLike(post._id)}
              >
                {post.likes.length} Me gusta
              </Button>
              <Button
                startIcon={<ChatBubbleOutlineIcon />}
                size="small"
                onClick={() =>
                  setMostrarComentarios({
                    ...mostrarComentarios,
                    [post._id]: !mostrarComentarios[post._id],
                  })
                }
              >
                {post.comentarios.length} Comentarios
              </Button>
            </Box>

            {mostrarComentarios[post._id] && (
              <Box mt={2} pl={2} borderLeft="2px solid #eee">
                {post.comentarios.map((c, idx) => (
                  <Box key={idx} mb={1}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {c.usuario.nombre}
                    </Typography>
                    <Typography variant="body2">{c.texto}</Typography>
                  </Box>
                ))}
                <Box mt={2} display="flex" gap={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Escribe un comentario..."
                    value={comentarioTexto[post._id] || ""}
                    onChange={(e) =>
                      setComentarioTexto({
                        ...comentarioTexto,
                        [post._id]: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleComentar(post._id)}
                  >
                    Enviar
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
