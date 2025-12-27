import Grid from "@mui/material/Grid";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Skeleton,
  IconButton,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

interface Programa {
  _id: string;
  titulo: string;
  descripcion: string;
  sesiones: number;
  sesionesCompletadas: number;
  color: any;
  isPremium?: boolean;
}

export default function Programas() {
  const [loading, setLoading] = useState(true);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const { usuario } = useAuth();
  const isAdmin = usuario?.rol === "admin";
  const navigate = useNavigate();

  const hasAccess = (programa: Programa) => {
    if (isAdmin) return true;
    if (!programa.isPremium) return true;
    return usuario?.suscripcion === "premium" || usuario?.suscripcion === "profesional";
  };

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const { data } = await api.get("/programas");
        if (data && data.length > 0) {
          setProgramas(data);
        } else {
          // Mock data for demonstration
          setProgramas([
            {
              _id: "1",
              titulo: "Gestión de la Ansiedad",
              descripcion: "Aprende técnicas efectivas para manejar la ansiedad en tu día a día.",
              sesiones: 8,
              sesionesCompletadas: 3,
              color: "primary",
            },
            {
              _id: "2",
              titulo: "Mindfulness Básico",
              descripcion: "Introducción a la atención plena para reducir el estrés.",
              sesiones: 5,
              sesionesCompletadas: 1,
              color: "secondary",
            },
            {
              _id: "3",
              titulo: "Mejora tu Sueño",
              descripcion: "Estrategias para establecer una rutina de sueño saludable.",
              sesiones: 6,
              sesionesCompletadas: 0,
              color: "success",
            },
            {
              _id: "4",
              titulo: "Autoestima y Confianza",
              descripcion: "Fortalece tu autoconcepto y seguridad personal. (Exclusivo Premium)",
              sesiones: 10,
              sesionesCompletadas: 0,
              color: "warning",
              isPremium: true,
            },
          ]);
        }
      } catch (error) {
        console.error("Error cargando programas:", error);
        // Fallback mock data on error
        setProgramas([
            {
              _id: "1",
              titulo: "Gestión de la Ansiedad",
              descripcion: "Aprende técnicas efectivas para manejar la ansiedad en tu día a día.",
              sesiones: 8,
              sesionesCompletadas: 3,
              color: "primary",
            },
            {
              _id: "2",
              titulo: "Mindfulness Básico",
              descripcion: "Introducción a la atención plena para reducir el estrés.",
              sesiones: 5,
              sesionesCompletadas: 1,
              color: "secondary",
            },
            {
                _id: "4",
                titulo: "Autoestima y Confianza",
                descripcion: "Fortalece tu autoconcepto y seguridad personal. (Exclusivo Premium)",
                sesiones: 10,
                sesionesCompletadas: 0,
                color: "warning",
                isPremium: true,
            },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramas();
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Programas Terapéuticos
          </Typography>
          <Typography color="text.secondary">
            Intervenciones psicológicas basadas en evidencia científica
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" color="primary">
            + Nuevo Programa
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {loading
          ? [1, 2, 3, 4].map((n) => (
              <Grid size={{ xs: 12, md: 6, lg: 3 }} key={n}>
                <Skeleton
                  variant="rectangular"
                  height={230}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))
          : programas.map((p) => {
              const accessible = hasAccess(p);
              return (
              <Grid size={{ xs: 12, md: 6, lg: 3 }} key={p._id}>
                <Card variant="outlined" sx={{ position: 'relative', opacity: accessible ? 1 : 0.8 }}>
                  {p.isPremium && (
                    <Chip 
                        label="PREMIUM" 
                        color="warning" 
                        size="small" 
                        sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 'bold' }} 
                    />
                  )}
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Typography fontWeight={700} sx={{ pr: 4 }}>{p.titulo}</Typography>
                      {isAdmin && (
                        <Box>
                          <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                        </Box>
                      )}
                    </Box>
                    <Typography
                      fontSize={14}
                      color="text.secondary"
                      gutterBottom
                    >
                      {p.sesiones} sesiones
                    </Typography>
                    <Typography mb={2}>{p.descripcion}</Typography>
                    
                    {!isAdmin && (
                      <>
                        <Typography fontWeight={700}>
                          {p.sesionesCompletadas} de {p.sesiones} completadas
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(p.sesionesCompletadas / p.sesiones) * 100}
                          color={p.color || "primary"}
                          sx={{ my: 2, height: 7, borderRadius: 2 }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          color={accessible ? (p.color || "primary") : "inherit"}
                          startIcon={!accessible ? <LockIcon /> : null}
                          onClick={() => accessible ? navigate(`/programas/${p._id}`) : navigate('/suscripciones')}
                        >
                          {accessible 
                            ? (p.sesionesCompletadas === 0 ? "Comenzar programa" : "Continuar programa")
                            : "Desbloquear con Premium"
                          }
                        </Button>
                      </>
                    )}
                    
                    {isAdmin && (
                      <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                        Editar Contenido
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )})}
      </Grid>
    </Box>
  );
}
