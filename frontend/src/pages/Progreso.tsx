import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  TextField,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import DeleteIcon from "@mui/icons-material/Delete";

interface Meta {
  _id: string;
  titulo: string;
  completada: boolean;
}

export default function Progreso() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [nuevaMeta, setNuevaMeta] = useState("");

  useEffect(() => {
    fetchMetas();
  }, []);

  const fetchMetas = async () => {
    try {
      const { data } = await api.get("/metas");
      setMetas(data);
    } catch (error) {
      console.error("Error cargando metas:", error);
    }
  };

  const handleCrearMeta = async () => {
    if (!nuevaMeta.trim()) return;
    try {
      await api.post("/metas", { titulo: nuevaMeta });
      setNuevaMeta("");
      fetchMetas();
    } catch (error) {
      console.error("Error creando meta:", error);
    }
  };

  const handleToggleMeta = async (id: string) => {
    try {
      await api.put(`/metas/${id}/toggle`);
      setMetas(
        metas.map((m) =>
          m._id === id ? { ...m, completada: !m.completada } : m
        )
      );
    } catch (error) {
      console.error("Error actualizando meta:", error);
    }
  };

  const handleBorrarMeta = async (id: string) => {
    try {
      await api.delete(`/metas/${id}`);
      setMetas(metas.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Error borrando meta:", error);
    }
  };

  const metasCompletadas = metas.filter((m) => m.completada).length;
  const progresoTotal = metas.length > 0 ? (metasCompletadas / metas.length) * 100 : 0;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Tu Progreso
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Monitoriza tu bienestar y evolución
      </Typography>

      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Metas Personales
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" value={progresoTotal} sx={{ height: 10, borderRadius: 5 }} />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="text.secondary">{Math.round(progresoTotal)}%</Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nueva meta (ej. Meditar 10 min)"
              value={nuevaMeta}
              onChange={(e) => setNuevaMeta(e.target.value)}
            />
            <Button variant="contained" onClick={handleCrearMeta}>
              Añadir
            </Button>
          </Box>

          <List>
            {metas.map((meta) => (
              <ListItem key={meta._id} divider>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={meta.completada}
                    onChange={() => handleToggleMeta(meta._id)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={meta.titulo}
                  sx={{
                    textDecoration: meta.completada ? "line-through" : "none",
                    color: meta.completada ? "text.secondary" : "text.primary",
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleBorrarMeta(meta._id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
