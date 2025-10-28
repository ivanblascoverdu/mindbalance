import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../hooks/useApi";

export default function Register({ setAuthenticated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await apiRequest("http://localhost:4000/api/auth/register", "POST", data);
      setAuthenticated(true);
      navigate("/programas");
    } catch {
      setError("No se pudo crear la cuenta");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Crear cuenta
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              fullWidth
              label="Nombre completo"
              {...register("nombre", { required: "Nombre obligatorio" })}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              {...register("email", { required: "Email obligatorio" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              type="password"
              label="Contraseña"
              {...register("password", { required: "Contraseña obligatoria" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Crear cuenta
            </Button>
            <Button
              color="secondary"
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ mt: 2 }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </form>
          <Snackbar
            open={!!error}
            autoHideDuration={4000}
            onClose={() => setError("")}
            message={error}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
