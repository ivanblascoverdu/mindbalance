import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DailyMoodModal({ open, onClose }: Props) {
  const [mood, setMood] = useState("");

  const onSubmit = () => {
    // Logica de envío aquí
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Registro diario</DialogTitle>
      <DialogContent>
        <TextField
          label="¿Cómo te sientes hoy?"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          fullWidth
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained">
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
