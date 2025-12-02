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
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import AssignmentIcon from "@mui/icons-material/Assignment";

interface Programa {
  _id: string;
  titulo: string;
  descripcion: string;
  sesiones: number;
  sesionesCompletadas: number;
  color: string;
  contenido: string[];
}

export default function ProgramaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [programa, setPrograma] = useState<Programa | null>(null);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "info" });
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        const { data } = await api.get("/programas");
        const found = data.find((p: Programa) => p._id === id);
        if (found) {
            setPrograma(found);
        } else {
            throw new Error("Programa no encontrado en API");
        }
      } catch (error) {
        console.error("Error cargando programa, usando fallback:", error);
        // Fallback Mock Data
        const mockProgramas = [
            {
              _id: "1",
              titulo: "Gestión de la Ansiedad",
              descripcion: "Aprende técnicas efectivas para manejar la ansiedad en tu día a día.",
              sesiones: 8,
              sesionesCompletadas: 3,
              color: "primary",
              contenido: ["Entendiendo la ansiedad", "Respiración diafragmática", "Identificando disparadores", "Reestructuración cognitiva", "Exposición gradual", "Mindfulness para ansiedad", "Prevención de recaídas", "Plan de acción personal"]
            },
            {
              _id: "2",
              titulo: "Mindfulness Básico",
              descripcion: "Introducción a la atención plena para reducir el estrés.",
              sesiones: 5,
              sesionesCompletadas: 1,
              color: "secondary",
              contenido: ["Qué es el Mindfulness", "Escaneo corporal", "Atención a la respiración", "Mindfulness en movimiento", "Integración diaria"]
            },
            {
                _id: "3",
                titulo: "Mejora tu Sueño",
                descripcion: "Estrategias para establecer una rutina de sueño saludable.",
                sesiones: 6,
                sesionesCompletadas: 0,
                color: "success",
                contenido: ["Higiene del sueño", "Rutinas nocturnas", "Relajación muscular", "Diario de sueño", "Estímulos y ambiente", "Mantenimiento"]
            },
            {
                _id: "4",
                titulo: "Autoestima y Confianza",
                descripcion: "Fortalece tu autoconcepto y seguridad personal.",
                sesiones: 10,
                sesionesCompletadas: 0,
                color: "warning",
                contenido: ["Autoconocimiento", "Valores personales", "Diálogo interno", "Aceptación", "Límites saludables", "Asertividad", "Logros y fortalezas", "Autocuidado", "Proyección futura", "Celebración"]
            }
        ];
        const foundMock = mockProgramas.find(p => p._id === id);
        setPrograma(foundMock || mockProgramas[0]);
      }
    };
    fetchPrograma();
  }, [id]);

  const handleCompleteSession = () => {
    if (!programa) return;
    
    // Simulate update
    const newCompleted = Math.min(programa.sesionesCompletadas + 1, programa.sesiones);
    setPrograma({ ...programa, sesionesCompletadas: newCompleted });
    
    setSnackbar({
        open: true,
        message: `¡Sesión completada! Has avanzado al ${(newCompleted / programa.sesiones * 100).toFixed(0)}%`,
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
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {programa.titulo}
          </Typography>
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
                >
                  {activeSession === index ? "Cerrar" : index < programa.sesionesCompletadas ? "Repasar" : "Comenzar"}
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
                primary={<Typography fontWeight={600}>{`Sesión ${index + 1}: ${sesion}`}</Typography>}
                secondary={
                  index < programa.sesionesCompletadas
                    ? "Completado"
                    : index === programa.sesionesCompletadas ? "Disponible" : "Bloqueado"
                }
              />
            </ListItem>
            
            {activeSession === index && (
              <Box p={3} bgcolor="#f9f9f9" borderTop="1px solid #eee">
                <Typography variant="h6" gutterBottom>
                  Contenido de la sesión
                </Typography>
                <Typography paragraph>
                  Bienvenido a la sesión de <strong>{sesion}</strong>. 
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
                        color="white"
                        position="relative"
                        sx={{ cursor: "pointer", "&:hover": { opacity: 0.9 } }}
                        onClick={() => alert("Reproduciendo video... (Simulación)")}
                        >
                        <PlayCircleOutlineIcon sx={{ fontSize: 64, opacity: 0.8 }} />
                        <Typography sx={{ position: "absolute", bottom: 16, left: 16 }}>
                            Video Introductorio: {sesion}
                        </Typography>
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
                        {index < programa.sesionesCompletadas ? "Sesión ya completada" : "Marcar Sesión como Completada"}
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
