import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography, Tooltip, Box, Stack } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GroupIcon from "@mui/icons-material/Group";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DailyMoodModal from "./DailyMoodModal";

const options = [
  {
    title: "Programas",
    description: "Continúa tu intervención",
    icon: <PsychologyIcon />,
    to: "/programas",
    tooltip: "Accede y gestiona tus programas personalizados",
    gradient: "linear-gradient(135deg, #3A998A 0%, #5FAE9C 100%)",
  },
  {
    title: "Sesión",
    description: "Reserva con un profesional",
    icon: <CalendarMonthIcon />,
    to: "/sesiones",
    tooltip: "Reserva una sesión con tu especialista de confianza",
    gradient: "linear-gradient(135deg, #5C8FA5 0%, #84B0C4 100%)",
  },
  {
    title: "Registro diario",
    description: "¿Cómo te sientes hoy?",
    icon: <FavoriteBorderIcon />,
    to: "#",
    tooltip: "Registra tu estado emocional diariamente",
    gradient: "linear-gradient(135deg, #C29A5B 0%, #D6B57A 100%)",
  },
  {
    title: "Comunidad",
    description: "Conecta con otros usuarios",
    icon: <GroupIcon />,
    to: "/comunidad",
    tooltip: "Accede al foro y comparte con la comunidad",
    gradient: "linear-gradient(135deg, #8FC6B7 0%, #B8DCD2 100%)",
  },
];

export default function QuickAccessCards() {
  const navigate = useNavigate();
  const [moodOpen, setMoodOpen] = useState(false);

  const handleCardClick = (opt: typeof options[number]) => {
    if (opt.title === "Registro diario") {
      setMoodOpen(true);
    } else {
      navigate(opt.to);
    }
  };

  return (
    <Grid container spacing={2.5}>
      {options.map((opt) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={opt.title}>
          <Tooltip title={opt.tooltip} arrow>
            <Card
              sx={{
                cursor: "pointer",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 18px 40px rgba(31, 58, 64, 0.10)",
                  borderColor: "primary.light",
                  "& .quick-icon": {
                    transform: "rotate(-6deg) scale(1.06)",
                    boxShadow: "0 12px 28px rgba(58,153,138,0.30)",
                  },
                  "& .quick-arrow": {
                    transform: "translateX(4px)",
                    opacity: 1,
                  },
                },
              }}
              onClick={() => handleCardClick(opt)}
              variant="outlined"
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  sx={{ mb: 1.5 }}
                >
                  <Box
                    className="quick-icon"
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "14px",
                      background: opt.gradient,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 16px rgba(58,153,138,0.18)",
                      transition: "transform 0.4s cubic-bezier(0.32,0.72,0,1), box-shadow 0.4s ease",
                    }}
                  >
                    {opt.icon}
                  </Box>
                  <ArrowForwardIcon
                    className="quick-arrow"
                    sx={{
                      fontSize: 18,
                      color: "text.secondary",
                      opacity: 0.4,
                      transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1), opacity 0.32s ease",
                    }}
                  />
                </Stack>
                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {opt.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {opt.description}
                </Typography>
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
      ))}
      <DailyMoodModal open={moodOpen} onClose={() => setMoodOpen(false)} />
    </Grid>
  );
}
