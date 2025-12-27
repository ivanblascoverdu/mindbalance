import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Activity {
  label: string;
  current: number;
  total: number;
  color: string;
}

export default function WeeklyProgress({
  activities = [],
}: {
  activities?: Activity[];
}) {
  const navigate = useNavigate();
  const hasData = activities.length > 0;

  return (
    <Card variant="outlined" sx={{ height: "100%", minHeight: 400 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Tu progreso este mes
        </Typography>

        {hasData ? (
          <>
            <Typography color="text.secondary" mb={4} fontSize={16}>
              Has completado {activities.reduce((acc, a) => acc + a.current, 0)} de {activities.reduce((acc, a) => acc + a.total, 0)} actividades programadas
            </Typography>
            {activities.map((activity) => (
              <Box key={activity.label} mb={4}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={18} fontWeight={500}>
                    {activity.label}
                  </Typography>
                  <Typography fontSize={16} color="text.secondary">
                    {activity.current}/{activity.total}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(activity.current / activity.total) * 100}
                  color={activity.color as any}
                  sx={{
                    height: 15,
                    borderRadius: 8,
                    bgcolor: "action.hover",
                  }}
                />
              </Box>
            ))}
          </>
        ) : (
          <Box textAlign="center" py={6}>
            <Typography color="text.secondary" fontSize={16} mb={2}>
              Aún no tienes actividades registradas
            </Typography>
            <Typography color="text.secondary" fontSize={14} mb={3}>
              Empieza un programa para ver tu progreso aquí
            </Typography>
            <Button variant="contained" onClick={() => navigate("/programas")}>
              Explorar programas
            </Button>
          </Box>
        )}

        {hasData && (
          <Box textAlign="center" mt={2}>
            <Button variant="text" onClick={() => navigate("/progreso")}>Ver progreso detallado</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
