import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Button,
} from "@mui/material";

interface Activity {
  label: string;
  current: number;
  total: number;
  color: string;
}

const defaultActivities: Activity[] = [
  { label: "Mindfulness matutino", current: 20, total: 30, color: "primary" },
  { label: "Registro de emociones", current: 15, total: 30, color: "secondary" },
  {
    label: "Ejercicios de respiración",
    current: 10,
    total: 30,
    color: "success",
  },
];

import { useNavigate } from "react-router-dom";

export default function WeeklyProgress({
  activities = defaultActivities,
}: {
  activities?: Activity[];
}) {
  const navigate = useNavigate();
  return (
    <Card variant="outlined" sx={{ height: "100%", minHeight: 400 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Tu progreso este mes
        </Typography>
        <Typography color="text.secondary" mb={4} fontSize={16}>
          Has completado 45 de 90 actividades programadas
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
        <Box textAlign="center" mt={2}>
          <Button variant="text" onClick={() => navigate("/progreso")}>Ver progreso detallado</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
