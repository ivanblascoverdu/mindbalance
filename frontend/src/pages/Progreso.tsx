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
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";
import DeleteIcon from "@mui/icons-material/Delete";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ProgressChart from "../components/ProgressChart";

interface Meta {
  _id: string;
  titulo: string;
  completada: boolean;
}

export default function Progreso() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [nuevaMeta, setNuevaMeta] = useState("");
  const [xp, setXp] = useState(1250);
  const [nivel] = useState(5);
  const [openCatalog, setOpenCatalog] = useState(false);

  useEffect(() => {
    fetchMetas();
  }, []);

  const fetchMetas = async () => {
    try {
      const { data } = await api.get("/metas");
      if (data && data.length > 0) {
        setMetas(data);
      } else {
        setMetas([
          { _id: "1", titulo: "Meditar 10 minutos al día", completada: true },
          { _id: "2", titulo: "Beber 2 litros de agua", completada: false },
          { _id: "3", titulo: "Leer 20 páginas de un libro", completada: false },
          { _id: "4", titulo: "Caminar 30 minutos", completada: true },
        ]);
      }
    } catch (error) {
      console.error("Error cargando metas:", error);
      // Fallback
      setMetas([
          { _id: "1", titulo: "Meditar 10 minutos al día", completada: true },
          { _id: "2", titulo: "Beber 2 litros de agua", completada: false },
      ]);
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
      const meta = metas.find(m => m._id === id);
      if (meta && !meta.completada) {
          setXp(prev => prev + 50); // Ganar XP al completar
      } else if (meta && meta.completada) {
          setXp(prev => prev - 50); // Perder XP al descompletar
      }

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
  const xpNextLevel = nivel * 500;
  const progressLevel = (xp % 500) / 500 * 100;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Tu Progreso y Logros
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Monitoriza tu bienestar, cumple metas y gana recompensas
      </Typography>

      <Grid container spacing={3} mb={4}>
        {/* Gamification Card */}
        <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ background: "linear-gradient(135deg, #2A9D8F 0%, #264653 100%)", color: "white" }}>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="h6" fontWeight={700}>Nivel {nivel}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>Explorador del Bienestar</Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56 }}>
                            <EmojiEventsIcon fontSize="large" />
                        </Avatar>
                    </Box>
                    <Box mt={2}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                            <Typography variant="caption" fontWeight={700}>{xp} XP</Typography>
                            <Typography variant="caption">{xpNextLevel} XP para nivel {nivel + 1}</Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={progressLevel} 
                            sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(255,255,255,0.2)", "& .MuiLinearProgress-bar": { bgcolor: "warning.main" } }} 
                        />
                    </Box>
                </CardContent>
            </Card>
        </Grid>

        {/* Shop Teaser */}
        <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <ShoppingBagIcon color="secondary" />
                        <Typography variant="h6" fontWeight={700}>Tienda de Puntos</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Canjea tus XP por temas exclusivos, avatares y descuentos en sesiones.
                    </Typography>
                    <Button variant="outlined" color="secondary" fullWidth size="small" onClick={() => setOpenCatalog(true)}>
                        Ver Catálogo
                    </Button>
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ mb: 4, height: "100%" }}>
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
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
            <ProgressChart />
            <Box mt={3}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>Histórico de Hábitos</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Has mantenido una racha de 5 días cumpliendo tus metas. ¡Sigue así para ganar bonificaciones de XP!
                        </Typography>
                        <Box mt={2} display="flex" gap={1}>
                            {[1,2,3,4,5,6,7].map(day => (
                                <Box 
                                    key={day} 
                                    width={32} 
                                    height={32} 
                                    borderRadius="50%" 
                                    bgcolor={day <= 5 ? "success.main" : "action.hover"} 
                                    display="flex" 
                                    alignItems="center" 
                                    justifyContent="center"
                                    color="white"
                                    fontWeight={700}
                                    fontSize={12}
                                >
                                    {day <= 5 ? "✓" : ""}
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Grid>
      </Grid>

      <Dialog open={openCatalog} onClose={() => setOpenCatalog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Catálogo de Recompensas</DialogTitle>
        <DialogContent dividers>
            <Typography gutterBottom>¡Canjea tus puntos de experiencia por recompensas exclusivas!</Typography>
            <Grid container spacing={2}>
                {[
                    { title: "Tema Oscuro 'Zen'", cost: 500, icon: "🌙" },
                    { title: "Avatar 'Guerrero de Luz'", cost: 1000, icon: "🛡️" },
                    { title: "Pack de Sonidos Naturales", cost: 300, icon: "🎵" },
                    { title: "Descuento 10% en Sesión", cost: 2000, icon: "🏷️" },
                    { title: "Insignia 'Meditador Pro'", cost: 150, icon: "🏅" },
                    { title: "Tema 'Bosque Encantado'", cost: 600, icon: "🌲" },
                ].map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Card variant="outlined">
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography fontSize={40}>{item.icon}</Typography>
                                <Typography fontWeight={700} gutterBottom>{item.title}</Typography>
                                <Chip label={`${item.cost} XP`} color="warning" size="small" />
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    sx={{ mt: 2 }} 
                                    disabled={xp < item.cost}
                                    onClick={() => alert(`¡Has canjeado ${item.title}!`)}
                                >
                                    Canjear
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenCatalog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
