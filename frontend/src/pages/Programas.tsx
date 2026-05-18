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
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import AddIcon from "@mui/icons-material/Add";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { useNavigate } from "react-router-dom";
import { staggerContainer, staggerItem } from "../components/PageTransition";

interface Programa {
  _id: string;
  titulo: string;
  descripcion: string;
  sesiones: number;
  sesionesCompletadas: number;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  isPremium?: boolean;
}

const MotionCard = motion(Card);

export default function Programas() {
  const [loading, setLoading] = useState(true);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const { usuario } = useAuth();
  const isAdmin = usuario?.rol === "admin";
  const navigate = useNavigate();

  const hasAccess = (programa: Programa) => {
    if (isAdmin) return true;
    if (!programa.isPremium) return true;
    return (
      usuario?.suscripcion === "premium" ||
      usuario?.suscripcion === "profesional"
    );
  };

  useEffect(() => {
    const fetchProgramas = async () => {
      try {
        const { data } = await api.get("/programas");
        setProgramas(data || []);
      } catch {
        setProgramas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProgramas();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Programas Terapéuticos
          </Typography>
          <Typography color="text.secondary">
            Intervenciones psicológicas basadas en evidencia científica
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Nuevo programa
          </Button>
        )}
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((n) => (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={n}>
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      ) : programas.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 3,
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              mx: "auto",
              borderRadius: "50%",
              bgcolor: "rgba(42,157,143,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              mb: 2,
            }}
          >
            <LocalLibraryIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Aún no hay programas disponibles
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 380, mx: "auto" }}>
            Pronto añadiremos nuevos programas terapéuticos basados en
            evidencia. Vuelve a consultar más tarde.
          </Typography>
        </Box>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="enter"
        >
        <Grid container spacing={3}>
          {programas.map((p) => {
            const accessible = hasAccess(p);
            const progress = p.sesiones
              ? (p.sesionesCompletadas / p.sesiones) * 100
              : 0;
            return (
              <Grid size={{ xs: 12, md: 6, lg: 3 }} key={p._id}>
                <motion.div variants={staggerItem} style={{ height: "100%" }}>
                <MotionCard
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  sx={{
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    opacity: accessible ? 1 : 0.85,
                    cursor: accessible ? "pointer" : "default",
                    transition: "box-shadow 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                    },
                  }}
                  onClick={() =>
                    !isAdmin &&
                    (accessible
                      ? navigate(`/programas/${p._id}`)
                      : navigate("/suscripciones"))
                  }
                >
                  {p.isPremium && (
                    <Chip
                      label="PREMIUM"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontWeight: 700,
                        fontSize: 9.5,
                        letterSpacing: 0.6,
                        height: 22,
                        background: "linear-gradient(135deg, #C29A5B 0%, #A37D45 100%)",
                        color: "#fff",
                        boxShadow: "0 4px 10px rgba(194,154,91,0.35)",
                      }}
                    />
                  )}
                  <CardContent
                    sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography
                        fontWeight={700}
                        sx={{
                          pr: p.isPremium ? 10 : 4,
                          fontSize: "1.05rem",
                          lineHeight: 1.25,
                        }}
                      >
                        {p.titulo}
                      </Typography>
                      {isAdmin && (
                        <Stack direction="row">
                          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      )}
                    </Stack>

                    <Typography fontSize={13} color="text.secondary" sx={{ mt: 0.5 }}>
                      {p.sesiones} sesiones
                    </Typography>

                    <Typography
                      sx={{
                        my: 2,
                        color: "text.secondary",
                        fontSize: 14,
                        flexGrow: 1,
                      }}
                    >
                      {p.descripcion}
                    </Typography>

                    {!isAdmin && (
                      <>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography fontSize={13} fontWeight={600}>
                            Progreso
                          </Typography>
                          <Typography fontSize={13} color="text.secondary">
                            {p.sesionesCompletadas}/{p.sesiones}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          color={p.color || "primary"}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 2,
                            bgcolor: "rgba(0,0,0,0.05)",
                          }}
                        />
                        <Button
                          variant={accessible ? "contained" : "outlined"}
                          fullWidth
                          color={accessible ? p.color || "primary" : "inherit"}
                          startIcon={!accessible ? <LockIcon /> : null}
                          onClick={(e) => {
                            e.stopPropagation();
                            accessible
                              ? navigate(`/programas/${p._id}`)
                              : navigate("/suscripciones");
                          }}
                        >
                          {accessible
                            ? p.sesionesCompletadas === 0
                              ? "Comenzar"
                              : "Continuar"
                            : "Desbloquear Premium"}
                        </Button>
                      </>
                    )}

                    {isAdmin && (
                      <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                        Editar contenido
                      </Button>
                    )}
                  </CardContent>
                </MotionCard>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
        </motion.div>
      )}
    </Box>
  );
}
