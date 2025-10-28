import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const resumen = [
  { label: "Mindfulness", value: 8, total: 10, color: "primary" },
  { label: "Ejercicio físico", value: 5, total: 7, color: "success" },
  { label: "Tiempo al aire libre", value: 4, total: 5, color: "info" },
  { label: "Horas de sueño promedio", value: 7.5, total: 8, color: "warning" },
];

export default function Progreso() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Tu Progreso
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Monitoriza tu bienestar y evolución
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography fontWeight={700}>Racha actual</Typography>
                <Typography variant="h3" color="primary.main">
                  7 días
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  ¡Sigue así!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography fontWeight={700}>Sesiones esta semana</Typography>
                <Typography variant="h3" color="secondary.main">
                  12
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  3 más que la semana pasada
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography fontWeight={700}>Calidad del sueño</Typography>
                <Typography variant="h3" color="success.main">
                  85%
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  Mejorando constantemente
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box mt={4}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Resumen semanal
          </Typography>
          <Typography color="text.secondary" fontSize={14} mb={2}>
            Del 21 al 27 de octubre
          </Typography>
          {resumen.map((r) => (
            <Box key={r.label} mt={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight={600}>{r.label}</Typography>
                <Typography fontSize={14} color="text.secondary">
                  {r.value}/{r.total}
                </Typography>
              </Box>
              <LinearProgress
                value={(r.value / r.total) * 100}
                variant="determinate"
                color={r.color as any}
                sx={{ height: 8, borderRadius: 8 }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}
