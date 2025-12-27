import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Tabs,
  Tab,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import ArticleIcon from "@mui/icons-material/Article";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthContext";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

interface Recurso {
  _id: string;
  titulo: string;
  descripcion: string;
  tipo: "articulo" | "video" | "audio";
  url: string;
  categoria: string;
  tags: string[];
  esPremium?: boolean;
}

export default function Biblioteca() {
  const [loading, setLoading] = useState(true);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const { usuario } = useAuth();
  const isAdmin = usuario?.rol === "admin";
  const navigate = useNavigate();
  
  // Check if user has premium subscription
  const hasSubscription = 
    usuario?.rol === "admin" || 
    usuario?.rol === "profesional" || 
    usuario?.suscripcion === "premium" || 
    usuario?.suscripcion === "profesional";

  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const { data } = await api.get("/recursos");
        if (data && data.length > 0) {
          setRecursos(data);
        } else {
          setRecursos([
            {
              _id: "1",
              titulo: "Técnicas de Respiración Profunda",
              descripcion: "Guía paso a paso para calmar la mente en situaciones de estrés.",
              tipo: "articulo",
              url: "https://example.com/respiracion",
              categoria: "Ansiedad",
              tags: ["respiración", "estrés"],
              esPremium: false,
            },
            {
              _id: "2",
              titulo: "Meditación Guiada para Dormir",
              descripcion: "Audio de 15 minutos para ayudarte a conciliar el sueño.",
              tipo: "audio",
              url: "https://example.com/audio.mp3",
              categoria: "Sueño",
              tags: ["meditación", "insomnio"],
              esPremium: true,
            },
            {
              _id: "3",
              titulo: "Entendiendo tus Emociones",
              descripcion: "Video explicativo sobre cómo identificar y procesar emociones.",
              tipo: "video",
              url: "https://example.com/video",
              categoria: "Inteligencia Emocional",
              tags: ["emociones", "psicología"],
              esPremium: false,
            },
            {
              _id: "4",
              titulo: "Beneficios del Ejercicio en la Salud Mental",
              descripcion: "Artículo sobre la conexión mente-cuerpo.",
              tipo: "articulo",
              url: "https://example.com/ejercicio",
              categoria: "Bienestar",
              tags: ["salud", "ejercicio"],
              esPremium: true,
            },
            {
              _id: "5",
              titulo: "Podcast: Historias de Superación",
              descripcion: "Entrevistas inspiradoras.",
              tipo: "audio",
              url: "https://example.com/podcast",
              categoria: "Motivación",
              tags: ["historias", "motivación"],
              esPremium: false,
            },
            {
              _id: "6",
              titulo: "Masterclass: Nutrición y Mente",
              descripcion: "Cómo la alimentación influye en tu estado de ánimo.",
              tipo: "video",
              url: "https://example.com/nutricion",
              categoria: "Nutrición",
              tags: ["salud", "alimentación"],
              esPremium: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error cargando recursos:", error);
        // Fallback
        setRecursos([
            {
              _id: "1",
              titulo: "Técnicas de Respiración Profunda",
              descripcion: "Guía paso a paso para calmar la mente en situaciones de estrés.",
              tipo: "articulo",
              url: "https://example.com/respiracion",
              categoria: "Ansiedad",
              tags: ["respiración", "estrés"],
              esPremium: false,
            },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecursos();
  }, []);

  const recursosFiltrados =
    filtroTipo === "todos"
      ? recursos
      : recursos.filter((r) => r.tipo === filtroTipo);

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "video":
        return <PlayCircleIcon fontSize="small" />;
      case "audio":
        return <HeadphonesIcon fontSize="small" />;
      default:
        return <ArticleIcon fontSize="small" />;
    }
  };

  const handleOpenRecurso = (r: Recurso) => {
    setSelectedRecurso(r);
  };

  const handleClose = () => {
    setSelectedRecurso(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Biblioteca Psicoeducativa
          </Typography>
          <Typography color="text.secondary">
            Recursos validados por profesionales de la salud mental
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" color="primary">
            + Nuevo Recurso
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3, width: "100%" }}>
        <Tabs
          value={filtroTipo}
          onChange={(_, newValue) => setFiltroTipo(newValue)}
        >
          <Tab label="Todos" value="todos" />
          <Tab label="Artículos" value="articulo" />
          <Tab label="Videos" value="video" />
          <Tab label="Audios" value="audio" />
        </Tabs>
      </Box>

      <Grid container spacing={3} sx={{ width: "100%" }}>
        {loading
          ? [1, 2, 3, 4, 5, 6].map((n) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
                <Skeleton
                  variant="rectangular"
                  height={180}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))
          : recursosFiltrados.map((r) => {
              const canAccess = !r.esPremium || hasSubscription;
              return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r._id}>
                <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Chip label={r.categoria} size="small" color="primary" variant="outlined" />
                      <Box display="flex" alignItems="center" gap={1}>
                        {r.esPremium && (
                            <Chip 
                                icon={<LockIcon fontSize="small" />} 
                                label="Premium" 
                                size="small" 
                                color="warning" 
                                variant="filled"
                            />
                        )}
                        <Chip 
                            icon={getIcon(r.tipo)} 
                            label={r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1)} 
                            size="small" 
                        />
                        {isAdmin && (
                            <Box>
                                <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                            </Box>
                        )}
                      </Box>
                    </Box>
                    <Typography fontWeight={700} variant="h6" gutterBottom>
                      {r.titulo}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" mb={2}>
                      {r.descripcion}
                    </Typography>
                    <Box mt="auto">
                        {canAccess ? (
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => handleOpenRecurso(r)}
                                fullWidth
                            >
                                {isAdmin ? "Ver Enlace" : "Ver Recurso"}
                            </Button>
                        ) : (
                            <Button 
                                variant="contained" 
                                color="warning"
                                size="small" 
                                startIcon={<LockIcon />}
                                onClick={() => navigate("/suscripciones")}
                                fullWidth
                            >
                                Desbloquear
                            </Button>
                        )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )})}
      </Grid>

      <Dialog open={!!selectedRecurso} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRecurso?.titulo}</DialogTitle>
        <DialogContent dividers>
          {selectedRecurso?.tipo === "video" && (
            <Box display="flex" justifyContent="center" my={2}>
               {/* Simulating video embed. In real app, parse URL to get embed ID */}
               <Box 
                 width="100%" 
                 height={400} 
                 bgcolor="black" 
                 display="flex" 
                 alignItems="center" 
                 justifyContent="center"
                 color="white"
               >
                 <Typography>Reproductor de Video Simulado ({selectedRecurso.url})</Typography>
               </Box>
            </Box>
          )}
          
          {selectedRecurso?.tipo === "audio" && (
            <Box display="flex" flexDirection="column" alignItems="center" my={4}>
               <HeadphonesIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
               <audio controls style={{ width: "100%" }}>
                 <source src={selectedRecurso.url} type="audio/mpeg" />
                 Tu navegador no soporta audio.
               </audio>
            </Box>
          )}

          {selectedRecurso?.tipo === "articulo" && (
            <Box>
              <Typography paragraph>
                Aquí se mostraría el contenido completo del artículo. Como estamos usando URLs externas de ejemplo, 
                no podemos incrustarlas directamente por seguridad (CORS/X-Frame-Options).
              </Typography>
              <Typography paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
              <Button variant="contained" href={selectedRecurso.url} target="_blank">
                Leer artículo original completo
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
