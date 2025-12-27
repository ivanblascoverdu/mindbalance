// frontend/src/components/ProgressChart.tsx
import { Box, Typography, Button } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressData {
  labels: string[];
  values: number[];
}

const defaultLabels = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function ProgressChart({ data }: { data?: ProgressData | null }) {
  const navigate = useNavigate();
  const hasData = data && data.values.length > 0 && data.values.some(v => v > 0);

  const chartData = {
    labels: data?.labels || defaultLabels,
    datasets: [
      {
        label: "Bienestar",
        data: data?.values || [],
        fill: false,
        borderColor: "#2A9D8F",
        tension: 0.15,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: true } },
    scales: {
      y: {
        min: 0,
        max: 10,
      },
    },
  };

  if (!hasData) {
    return (
      <Box sx={{ background: "white", borderRadius: 2, boxShadow: 1, p: 4, textAlign: "center" }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Progreso semanal
        </Typography>
        <Typography color="text.secondary" fontSize={14} mb={2}>
          Aún no hay datos de bienestar registrados
        </Typography>
        <Typography color="text.secondary" fontSize={13} mb={3}>
          Registra tu estado de ánimo diariamente para ver tu evolución
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/progreso")}>
          Registrar mi estado
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "white", borderRadius: 2, boxShadow: 1, p: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Progreso semanal
      </Typography>
      <Line data={chartData} options={options} />
    </Box>
  );
}
