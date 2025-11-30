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
  Checkbox,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        // En una app real, este endpoint devolvería el detalle completo
        // Como usamos el mismo endpoint de lista para simplificar en el backend actual,
        // filtraremos en cliente o asumiremos que el backend soporta getById si lo implementamos.
        // Vamos a implementar getById en backend o usar el de lista y buscar.
        // Por ahora, usaremos el de lista y filtraremos (menos eficiente pero funciona sin tocar backend ahora mismo si no existe endpoint)
        // PERO, mejor intento hacer un get al ID, si falla, fallback.
        // Revisando backend routes, no vi getById explícito en el resumen, pero Mongoose suele tenerlo.
        // Si no existe, lo añado rápido al backend.
        // Voy a asumir que necesito añadirlo o usar el de lista.
        // Para asegurar, haré get lista y find.
        const { data } = await api.get("/programas");
        const found = data.find((p: Programa) => p._id === id);
        setPrograma(found);
      } catch (error) {
        console.error("Error cargando programa", error);
      }
    };
    fetchPrograma();
  }, [id]);

  if (!programa) {
    return <Typography>Cargando...</Typography>;
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

      <Card variant="outlined" sx={{ mb: 4, borderColor: programa.color }}>
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
              color="primary"
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
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <ListItem
              secondaryAction={
                <Button
                  variant={activeSession === index ? "contained" : "outlined"}
                  onClick={() => setActiveSession(activeSession === index ? null : index)}
                >
                  {activeSession === index ? "En curso" : "Comenzar"}
                </Button>
              }
            >
              <ListItemIcon>
                {index < programa.sesionesCompletadas ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <PlayCircleOutlineIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={`Sesión ${index + 1}: ${sesion}`}
                secondary={
                  index < programa.sesionesCompletadas
                    ? "Completado"
                    : "Pendiente"
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
                  Aquí encontrarás ejercicios prácticos y material de lectura para profundizar en este tema.
                </Typography>
                <Box
                  height={200}
                  bgcolor="#e0e0e0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius={2}
                  mb={2}
                >
                  <Typography color="text.secondary">
                    [Video / Audio Interactivo Simulador]
                  </Typography>
                </Box>
                <Typography paragraph>
                  Tómate unos minutos para reflexionar sobre lo aprendido hoy.
                </Typography>
                <Button variant="contained" color="success">
                  Marcar como Completada
                </Button>
              </Box>
            )}
          </Card>
        ))}
      </List>
    </Box>
  );
}
