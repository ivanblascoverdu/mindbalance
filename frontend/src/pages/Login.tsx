import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ px: { xs: 2, sm: 3 }, py: { xs: 4, sm: 0 } }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", mx: "auto" }}>
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
              type={showPassword ? "text" : "password"}
              label="Contraseña"
              {...register("password", { required: "Contraseña obligatoria" })}
              error={!!errors.password}
              helperText={errors.password?.message as string}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
