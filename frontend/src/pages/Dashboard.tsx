import Grid from "@mui/material/Grid";
import { Box, Typography, Skeleton, Stack, Chip } from "@mui/material";
import { motion } from "framer-motion";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useState, useEffect } from "react";
import QuickAccessCards from "../components/QuickAccessCards";
import WeeklyProgress from "../components/WeeklyProgress";
import RecommendedResources from "../components/RecommendedResources";
import NextSession from "../components/NextSession";
import ProgressChart from "../components/ProgressChart";
import { useAuth } from "../context/AuthContext";
import { staggerContainer, staggerItem } from "../components/PageTransition";
import api from "../services/api";

interface DashboardSession {
  date: string;
  time: string;
  professional: string;
  meetLink?: string;
}

interface CitaApi {
  _id: string;
  fecha: string;
  estado: string;
  linkReunion?: string;
  profesional?: { nombre?: string } | null;
}

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

  const [userActivities] = useState([]);
  const [nextSession, setNextSession] = useState<DashboardSession | null>(null);
  const [progressData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await api.get<CitaApi[]>("/citas");
        const ahora = Date.now();
        const proxima = (Array.isArray(data) ? data : [])
          .filter((c) => c.estado !== "cancelada" && new Date(c.fecha).getTime() > ahora)
          .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())[0];

        if (proxima && !cancelled) {
          const f = new Date(proxima.fecha);
          setNextSession({
            date: f.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }),
            time: f.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            professional: proxima.profesional?.nombre || "Profesional",
            meetLink: proxima.linkReunion,
          });
        }
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const firstName = usuario?.nombre?.split(" ")[0] || "";

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Aura decorativa muy sutil */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -40,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(95,174,156,0.16) 0%, rgba(95,174,156,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Stack
        spacing={1.2}
        sx={{
          mb: 4.5,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: 14, color: "primary.dark !important" }} />}
            label={todayLabel()}
            size="small"
            sx={{
              background: "rgba(58,153,138,0.10)",
              color: "primary.dark",
              fontWeight: 600,
              textTransform: "capitalize",
              letterSpacing: "0.02em",
              border: "1px solid rgba(58,153,138,0.18)",
              "& .MuiChip-icon": { ml: 0.5 },
            }}
          />
        </Stack>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 28, sm: 34, md: 38 },
            letterSpacing: "-0.025em",
            background: "linear-gradient(135deg, #1F3A40 0%, #3A998A 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {getGreeting()}{firstName ? `, ${firstName}` : ""} 👋
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 16, maxWidth: 560 }}>
          Hoy es un buen día para cuidar de ti. Respira hondo, ve a tu ritmo y disfruta del camino.
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
