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
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

interface Programa {
  _id: string;
  titulo: string;
  descripcion: string;
  sesiones: number;
  sesionesCompletadas: number;
  color: any;
}

export default function Programas() {
  const [loading, setLoading] = useState(true);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const { usuario } = useAuth();
  const isAdmin = usuario?.rol === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const { data } = await api.get("/programas");
        setProgramas(data);
      } catch (error) {
        console.error("Error cargando programas:", error);
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
          : programas.map((p) => (
              <Grid size={{ xs: 12, md: 6, lg: 3 }} key={p._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Typography fontWeight={700}>{p.titulo}</Typography>
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
                          color={p.color || "primary"}
                          onClick={() => navigate(`/programas/${p._id}`)}
                        >
                          {p.sesionesCompletadas === 0
                            ? "Comenzar programa"
                            : "Continuar programa"}
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
            ))}
      </Grid>
    </Box>
  );
}
