import Grid from "@mui/material/Grid";
import { Box, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import QuickAccessCards from "../components/QuickAccessCards";
import WeeklyProgress from "../components/WeeklyProgress";
import RecommendedResources from "../components/RecommendedResources";
import NextSession from "../components/NextSession";
import ProgressChart from "../components/ProgressChart";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuth();

  // TODO: Estos datos deberían venir de la API basados en el usuario
  // Por ahora, un usuario nuevo no tiene datos
  const [userActivities] = useState([]);
  const [nextSession] = useState(null);
  const [progressData] = useState(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Bienvenido{usuario?.nombre ? `, ${usuario.nombre.split(' ')[0]}` : ''} 👋
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Hoy es un buen día para cuidar de ti mismo
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <QuickAccessCards />
          </Grid>
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <WeeklyProgress activities={userActivities} />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <RecommendedResources />
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <NextSession session={nextSession} />
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <ProgressChart data={progressData} />
            )}
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
