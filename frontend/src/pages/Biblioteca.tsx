import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const recursos = [
  {
    tema: "Mindfulness",
    titulo: "Introducción al Mindfulness",
    tipo: "Artículo",
    duracion: "5 min",
  },
  {
    tema: "Meditación",
    titulo: "Meditación guiada para principiantes",
    tipo: "Audio",
    duracion: "10 min",
  },
  {
    tema: "Ansiedad",
    titulo: "Técnicas de respiración para la ansiedad",
    tipo: "Vídeo",
    duracion: "8 min",
  },
  {
    tema: "Estrés",
    titulo: "Gestión del estrés laboral",
    tipo: "Artículo",
    duracion: "7 min",
  },
  {
    tema: "Sueño",
    titulo: "Rutina nocturna para mejor sueño",
    tipo: "Audio",
    duracion: "12 min",
  },
  {
    tema: "Sueño",
    titulo: "Meditación para dormir",
    tipo: "Audio",
    duracion: "20 min",
  },
];

export default function Biblioteca() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Biblioteca Psicoeducativa
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Recursos validados por profesionales de la salud mental
        </Typography>
        <TextField
          label="Buscar recursos..."
          variant="outlined"
          size="small"
          sx={{ mb: 3, width: "100%", maxWidth: 400 }}
          disabled={loading}
        />
        <Grid container spacing={3}>
          {loading
            ? [1, 2, 3, 4, 5, 6].map((n) => (
                <Grid item xs={12} sm={6} md={4} key={n}>
                  <Card variant="outlined">
                    <CardContent>
                      <Skeleton
                        variant="rectangular"
                        height={30}
                        width={80}
                        sx={{ mb: 2 }}
                      />
                      <Skeleton variant="text" height={30} />
                      <Skeleton variant="text" height={20} width="70%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : recursos.map((r, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
                  >
                    <CardContent>
                      <Chip label={r.tema} sx={{ mb: 2 }} />
                      <Typography variant="h6" fontWeight={700}>
                        {r.titulo}
                      </Typography>
                      <Typography color="text.secondary">
                        {r.tipo} • {r.duracion}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
        {!loading && (
          <Box mt={4}>
            <Chip color="success" label="Contenido validado" />
            <Typography color="text.secondary" fontSize={15} mt={1}>
              Todos los recursos han sido revisados y validados por
              profesionales de la salud mental certificados.
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
