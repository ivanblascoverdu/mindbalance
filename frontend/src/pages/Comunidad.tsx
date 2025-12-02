import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  Grid,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ShareIcon from "@mui/icons-material/Share";
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
  const [tabValue, setTabValue] = useState(0);
  const { usuario } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/posts");
      if (data && data.length > 0) {
        setPosts(data);
      } else {
        setPosts([
          {
            _id: "1",
            usuario: { _id: "u1", nombre: "Ana García", email: "ana@test.com" },
            texto: "Hoy he completado mi primera semana de meditación. ¡Me siento mucho más tranquila!",
            likes: ["u2", "u3"],
            comentarios: [
              { usuario: { _id: "u2", nombre: "Carlos" }, texto: "¡Enhorabuena! Sigue así.", createdAt: new Date().toISOString() }
            ],
            createdAt: new Date().toISOString(),
          },
          {
            _id: "2",
            usuario: { _id: "u3", nombre: "Pedro López", email: "pedro@test.com" },
            texto: "¿Alguien tiene consejos para manejar el estrés laboral?",
            likes: [],
            comentarios: [],
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error cargando posts:", error);
      // Fallback
      setPosts([
          {
            _id: "1",
            usuario: { _id: "u1", nombre: "Ana García", email: "ana@test.com" },
            texto: "Hoy he completado mi primera semana de meditación. ¡Me siento mucho más tranquila!",
            likes: ["u2", "u3"],
            comentarios: [],
            createdAt: new Date().toISOString(),
          },
      ]);
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

  const groups = [
    { id: 1, name: "Ansiedad y Estrés", members: 1240, description: "Apoyo mutuo para manejar la ansiedad diaria.", platform: "Discord" },
    { id: 2, name: "Mindfulness Diario", members: 850, description: "Compartimos prácticas y experiencias de atención plena.", platform: "Telegram" },
    { id: 3, name: "Padres Conscientes", members: 430, description: "Crianza respetuosa y bienestar familiar.", platform: "WhatsApp" },
    { id: 4, name: "Superando el Insomnio", members: 620, description: "Consejos y apoyo para dormir mejor.", platform: "Discord" },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Comunidad
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Comparte tu progreso, conecta con otros usuarios y encuentra apoyo
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Feed General" />
            <Tab label="Grupos de Apoyo" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
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
                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleCrearPost}
                            disabled={!nuevoPost.trim()}
                        >
                            Publicar
                        </Button>
                    </Box>
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
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>Tendencias</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Chip label="#Mindfulness" onClick={() => {}} />
                            <Chip label="#Ansiedad" onClick={() => {}} />
                            <Chip label="#SueñoReparador" onClick={() => {}} />
                            <Chip label="#YogaEnCasa" onClick={() => {}} />
                        </Box>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>Usuarios Sugeridos</Typography>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar>L</Avatar>
                            <Box>
                                <Typography variant="subtitle2">Laura M.</Typography>
                                <Typography variant="caption" color="text.secondary">Interesada en Yoga</Typography>
                            </Box>
                        </Box>
                         <Box display="flex" alignItems="center" gap={2}>
                            <Avatar>P</Avatar>
                            <Box>
                                <Typography variant="subtitle2">Pablo R.</Typography>
                                <Typography variant="caption" color="text.secondary">Experto en Meditación</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
          <Grid container spacing={3}>
              {groups.map(group => (
                  <Grid size={{ xs: 12, md: 6 }} key={group.id}>
                      <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                                  <Typography variant="h6" fontWeight={700}>{group.name}</Typography>
                                  <Chip label={group.platform} size="small" color="primary" variant="outlined" />
                              </Box>
                              <Typography color="text.secondary" paragraph>
                                  {group.description}
                              </Typography>
                              <Typography variant="caption" display="block" mb={2}>
                                  {group.members} miembros activos
                              </Typography>
                              <Box display="flex" gap={1}>
                                  <Button variant="contained" startIcon={<GroupAddIcon />} fullWidth>
                                      Unirse
                                  </Button>
                                  <Button variant="outlined" startIcon={<ShareIcon />}>
                                      Invitar
                                  </Button>
                              </Box>
                          </CardContent>
                      </Card>
                  </Grid>
              ))}
          </Grid>
      )}
    </Box>
  );
}
