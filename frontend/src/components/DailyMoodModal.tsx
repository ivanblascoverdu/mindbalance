import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import { useForm } from "react-hook-form";

const moods = [
  {
    label: "Genial",
    icon: <SentimentSatisfiedAltIcon color="primary" fontSize="large" />,
  },
  {
    label: "Bien",
    icon: <SentimentSatisfiedIcon color="secondary" fontSize="large" />,
  },
  {
    label: "Regular",
    icon: <SentimentNeutralIcon color="action" fontSize="large" />,
  },
  {
    label: "Mal",
    icon: <SentimentVeryDissatisfiedIcon color="error" fontSize="large" />,
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DailyMoodModal({ open, onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [snack, setSnack] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    // Aquí puedes hacer fetch al backend si quieres guardar el registro
    setSnack(true);
    reset();
    setSelected(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Registro diario</DialogTitle>
        <DialogContent>
          <Typography mb={2}>¿Cómo te sientes hoy?</Typography>
          <Box display="flex" justifyContent="space-between" mb={2}>
            {moods.map((mood, idx) => (
              <IconButton
                key={mood.label}
                onClick={() => setSelected(idx)}
                sx={{
                  border:
                    selected === idx
                      ? "2px solid #1479fb"
                      : "2px solid transparent",
                  bgcolor: selected === idx ? "#e7f1fc" : "transparent",
                }}
              >
                {mood.icon}
              </IconButton>
            ))}
          </Box>
          <TextField
            label="¿Quieres añadir una nota?"
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            {...register("note")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={selected === null}
            onClick={handleSubmit(onSubmit)}
          >
            Guardar registro
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snack}
        autoHideDuration={3500}
        onClose={() => setSnack(false)}
        message="¡Registro diario guardado con éxito!"
      />
    </>
  );
}
