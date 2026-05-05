import Grid from "@mui/material/Grid";
import { Box, Typography, Skeleton, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import QuickAccessCards from "../components/QuickAccessCards";
import WeeklyProgress from "../components/WeeklyProgress";
import RecommendedResources from "../components/RecommendedResources";
import NextSession from "../components/NextSession";
import ProgressChart from "../components/ProgressChart";
import { useAuth } from "../context/AuthContext";
import { staggerContainer, staggerItem } from "../components/PageTransition";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 6) return "Buenas noches";
  if (h < 13) return "Buenos días";
  if (h < 21) return "Buenas tardes";
  return "Buenas noches";
};

const todayLabel = () => {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuth();

  // Mientras no hay datos del backend, los componentes muestran su empty state
  const [userActivities] = useState([]);
  const [nextSession] = useState(null);
  const [progressData] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const firstName = usuario?.nombre?.split(" ")[0] || "";

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={0.5} sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 1.2, fontSize: 12 }}
        >
          {todayLabel()}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {getGreeting()}{firstName ? `, ${firstName}` : ""} 👋
        </Typography>
        <Typography color="text.secondary">
          Hoy es un buen día para cuidar de ti mismo.
        </Typography>
      </Stack>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="enter"
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <motion.div variants={staggerItem}>
              <QuickAccessCards />
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <motion.div variants={staggerItem}>
              {loading ? (
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
              ) : (
                <WeeklyProgress activities={userActivities} />
              )}
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div variants={staggerItem}>
              {loading ? (
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
              ) : (
                <RecommendedResources />
              )}
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div variants={staggerItem}>
              {loading ? (
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
              ) : (
                <NextSession session={nextSession} />
              )}
            </motion.div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <motion.div variants={staggerItem}>
              {loading ? (
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4 }} />
              ) : (
                <ProgressChart data={progressData} />
              )}
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}
