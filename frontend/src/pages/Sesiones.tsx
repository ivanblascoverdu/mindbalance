import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Snackbar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../services/api";

interface Profesional {
  _id: string;
  nombre: string;
  email: string;
}

interface Cita {
  _id: string;
  profesional: Profesional;
  fecha: string;
  estado: string;
  linkReunion?: string;
}

export default function Sesiones() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProf, setSelectedProf] = useState<Profesional | null>(null);
  const [fecha, setFecha] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profRes, citasRes] = await Promise.all([
        api.get("/citas/profesionales"),
        api.get("/citas"),
      ]);
      setProfesionales(profRes.data);
      setCitas(citasRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleReservarClick = (prof: Profesional) => {
    setSelectedProf(prof);
    setOpenDialog(true);
  };

  const handleConfirmarReserva = async () => {
    if (!selectedProf || !fecha) return;
    try {
      await api.post("/citas", {
        profesionalId: selectedProf._id,
        fecha,
        notas: "Reserva desde la web",
      });
      setOpenDialog(false);
      setSnackOpen(true);
      fetchData();
    } catch (error) {
      console.error("Error reservando:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Teleconsultas
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Sesiones profesionales seguras y confidenciales
      </Typography>

      <Typography variant="h5" fontWeight={700} gutterBottom mt={4}>
        Mis Citas Programadas
      </Typography>
      {citas.length === 0 ? (
        <Typography color="text.secondary">No tienes citas programadas.</Typography>
      ) : (
        <Grid container spacing={2} mb={4}>
          {citas.map((cita) => (
            <Grid item xs={12} md={6} key={cita._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography fontWeight={700}>
                    {new Date(cita.fecha).toLocaleString()}
                  </Typography>
                  <Typography>
                    Profesional: {cita.profesional?.nombre || "N/A"}
                  </Typography>
                  <Chip
                    label={cita.estado.toUpperCase()}
                    color={
                      cita.estado === "confirmada"
                        ? "success"
                        : cita.estado === "pendiente"
                        ? "warning"
                        : "default"
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  {cita.linkReunion && (
                    <Button
                      href={cita.linkReunion}
                      target="_blank"
                      variant="contained"
                      size="small"
                      sx={{ ml: 2, mt: 1 }}
                    >
                      Unirse
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h5" fontWeight={700} gutterBottom mt={4}>
        Profesionales Disponibles
      </Typography>
      <Grid container spacing={3}>
        {profesionales.map((p) => (
          <Grid item xs={12} md={4} key={p._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography fontWeight={700}>{p.nombre}</Typography>
                <Typography color="text.secondary" gutterBottom>
                  Psicólogo Clínico
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleReservarClick(p)}
                >
                  Reservar sesión
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reservar con {selectedProf?.nombre}</DialogTitle>
        <DialogContent>
          <TextField
            label="Fecha y Hora"
            type="datetime-local"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarReserva} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        message="¡Solicitud de cita enviada!"
      />
    </Box>
  );
}
