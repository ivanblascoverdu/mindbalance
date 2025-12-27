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
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Handle Google Sign-In response
  const handleGoogleResponse = async (response: any) => {
    setIsGoogleLoading(true);
    try {
      const result = await api.post("/auth/google", {
        credential: response.credential,
      });
      const { token, ...usuario } = result.data;
      login(token, usuario);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Error al iniciar sesión con Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
            locale: "es",
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [GOOGLE_CLIENT_ID]);

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

          {/* Google Sign-In Button */}
          {GOOGLE_CLIENT_ID && (
            <>
              <Box
                id="google-signin-button"
                sx={{ width: "100%", display: "flex", justifyContent: "center", my: 2 }}
              />
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  o con email
                </Typography>
              </Divider>
            </>
          )}

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
