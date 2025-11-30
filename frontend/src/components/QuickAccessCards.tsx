import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography, Tooltip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GroupIcon from "@mui/icons-material/Group";
import PsychologyIcon from "@mui/icons-material/Psychology";
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
  },
  {
    title: "Sesión",
    description: "Reserva con un profesional",
    icon: <CalendarMonthIcon />,
    to: "/sesiones",
    tooltip: "Reserva una sesión con tu especialista de confianza",
  },
  {
    title: "Registro diario",
    description: "¿Cómo te sientes hoy?",
    icon: <FavoriteBorderIcon />,
    to: "#",
    tooltip: "Registra tu estado emocional diariamente",
  },
  {
    title: "Comunidad",
    description: "Conecta con otros usuarios",
    icon: <GroupIcon />,
    to: "/comunidad",
    tooltip: "Accede al foro y comparte con la comunidad",
  },
];

export default function QuickAccessCards() {
  const navigate = useNavigate();
  const [moodOpen, setMoodOpen] = useState(false);

  const handleCardClick = (opt: any) => {
    if (opt.title === "Registro diario") {
      setMoodOpen(true);
    } else {
      navigate(opt.to);
    }
  };

  return (
    <Grid container spacing={3}>
      {options.map((opt) => (
        <Grid item xs={12} sm={6} md={3} key={opt.title}>
          <Tooltip title={opt.tooltip}>
            <Card
              sx={{ cursor: "pointer" }}
              onClick={() => handleCardClick(opt)}
              variant="outlined"
            >
              <CardContent>
                <Typography fontWeight={700} display="flex" alignItems="center">
                  {opt.icon} {opt.title}
                </Typography>
                <Typography color="text.secondary">
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
