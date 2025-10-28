import { Grid, Card, CardContent, Typography, Tooltip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GroupIcon from "@mui/icons-material/Group";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DailyMoodModal from "./DailyMoodModal"; // Asegúrate de crear este componente

const options = [
  {
    title: "Programas",
    description: "Continúa tu intervención",
    icon: <PsychologyIcon color="primary" />,
    to: "/programas",
    tooltip: "Accede y gestiona tus programas personalizados",
  },
  {
    title: "Sesión",
    description: "Reserva con un profesional",
    icon: <CalendarMonthIcon color="primary" />,
    to: "/sesiones",
    tooltip: "Reserva una sesión con tu especialista de confianza",
  },
  {
    title: "Registro diario",
    description: "¿Cómo te sientes hoy?",
    icon: <FavoriteBorderIcon color="primary" />,
    to: "#",
    tooltip: "Registra tu estado emocional diariamente",
  },
  {
    title: "Comunidad",
    description: "Comparte y conecta",
    icon: <GroupIcon color="primary" />,
    to: "/comunidad",
    tooltip: "Participa en la comunidad y comparte tu progreso",
  },
];

export default function QuickAccessCards() {
  const navigate = useNavigate();
  const [moodOpen, setMoodOpen] = useState(false);

  // Manejo del onClick para Registro Diario y resto de rutas
  const handleCardClick = (opt: (typeof options)[number]) => {
    if (opt.to === "#") setMoodOpen(true);
    else navigate(opt.to);
  };

  return (
    <>
      <Grid container spacing={2}>
        {options.map((opt) => (
          <Grid item xs={12} sm={6} md={3} key={opt.title}>
            <Tooltip title={opt.tooltip} arrow>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.03)",
                    boxShadow: 3,
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => handleCardClick(opt)}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    display="flex"
                    alignItems="center"
                  >
                    {opt.icon}&nbsp;{opt.title}
                  </Typography>
                  <Typography color="text.secondary" mt={1}>
                    {opt.description}
                  </Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <DailyMoodModal open={moodOpen} onClose={() => setMoodOpen(false)} />
    </>
  );
}
