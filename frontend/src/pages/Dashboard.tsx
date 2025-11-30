import Grid from "@mui/material/Grid";
import { Box, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import QuickAccessCards from "../components/QuickAccessCards";
import WeeklyProgress from "../components/WeeklyProgress";
import RecommendedResources from "../components/RecommendedResources";
import NextSession from "../components/NextSession";
import ProgressChart from "../components/ProgressChart";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

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
          Bienvenido a tu espacio de bienestar
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Hoy es un buen día para cuidar de ti mismo
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <QuickAccessCards />
          </Grid>
          <Grid item xs={12} md={8}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <WeeklyProgress />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <NextSession />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 2 }}
              />
            ) : (
              <ProgressChart />
            )}
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
}
