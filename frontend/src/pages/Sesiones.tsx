import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

const profesionales = [
  {
    nombre: "Dra. María González",
    especialidades: ["Ansiedad", "Depresión", "Terapia Cognitivo-Conductual"],
    experiencia: 15,
  },
  {
    nombre: "Dr. Carlos Ruiz",
    especialidades: ["Estrés", "Mindfulness", "Gestión Emocional"],
    experiencia: 10,
  },
  {
    nombre: "Dra. Ana López",
    especialidades: ["Trastornos del Sueño", "Trauma", "EMDR"],
    experiencia: 12,
  },
];

export default function Sesiones() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

  const handleReservar = (nombre: string) => {
    setSelectedProf(nombre);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSnackOpen(true);
    // Aquí harías el fetch al backend
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Teleconsultas
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Sesiones profesionales seguras y confidenciales
        </Typography>
        <Box mb={4}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Próximas sesiones
          </Typography>
          <Card
            sx={{
              background: "linear-gradient(90deg, #14c3da 0%, #1479fb 100%)",
              color: "#fff",
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography fontWeight={700}>Dra. María González</Typography>
              <Typography>Martes, 28 Oct • 10:00 AM</Typography>
              <Typography fontSize={14} mt={1}>
                Seguimiento
              </Typography>
              <Button
                variant="contained"
                sx={{ background: "#fff", color: "#1479fb", mt: 2 }}
              >
                Unirse
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Typography variant="h6" fontWeight={700}>
          Nuestros profesionales
        </Typography>
        <Grid container spacing={3} my={1}>
          {profesionales.map((p) => (
            <Grid item xs={12} md={4} key={p.nombre}>
              <Card variant="outlined">
                <CardContent>
                  <Chip
                    label={
                      p.nombre.split(" ")[1][0] + p.nombre.split(" ")[2][0]
                    }
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Typography fontWeight={700}>{p.nombre}</Typography>
                  <Typography fontSize={14} color="text.secondary">
                    {p.experiencia} años de experiencia
                  </Typography>
                  <Box mt={1}>
                    <Typography fontSize={13} fontWeight={600} mb={1}>
                      Especialidades:
                    </Typography>
                    {p.especialidades.map((e) => (
                      <Chip
                        label={e}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                        key={e}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleReservar(p.nombre)}
                  >
                    Reservar sesión
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box mt={4}>
          <Typography fontWeight={700}>Sobre las sesiones</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Duración: 50 minutos por sesión" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Plataforma: Videollamada segura y cifrada" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cancelación: Hasta 24 horas antes sin cargo" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Confidencialidad: 100% garantizada bajo normativa RGPD" />
            </ListItem>
          </List>
        </Box>
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title="Confirmar reserva"
        message={`¿Estás seguro de que quieres reservar una sesión con ${selectedProf}?`}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        message="¡Sesión reservada con éxito!"
      />
    </motion.div>
  );
}
