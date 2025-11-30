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
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: any) => {
    try {
      const response = await api.post("/auth/login", data);
      const { token, ...usuario } = response.data;
      login(token, usuario);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Email o contraseña incorrectos");
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
            Iniciar sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              {...register("email", { required: "Email obligatorio" })}
              error={!!errors.email}
              helperText={errors.email?.message as string}
            />
            <TextField
              margin="normal"
              fullWidth
              type="password"
              label="Contraseña"
              {...register("password", { required: "Contraseña obligatoria" })}
              error={!!errors.password}
              helperText={errors.password?.message as string}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Entrar
            </Button>
            <Button
              color="secondary"
              variant="text"
              onClick={() => navigate("/register")}
              sx={{ mt: 2, width: "100%" }}
            >
              ¿No tienes cuenta? Regístrate
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
