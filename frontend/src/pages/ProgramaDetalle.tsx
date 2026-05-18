import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Snackbar,
  Alert,
  TextField,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LockIcon from "@mui/icons-material/Lock";

interface Sesion {
  titulo: string;
  descripcion: string;
  videoUrl: string;
  puntos: number;
  duracion: string;
}

interface Programa {
  _id: string;
  titulo: string;
  descripcion: string;
  sesiones: number;
  sesionesCompletadas: number;
  color: string;
  contenido: Sesion[];
  isPremium?: boolean;
}

export default function ProgramaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();
  const [programa, setPrograma] = useState<Programa | null>(null);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "info" });
  const [reflection, setReflection] = useState("");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        const { data } = await api.get(`/programas/${id}`);
        setPrograma(data);
      } catch (err) {
        console.error("Error cargando programa:", err);
        setError("No se pudo cargar el programa. Inténtalo de nuevo más tarde.");
      }
    };
    fetchPrograma();
  }, [id]);

  const handleCompleteSession = () => {
    if (!programa || activeSession === null) return;
    
    // Simulate update
    const newCompleted = Math.min(programa.sesionesCompletadas + 1, programa.sesiones);
    setPrograma({ ...programa, sesionesCompletadas: newCompleted });
    
    // Award points
    const sessionPoints = programa.contenido[activeSession].puntos;
    if (usuario) {
        setUsuario({ ...usuario, puntos: usuario.puntos + sessionPoints });
    }

    setSnackbar({
        open: true,
        message: `¡Sesión completada! Has ganado ${sessionPoints} puntos. Progreso: ${(newCompleted / programa.sesiones * 100).toFixed(0)}%`,
        severity: "success"
    });
    setActiveSession(null);
  };

  const handleDownloadResources = () => {
    setSnackbar({
        open: true,
        message: "Descargando recursos del módulo... (Simulación)",
        severity: "info"
    });
  };

  const handleSaveReflection = () => {
    if (!reflection.trim()) return;
    setSnackbar({
        open: true,
        message: "Reflexión guardada en tu diario personal",
        severity: "success"
    });
    setReflection("");
  };

  if (error) {
    return (
      <Box p={4}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/programas")} sx={{ mb: 2 }}>
          Volver a Programas
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!programa) {
    return <Typography p={4}>Cargando programa...</Typography>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/programas")}
        sx={{ mb: 2 }}
      >
        Volver a Programas
      </Button>

      <Card variant="outlined" sx={{ mb: 4, borderColor: `${programa.color}.main`, borderWidth: 1 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight={700} gutterBottom>
                {programa.titulo}
            </Typography>
            {programa.isPremium && (
                <Chip label="PREMIUM" color="warning" sx={{ fontWeight: 'bold' }} />
            )}
          </Box>
          <Typography color="text.secondary" paragraph>
            {programa.descripcion}
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <LinearProgress
              variant="determinate"
              value={(programa.sesionesCompletadas / programa.sesiones) * 100}
              sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
              color={programa.color as any || "primary"}
            />
            <Typography fontWeight={700}>
              {Math.round((programa.sesionesCompletadas / programa.sesiones) * 100)}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight={700} gutterBottom>
        Sesiones del Programa
      </Typography>

      <List>
        {programa.contenido?.map((sesion, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2, bgcolor: index < programa.sesionesCompletadas ? "#f0fff4" : "white" }}>
            <ListItem
              secondaryAction={
                <Button
                  variant={activeSession === index ? "contained" : "outlined"}
                  color={index < programa.sesionesCompletadas ? "success" : "primary"}
                  onClick={() => setActiveSession(activeSession === index ? null : index)}
                  disabled={index > programa.sesionesCompletadas}
                  startIcon={index > programa.sesionesCompletadas ? <LockIcon /> : null}
                >
                  {activeSession === index ? "Cerrar" : index < programa.sesionesCompletadas ? "Repasar" : index === programa.sesionesCompletadas ? "Comenzar" : "Bloqueado"}
                </Button>
              }
            >
              <ListItemIcon>
                {index < programa.sesionesCompletadas ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <PlayCircleOutlineIcon color={index === programa.sesionesCompletadas ? "primary" : "disabled"} />
                )}
              </ListItemIcon>
              <ListItemText
                disableTypography
                primary={<Typography fontWeight={600}>{`Sesión ${index + 1}: ${sesion.titulo}`}</Typography>}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">{sesion.descripcion}</Typography>
                    <Box display="flex" gap={1} mt={0.5}>
                        <Chip label={`${sesion.puntos} pts`} size="small" color="primary" variant="outlined" />
                        <Chip label={sesion.duracion} size="small" variant="outlined" />
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            
            {activeSession === index && (
              <Box p={3} bgcolor="#f9f9f9" borderTop="1px solid #eee">
                <Typography variant="h6" gutterBottom>
                  Contenido de la sesión
                </Typography>
                <Typography paragraph>
                  Bienvenido a la sesión de <strong>{sesion.titulo}</strong>. 
                  En este módulo trabajaremos conceptos clave para tu desarrollo personal.
                </Typography>
                
                <Grid container spacing={2} mb={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box
                        height={300}
                        bgcolor="#000"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius={2}
                        overflow="hidden"
                        >
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube.com/embed/${sesion.videoUrl}`}
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card variant="outlined" sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography fontWeight={700} gutterBottom>Recursos de la sesión</Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon><DescriptionIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Guía de práctica (PDF)" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><HeadphonesIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Audio de relajación (MP3)" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText primary="Ejercicio de reflexión" />
                                    </ListItem>
                                </List>
                                <Button 
                                    variant="outlined" 
                                    fullWidth 
                                    size="small"
                                    onClick={handleDownloadResources}
                                >
                                    Descargar Todo
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Typography paragraph>
                  <strong>Ejercicio Práctico:</strong> Tómate 5 minutos para escribir cómo te sientes respecto al tema de hoy.
                </Typography>
                <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
                    <TextField 
                        fullWidth 
                        multiline 
                        rows={3} 
                        placeholder="Escribe tus reflexiones aquí..." 
                        variant="outlined" 
                        sx={{ bgcolor: "white" }}
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                    />
                    <Button 
                        variant="contained" 
                        sx={{ height: 56 }}
                        onClick={handleSaveReflection}
                    >
                        Guardar
                    </Button>
                </Box>

                <Box display="flex" justifyContent="flex-end">
                    <Button 
                        variant="contained" 
                        color="success" 
                        size="large"
                        onClick={handleCompleteSession}
                        disabled={index < programa.sesionesCompletadas}
                    >
                        {index < programa.sesionesCompletadas ? "Sesión ya completada" : `Completar y ganar ${sesion.puntos} pts`}
                    </Button>
                </Box>
              </Box>
            )}
          </Card>
        ))}
      </List>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
