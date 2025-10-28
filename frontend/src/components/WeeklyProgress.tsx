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
  { label: "Mindfulness matutino", current: 7, total: 7, color: "#1479fb" },
  { label: "Registro de emociones", current: 5, total: 7, color: "#14c3da" },
  {
    label: "Ejercicios de respiración",
    current: 4,
    total: 7,
    color: "#43dfaf",
  },
];

export default function WeeklyProgress({
  activities = defaultActivities,
}: {
  activities?: Activity[];
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Tu progreso esta semana
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Has completado 3 de 5 actividades programadas
        </Typography>
        {activities.map((activity) => (
          <Box key={activity.label} mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography fontSize={16} fontWeight={500}>
                {activity.label}
              </Typography>
              <Typography fontSize={14} color="text.secondary">
                {activity.current}/{activity.total}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(activity.current / activity.total) * 100}
              sx={{
                height: 8,
                borderRadius: 8,
                background: "#eef4fb",
                "& .MuiLinearProgress-bar": { backgroundColor: activity.color },
              }}
            />
          </Box>
        ))}
        <Box textAlign="center" mt={2}>
          <Button variant="text">Ver progreso detallado</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
