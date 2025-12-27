import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Session {
  date: string;
  time: string;
  professional: string;
  meetLink?: string;
}

export default function NextSession({ session }: { session?: Session | null }) {
  const navigate = useNavigate();

  if (!session) {
    return (
      <Card
        sx={{
          background: "linear-gradient(90deg, #78909C 0%, #90A4AE 100%)",
          color: "#fff",
          boxShadow: 3,
          mt: 3,
        }}
      >
        <CardContent>
          <Typography fontWeight={700} fontSize={20}>
            Sin sesiones programadas
          </Typography>
          <Typography fontSize={16} fontWeight={400} mt={1}>
            No tienes ninguna cita próxima
          </Typography>
          <Typography mt={2} fontSize={14}>
            Agenda una sesión con uno de nuestros profesionales
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              sx={{ background: "#fff", color: "primary.main", fontWeight: 700 }}
              onClick={() => navigate("/sesiones")}
            >
              Reservar sesión
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: "linear-gradient(90deg, #2A9D8F 0%, #26A69A 100%)",
        color: "#fff",
        boxShadow: 3,
        mt: 3,
      }}
    >
      <CardContent>
        <Typography fontWeight={700} fontSize={20}>
          Próxima sesión programada
        </Typography>
        <Typography fontSize={16} fontWeight={400} mt={1}>
          {session.date} • {session.time}
        </Typography>
        <Typography mt={2}>
          Sesión con {session.professional}
        </Typography>
        <Box sx={{ mt: 3 }}>
          {session.meetLink ? (
            <Button
              variant="contained"
              sx={{ background: "#fff", color: "primary.main", fontWeight: 700 }}
              href={session.meetLink}
              target="_blank"
            >
              Unirse a videollamada
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ background: "#fff", color: "primary.main", fontWeight: 700 }}
              onClick={() => navigate("/sesiones")}
            >
              Ver detalles
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
