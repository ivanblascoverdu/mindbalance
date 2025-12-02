import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography, Tooltip, Box } from "@mui/material";
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
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={opt.title}>
          <Tooltip title={opt.tooltip}>
            <Card
              sx={{
                cursor: "pointer",
                height: "100%",
                transition: "all 0.3s ease",
                border: "1px solid rgba(0,0,0,0.05)",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 20px rgba(42, 157, 143, 0.15)",
                  borderColor: "primary.main",
                  "& .icon-box": {
                    bgcolor: "primary.main",
                    color: "white",
                  },
                },
              }}
              onClick={() => handleCardClick(opt)}
              variant="outlined"
            >
              <CardContent>
                <Box
                  className="icon-box"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    bgcolor: "primary.light",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    transition: "all 0.3s ease",
                  }}
                >
                  {opt.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {opt.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
