// frontend/src/components/ProgressChart.tsx
import { Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
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

const data = {
  labels: [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ],
  datasets: [
    {
      label: "Bienestar",
      data: [3, 4, 5, 4, 5, 4, 5], // debes cargar estos datos dinámicamente
      fill: false,
      borderColor: "#2A9D8F",
      tension: 0.15,
    },
  ],
};

const options = {
  responsive: true,
  plugins: { legend: { display: true } },
};

export default function ProgressChart() {
  return (
    <Box sx={{ background: "white", borderRadius: 2, boxShadow: 1, p: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Progreso semanal
      </Typography>
      <Line data={data} options={options} />
    </Box>
  );
}
