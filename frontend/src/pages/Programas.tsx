import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const programas = [
  {
    titulo: "Mindfulness y Atención Plena",
    sesiones: "8 semanas • 16 sesiones",
    descripcion:
      "Aprende técnicas de mindfulness para reducir el estrés y mejorar tu concentración.",
    progreso: { completadas: 8, total: 16, color: "primary" },
  },
  {
    titulo: "Gestión Emocional",
    sesiones: "6 semanas • 12 sesiones",
    descripcion:
      "Desarrolla habilidades para identificar, comprender y regular tus emociones.",
    progreso: { completadas: 0, total: 12, color: "secondary" },
  },
  {
    titulo: "Higiene del Sueño",
    sesiones: "4 semanas • 8 sesiones",
    descripcion: "Mejora la calidad de tu descanso con técnicas validadas.",
    progreso: { completadas: 0, total: 8, color: "info" },
  },
  {
    titulo: "Reducción de Estrés",
    sesiones: "6 semanas • 12 sesiones",
    descripcion:
      "Herramientas efectivas para manejar el estrés y evitar el burnout.",
    progreso: { completadas: 3, total: 12, color: "success" },
  },
];

export default function Programas() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carga de datos (en producción sería fetch al backend)
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Programas Terapéuticos
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Intervenciones psicológicas basadas en evidencia científica
        </Typography>
        <Grid container spacing={3}>
          {loading
            ? // Skeletons mientras carga
              [1, 2, 3, 4].map((n) => (
                <Grid item xs={12} md={6} lg={3} key={n}>
                  <Card variant="outlined">
                    <CardContent>
                      <Skeleton variant="text" height={40} />
                      <Skeleton variant="text" height={20} width="60%" />
                      <Skeleton
                        variant="rectangular"
                        height={60}
                        sx={{ my: 2 }}
                      />
                      <Skeleton
                        variant="rectangular"
                        height={8}
                        sx={{ my: 2 }}
                      />
                      <Skeleton variant="rectangular" height={40} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : // Contenido real
              programas.map((p) => (
                <Grid item xs={12} md={6} lg={3} key={p.titulo}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>
                        {p.titulo}
                      </Typography>
                      <Typography color="text.secondary">
                        {p.sesiones}
                      </Typography>
                      <Typography mt={2}>{p.descripcion}</Typography>
                      <Box my={2}>
                        <LinearProgress
                          variant="determinate"
                          value={
                            (p.progreso.completadas / p.progreso.total) * 100
                          }
                          color={p.progreso.color as any}
                          sx={{ height: 8, borderRadius: 8 }}
                        />
                        <Typography mt={1} fontSize={14}>
                          {p.progreso.completadas} de {p.progreso.total}{" "}
                          completadas
                        </Typography>
                      </Box>
                      <Button variant="contained" fullWidth>
                        {p.progreso.completadas === 0
                          ? "Comenzar programa"
                          : "Continuar programa"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
        {!loading && (
          <Box mt={4}>
            <Typography variant="subtitle1" fontWeight={700}>
              ¿Cómo funcionan los programas?
            </Typography>
            <Typography color="text.secondary" fontSize={15} mt={1}>
              Cada programa está diseñado por profesionales de la salud mental.
              Las sesiones incluyen ejercicios interactivos, videos y material
              de lectura. Puedes avanzar a tu ritmo. Tu progreso se guarda
              automáticamente.
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
