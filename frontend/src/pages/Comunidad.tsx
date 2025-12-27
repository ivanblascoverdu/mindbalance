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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
// CheckIcon and ContentCopyIcon removed - not currently used
import { useAuth } from "../context/AuthContext";

interface Comentario {
  usuario: { _id: string; nombre: string };
  texto: string;
  createdAt: string;
}

interface Post {
  _id: string;
  usuario: { _id: string; nombre: string; email: string; avatar?: string };
  texto: string;
  likes: string[];
  comentarios: Comentario[];
  createdAt: string;
  hashtags?: string[];
}

interface MockUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  posts: Post[];
}

const TRENDING_HASHTAGS = [
  { tag: "#Mindfulness", count: "12.5k posts" },
  { tag: "#Ansiedad", count: "8.2k posts" },
  { tag: "#SueñoReparador", count: "5.1k posts" },
  { tag: "#YogaEnCasa", count: "3.4k posts" },
  { tag: "#SaludMental", count: "25k posts" },
  { tag: "#Autocuidado", count: "18k posts" },
  { tag: "#MeditaciónDiaria", count: "9k posts" },
  { tag: "#Bienestar", count: "15k posts" },
];

const MOCK_USERS: MockUser[] = [
  {
    id: "u_mock_1",
    name: "Sofía Rodríguez",
    handle: "@sofia_mind",
    avatar: "https://i.pravatar.cc/150?u=sofia",
    bio: "Instructora de Yoga y amante de la naturaleza. 🌿 Buscando el equilibrio diario.",
    followers: 1250,
    following: 340,
    isFollowing: false,
    posts: [
      { _id: "p_m_1", usuario: { _id: "u_mock_1", nombre: "Sofía Rodríguez", email: "" }, texto: "Nada como empezar el día con 20 minutos de yoga al sol. ☀️ #YogaEnCasa #Bienestar", likes: [], comentarios: [], createdAt: new Date().toISOString() },
      { _id: "p_m_2", usuario: { _id: "u_mock_1", nombre: "Sofía Rodríguez", email: "" }, texto: "Recordatorio: está bien tomarse un descanso. No tienes que ser productivo 24/7.", likes: [], comentarios: [], createdAt: new Date().toISOString() }
    ]
  },
  {
    id: "u_mock_2",
    name: "Dr. Miguel Ángel",
    handle: "@dr_miguel",
    avatar: "https://i.pravatar.cc/150?u=miguel",
    bio: "Psicólogo clínico especializado en ansiedad. Compartiendo herramientas basadas en evidencia.",
    followers: 5600,
    following: 120,
    isFollowing: false,
    posts: [
        { _id: "p_m_3", usuario: { _id: "u_mock_2", nombre: "Dr. Miguel Ángel", email: "" }, texto: "La ansiedad no es tu enemiga, es una señal. Escúchala, pero no dejes que conduzca el coche. #Ansiedad #SaludMental", likes: [], comentarios: [], createdAt: new Date().toISOString() }
    ]
  },
  {
    id: "u_mock_3",
    name: "Luna Wellness",
    handle: "@luna_well",
    avatar: "https://i.pravatar.cc/150?u=luna",
    bio: "Compartiendo mi viaje de recuperación y crecimiento personal. ✨",
    followers: 890,
    following: 500,
    isFollowing: false,
    posts: [
        { _id: "p_m_4", usuario: { _id: "u_mock_3", nombre: "Luna Wellness", email: "" }, texto: "Hoy ha sido un día difícil, pero he logrado meditar 5 minutos. Pequeños pasos. #Autocuidado", likes: [], comentarios: [], createdAt: new Date().toISOString() }
    ]
  },
  {
    id: "u_mock_4",
    name: "Carlos FitMind",
    handle: "@carlos_fit",
    avatar: "https://i.pravatar.cc/150?u=carlos",
    bio: "Mens sana in corpore sano. Deporte y meditación.",
    followers: 2100,
    following: 450,
    isFollowing: false,
    posts: []
  }
];

export default function Comunidad() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nuevoPost, setNuevoPost] = useState("");
  const [comentarioTexto, setComentarioTexto] = useState<{ [key: string]: string }>({});
  const [mostrarComentarios, setMostrarComentarios] = useState<{ [key: string]: boolean }>({});
  const [tabValue, setTabValue] = useState(0);
  const { usuario } = useAuth();
  
  // New States
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<MockUser[]>(MOCK_USERS);
  const [selectedUserProfile, setSelectedUserProfile] = useState<MockUser | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    fetchPosts();
  }, [activeHashtag]);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get("/posts");
      let loadedPosts = data && data.length > 0 ? data : [];
      
      // Fallback data if empty
      if (loadedPosts.length === 0) {
        loadedPosts = [
          {
            _id: "1",
            usuario: { _id: "u1", nombre: "Ana García", email: "ana@test.com" },
            texto: "Hoy he completado mi primera semana de meditación. ¡Me siento mucho más tranquila! #Mindfulness",
            likes: ["u2", "u3"],
            comentarios: [
              { usuario: { _id: "u2", nombre: "Carlos" }, texto: "¡Enhorabuena! Sigue así.", createdAt: new Date().toISOString() }
            ],
            createdAt: new Date().toISOString(),
          },
          {
            _id: "2",
            usuario: { _id: "u3", nombre: "Pedro López", email: "pedro@test.com" },
            texto: "¿Alguien tiene consejos para manejar el estrés laboral? #Ansiedad",
            likes: [],
            comentarios: [],
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
      }

      // Filter by hashtag if active
      if (activeHashtag) {
        const hashtagClean = activeHashtag.replace("#", "").toLowerCase();
        // Filter existing posts
        const filtered = loadedPosts.filter((p: Post) => p.texto.toLowerCase().includes(hashtagClean));
        
        // Add mock posts for the hashtag to make it look populated
        const mockHashtagPosts = [
            { _id: `ht_1_${hashtagClean}`, usuario: { _id: "mock_h1", nombre: "Usuario Anónimo", email: "" }, texto: `Me encanta todo lo relacionado con ${activeHashtag}. Es muy útil.`, likes: ["u1"], comentarios: [], createdAt: new Date().toISOString() },
            { _id: `ht_2_${hashtagClean}`, usuario: { _id: "mock_h2", nombre: "Comunidad Zen", email: "" }, texto: `Aquí compartiendo recursos sobre ${activeHashtag}.`, likes: ["u2", "u3"], comentarios: [], createdAt: new Date().toISOString() },
            { _id: `ht_3_${hashtagClean}`, usuario: { _id: "mock_h3", nombre: "MindBalance Official", email: "" }, texto: `Nuevo artículo sobre ${activeHashtag} disponible en la biblioteca.`, likes: ["u1", "u2", "u3", "u4"], comentarios: [], createdAt: new Date().toISOString() },
        ];
        
        setPosts([...filtered, ...mockHashtagPosts]);
      } else {
        setPosts(loadedPosts);
      }

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
    // Optimistic update for mock posts or real posts
    setPosts(posts.map(p => {
        if (p._id === id) {
            const hasLiked = p.likes.includes(usuario?._id || "me");
            return {
                ...p,
                likes: hasLiked ? p.likes.filter(uid => uid !== (usuario?._id || "me")) : [...p.likes, (usuario?._id || "me")]
            };
        }
        return p;
    }));

    if (!id.startsWith("ht_") && !id.startsWith("p_m_")) { // Only call API for real posts
        try {
            await api.put(`/posts/${id}/like`);
        } catch (error) {
            console.error("Error dando like:", error);
        }
    }
  };

  const handleComentar = async (id: string) => {
    const texto = comentarioTexto[id];
    if (!texto?.trim()) return;
    
    // Optimistic update
    const newComment = { usuario: { _id: usuario?._id || "me", nombre: usuario?.nombre || "Yo" }, texto, createdAt: new Date().toISOString() };
    setPosts(posts.map(p => p._id === id ? { ...p, comentarios: [...p.comentarios, newComment] } : p));
    setComentarioTexto({ ...comentarioTexto, [id]: "" });

    if (!id.startsWith("ht_") && !id.startsWith("p_m_")) {
        try {
            await api.post(`/posts/${id}/comentar`, { texto });
        } catch (error) {
            console.error("Error comentando:", error);
        }
    }
  };

  const toggleFollow = (userId: string) => {
    setSuggestedUsers(suggestedUsers.map(u => {
        if (u.id === userId) {
            return { ...u, isFollowing: !u.isFollowing, followers: u.isFollowing ? u.followers - 1 : u.followers + 1 };
        }
        return u;
    }));
    if (selectedUserProfile && selectedUserProfile.id === userId) {
        setSelectedUserProfile(prev => prev ? ({ ...prev, isFollowing: !prev.isFollowing, followers: !prev.isFollowing ? prev.followers + 1 : prev.followers - 1 }) : null);
    }
  };

  const handleJoinGroup = (groupName: string, platform: string) => {
      // Simulate joining
      window.open(`https://${platform.toLowerCase()}.com/invite/${groupName.replace(/\s/g, "")}`, "_blank");
      setSnackbar({ open: true, message: `Te has unido al grupo de ${groupName}` });
  };

  const handleShareGroup = (groupName: string) => {
      const link = `https://mindbalance.app/groups/${groupName.replace(/\s/g, "-").toLowerCase()}`;
      navigator.clipboard.writeText(link);
      setSnackbar({ open: true, message: "Enlace de invitación copiado al portapapeles" });
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
                {activeHashtag && (
                    <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" bgcolor="primary.light" p={2} borderRadius={2} color="white">
                        <Typography fontWeight={700}>Explorando: {activeHashtag}</Typography>
                        <IconButton size="small" onClick={() => setActiveHashtag(null)} sx={{ color: "white" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                )}

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
                        <Avatar sx={{ bgcolor: "primary.main", mr: 2 }} src={post.usuario.avatar}>
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
                            post.likes.includes(usuario?._id || "me") ? (
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
                        <Typography variant="h6" fontWeight={700} gutterBottom>Tendencias para ti</Typography>
                        <List dense>
                            {TRENDING_HASHTAGS.map((item, index) => (
                                <ListItem 
                                    key={index} 
                                    component="button"
                                    onClick={() => setActiveHashtag(item.tag)}
                                    sx={{ 
                                        borderRadius: 1, 
                                        bgcolor: activeHashtag === item.tag ? "action.selected" : "transparent",
                                        border: "none",
                                        width: "100%",
                                        textAlign: "left",
                                        cursor: "pointer"
                                    }}
                                >
                                    <ListItemText 
                                        primary={<Typography fontWeight={600}>{item.tag}</Typography>} 
                                        secondary={item.count} 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>A quién seguir</Typography>
                        <List>
                            {suggestedUsers.map(u => (
                                <Box key={u.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar src={u.avatar} onClick={() => setSelectedUserProfile(u)} sx={{ cursor: "pointer" }} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography 
                                                    variant="subtitle2" 
                                                    fontWeight={700} 
                                                    onClick={() => setSelectedUserProfile(u)}
                                                    sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                                                >
                                                    {u.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="caption" color="text.secondary" display="block">
                                                        {u.handle}
                                                    </Typography>
                                                    <Button 
                                                        size="small" 
                                                        variant={u.isFollowing ? "outlined" : "contained"} 
                                                        color={u.isFollowing ? "inherit" : "primary"}
                                                        sx={{ mt: 0.5, borderRadius: 4, textTransform: "none", py: 0, fontSize: "0.75rem" }}
                                                        onClick={() => toggleFollow(u.id)}
                                                        startIcon={!u.isFollowing && <PersonAddIcon fontSize="small" />}
                                                    >
                                                        {u.isFollowing ? "Siguiendo" : "Seguir"}
                                                    </Button>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </Box>
                            ))}
                        </List>
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
                                  <Button 
                                    variant="contained" 
                                    startIcon={<GroupAddIcon />} 
                                    fullWidth
                                    onClick={() => handleJoinGroup(group.name, group.platform)}
                                  >
                                      Unirse
                                  </Button>
                                  <Button 
                                    variant="outlined" 
                                    startIcon={<ShareIcon />}
                                    onClick={() => handleShareGroup(group.name)}
                                  >
                                      Invitar
                                  </Button>
                              </Box>
                          </CardContent>
                      </Card>
                  </Grid>
              ))}
          </Grid>
      )}

      {/* User Profile Modal */}
      <Dialog open={!!selectedUserProfile} onClose={() => setSelectedUserProfile(null)} maxWidth="sm" fullWidth>
        {selectedUserProfile && (
            <>
                <Box sx={{ height: 100, bgcolor: "primary.main", position: "relative" }}>
                    <IconButton 
                        onClick={() => setSelectedUserProfile(null)} 
                        sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent sx={{ mt: -6 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={2}>
                        <Avatar 
                            src={selectedUserProfile.avatar} 
                            sx={{ width: 100, height: 100, border: "4px solid white" }} 
                        />
                        <Button 
                            variant={selectedUserProfile.isFollowing ? "outlined" : "contained"}
                            color={selectedUserProfile.isFollowing ? "inherit" : "primary"}
                            onClick={() => toggleFollow(selectedUserProfile.id)}
                            sx={{ mb: 2, borderRadius: 5 }}
                        >
                            {selectedUserProfile.isFollowing ? "Siguiendo" : "Seguir"}
                        </Button>
                    </Box>
                    <Typography variant="h5" fontWeight={700}>{selectedUserProfile.name}</Typography>
                    <Typography color="text.secondary" gutterBottom>{selectedUserProfile.handle}</Typography>
                    <Typography paragraph>{selectedUserProfile.bio}</Typography>
                    
                    <Box display="flex" gap={3} mb={3}>
                        <Box display="flex" gap={0.5}>
                            <Typography fontWeight={700}>{selectedUserProfile.following}</Typography>
                            <Typography color="text.secondary">Siguiendo</Typography>
                        </Box>
                        <Box display="flex" gap={0.5}>
                            <Typography fontWeight={700}>{selectedUserProfile.followers}</Typography>
                            <Typography color="text.secondary">Seguidores</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" fontWeight={700} gutterBottom>Actividad Reciente</Typography>
                    {selectedUserProfile.posts.length > 0 ? (
                        selectedUserProfile.posts.map(post => (
                            <Card key={post._id} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography>{post.texto}</Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography color="text.secondary" align="center" py={4}>
                            Este usuario aún no ha publicado nada.
                        </Typography>
                    )}
                </DialogContent>
            </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
            <IconButton size="small" color="inherit" onClick={() => setSnackbar({ ...snackbar, open: false })}>
                <CloseIcon fontSize="small" />
            </IconButton>
        }
      />
    </Box>
  );
}
