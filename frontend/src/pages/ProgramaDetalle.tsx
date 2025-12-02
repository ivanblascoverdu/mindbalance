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
        const mockProgramas: Programa[] = [
            {
              _id: "1",
              titulo: "Gestión de la Ansiedad",
              descripcion: "Aprende técnicas efectivas para manejar la ansiedad en tu día a día.",
              sesiones: 8,
              sesionesCompletadas: 3,
              color: "primary",
              contenido: [
                { titulo: "Entendiendo la ansiedad", descripcion: "Comprende los mecanismos biológicos y psicológicos de la ansiedad.", videoUrl: "inpok4MKVLM", puntos: 50, duracion: "10 min" },
                { titulo: "Respiración diafragmática", descripcion: "Técnica fundamental para reducir la activación fisiológica.", videoUrl: "w7aIdbwX6Ts", puntos: 50, duracion: "15 min" },
                { titulo: "Identificando disparadores", descripcion: "Aprende a reconocer qué situaciones detonan tu ansiedad.", videoUrl: "1ZYbU82GVz4", puntos: 60, duracion: "12 min" },
                { titulo: "Reestructuración cognitiva", descripcion: "Cambia los pensamientos que alimentan la ansiedad.", videoUrl: "lFcSrYw-ARY", puntos: 70, duracion: "20 min" },
                { titulo: "Exposición gradual", descripcion: "Enfrenta tus miedos paso a paso de forma segura.", videoUrl: "nmFUDkj1Aq0", puntos: 80, duracion: "18 min" },
                { titulo: "Mindfulness para ansiedad", descripcion: "Atención plena para reducir el estrés.", videoUrl: "ZToicYcHIOU", puntos: 60, duracion: "15 min" },
                { titulo: "Prevención de recaídas", descripcion: "Mantén tus logros a largo plazo.", videoUrl: "tEmt1Znux58", puntos: 90, duracion: "25 min" },
                { titulo: "Plan de acción personal", descripcion: "Crea tu propia caja de herramientas anti-ansiedad.", videoUrl: "inpok4MKVLM", puntos: 100, duracion: "30 min" }
              ]
            },
            {
              _id: "2",
              titulo: "Mindfulness Básico",
              descripcion: "Introducción a la atención plena para reducir el estrés.",
              sesiones: 5,
              sesionesCompletadas: 1,
              color: "secondary",
              contenido: [
                { titulo: "Qué es el Mindfulness", descripcion: "Introducción a la práctica de la atención plena.", videoUrl: "lFcSrYw-ARY", puntos: 50, duracion: "10 min" },
                { titulo: "Escaneo corporal", descripcion: "Conecta con las sensaciones de tu cuerpo.", videoUrl: "ZToicYcHIOU", puntos: 50, duracion: "15 min" },
                { titulo: "Atención a la respiración", descripcion: "Usa tu respiración como ancla al presente.", videoUrl: "w7aIdbwX6Ts", puntos: 60, duracion: "12 min" },
                { titulo: "Mindfulness en movimiento", descripcion: "Lleva la atención plena a tus actividades diarias.", videoUrl: "inpok4MKVLM", puntos: 70, duracion: "20 min" },
                { titulo: "Integración diaria", descripcion: "Cómo mantener la práctica día a día.", videoUrl: "1ZYbU82GVz4", puntos: 80, duracion: "15 min" }
              ]
            },
            {
                _id: "4",
                titulo: "Autoestima y Confianza",
                descripcion: "Fortalece tu autoconcepto y seguridad personal. (Exclusivo Premium)",
                sesiones: 10,
                sesionesCompletadas: 0,
                color: "warning",
                isPremium: true,
                contenido: [
                    { titulo: "Autoconocimiento", descripcion: "Descubre quién eres realmente.", videoUrl: "tEmt1Znux58", puntos: 50, duracion: "15 min" },
                    { titulo: "Valores personales", descripcion: "Identifica lo que es importante para ti.", videoUrl: "nmFUDkj1Aq0", puntos: 50, duracion: "15 min" },
                    { titulo: "Diálogo interno", descripcion: "Mejora cómo te hablas a ti mismo.", videoUrl: "lFcSrYw-ARY", puntos: 60, duracion: "20 min" },
                    { titulo: "Aceptación", descripcion: "Acéptate incondicionalmente.", videoUrl: "ZToicYcHIOU", puntos: 70, duracion: "18 min" },
                    { titulo: "Límites saludables", descripcion: "Aprende a decir no.", videoUrl: "w7aIdbwX6Ts", puntos: 80, duracion: "25 min" },
                    { titulo: "Asertividad", descripcion: "Comunícate con confianza.", videoUrl: "inpok4MKVLM", puntos: 80, duracion: "20 min" },
                    { titulo: "Logros y fortalezas", descripcion: "Reconoce tus éxitos.", videoUrl: "1ZYbU82GVz4", puntos: 90, duracion: "15 min" },
                    { titulo: "Autocuidado", descripcion: "Cuida de ti mismo.", videoUrl: "lFcSrYw-ARY", puntos: 90, duracion: "20 min" },
                    { titulo: "Proyección futura", descripcion: "Visualiza tu mejor versión.", videoUrl: "nmFUDkj1Aq0", puntos: 100, duracion: "25 min" },
                    { titulo: "Celebración", descripcion: "Celebra tu camino.", videoUrl: "tEmt1Znux58", puntos: 100, duracion: "30 min" }
                ]
            }
        ];
        const foundMock = mockProgramas.find(p => p._id === id);
        setPrograma(foundMock || mockProgramas[0]);
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
