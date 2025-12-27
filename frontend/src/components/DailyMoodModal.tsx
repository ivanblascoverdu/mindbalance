import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import api from "../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const moods = [
  { value: 1, icon: <SentimentVeryDissatisfiedIcon fontSize="large" />, label: "Muy mal", color: "error.main" },
  { value: 2, icon: <SentimentDissatisfiedIcon fontSize="large" />, label: "Mal", color: "warning.main" },
  { value: 3, icon: <SentimentNeutralIcon fontSize="large" />, label: "Regular", color: "text.secondary" },
  { value: 4, icon: <SentimentSatisfiedIcon fontSize="large" />, label: "Bien", color: "info.main" },
  { value: 5, icon: <SentimentVerySatisfiedIcon fontSize="large" />, label: "Muy bien", color: "success.main" },
];

export default function DailyMoodModal({ open, onClose }: Props) {
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [snackOpen, setSnackOpen] = useState(false);

  const onSubmit = async () => {
    if (!selectedMood) return;

    const entry = {
      fecha: new Date().toISOString(),
      estado: selectedMood,
      nota: note,
    };

    try {
      // Try to save to backend
      await api.post("/diario", entry);
      console.log("Saved to backend");
    } catch (error) {
      console.warn("Backend not available, saving to localStorage", error);
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem("diario") || "[]");
      localStorage.setItem("diario", JSON.stringify([...existing, entry]));
    }

    setSnackOpen(true);
    setTimeout(() => {
        setSnackOpen(false);
        setNote("");
        setSelectedMood(null);
        onClose();
    }, 1500);
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registro diario</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>¿Cómo te sientes hoy?</Typography>
        <Box display="flex" justifyContent="space-between" mb={3} mt={1}>
            {moods.map((m) => (
                <Box key={m.value} display="flex" flexDirection="column" alignItems="center">
                    <IconButton 
                        onClick={() => setSelectedMood(m.value)}
                        sx={{ 
                            color: selectedMood === m.value ? m.color : "action.disabled",
                            transform: selectedMood === m.value ? "scale(1.2)" : "scale(1)",
                            transition: "all 0.2s"
                        }}
                    >
                        {m.icon}
                    </IconButton>
                    <Typography variant="caption" color={selectedMood === m.value ? "text.primary" : "text.secondary"}>
                        {m.label}
                    </Typography>
                </Box>
            ))}
        </Box>
        <TextField
          label="Notas adicionales (opcional)"
          multiline
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          fullWidth
          placeholder="Hoy me siento..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained" disabled={!selectedMood}>
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
    <Snackbar
        open={snackOpen}
        message="¡Registro guardado correctamente!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
    </>
  );
}
