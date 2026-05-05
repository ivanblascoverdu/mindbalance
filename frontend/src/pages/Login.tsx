import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  CircularProgress,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SpaIcon from "@mui/icons-material/Spa";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import GroupsIcon from "@mui/icons-material/Groups";
import VideoCallIcon from "@mui/icons-material/VideoCall";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleResponse = async (response: any) => {
    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

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
            width: 360,
            text: "continue_with",
            locale: "es",
            shape: "pill",
          }
        );
      }
    };

    return () => {
      if (script.parentNode) document.body.removeChild(script);
    };
  }, [GOOGLE_CLIENT_ID]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/login", data);
      const { token, ...usuario } = response.data;
      login(token, usuario);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Email o contraseña incorrectos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: <SelfImprovementIcon />, label: "Programas terapéuticos personalizados" },
    { icon: <VideoCallIcon />, label: "Teleconsultas con profesionales" },
    { icon: <GroupsIcon />, label: "Comunidad de apoyo verificada" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* Lado izquierdo — Hero (solo desktop) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #2A9D8F 0%, #26A69A 50%, #4DB6AC 100%)",
          color: "#fff",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
        }}
      >
        {/* Blobs decorativos */}
        <Box
          component={motion.div}
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            filter: "blur(40px)",
          }}
        />
        <Box
          component={motion.div}
          animate={{ y: [0, 25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          sx={{
            position: "absolute",
            bottom: "-15%",
            left: "-10%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            filter: "blur(50px)",
          }}
        />

        <Stack
          component={motion.div}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          spacing={4}
          sx={{ position: "relative", maxWidth: 480 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                bgcolor: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SpaIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} letterSpacing={0.3}>
              MindBalance
            </Typography>
          </Stack>

          <Box>
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{ lineHeight: 1.15, mb: 2 }}
            >
              Tu bienestar mental, a tu ritmo.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: "1.05rem" }}>
              Acompañamiento profesional, programas basados en evidencia y una
              comunidad que te entiende. Todo en un solo lugar.
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {features.map((f, i) => (
              <Stack
                key={f.label}
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    bgcolor: "rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </Box>
                <Typography sx={{ opacity: 0.95 }}>{f.label}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Lado derecho — Formulario */}
      <Box
        sx={{
          flex: { xs: 1, md: "0 0 50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 4 },
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          sx={{ width: "100%", maxWidth: 420 }}
        >
          {/* Logo móvil */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
            sx={{ display: { xs: "flex", md: "none" }, mb: 4 }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, #2A9D8F 0%, #4DB6AC 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <SpaIcon />
            </Box>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              MindBalance
            </Typography>
          </Stack>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Bienvenido de nuevo
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Inicia sesión para continuar con tu progreso.
          </Typography>

          {GOOGLE_CLIENT_ID && (
            <>
              <Box
                id="google-signin-button"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mb: 2.5,
                }}
              />
              <Divider sx={{ my: 2.5 }}>
                <Typography variant="caption" color="text.secondary">
                  o con tu email
                </Typography>
              </Divider>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                autoComplete="email"
                {...register("email", { required: "Email obligatorio" })}
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                autoComplete="current-password"
                {...register("password", { required: "Contraseña obligatoria" })}
                error={!!errors.password}
                helperText={errors.password?.message as string}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="mostrar contraseña"
                        onClick={() => setShowPassword((s) => !s)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  underline="hover"
                  sx={{ color: "text.secondary" }}
                  onClick={(e) => e.preventDefault()}
                >
                  ¿Has olvidado tu contraseña?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ py: 1.4, fontSize: "1rem", mt: 1 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            ¿No tienes cuenta?{" "}
            <Link
              component="button"
              type="button"
              fontWeight={600}
              underline="hover"
              onClick={() => navigate("/register")}
            >
              Crea una cuenta
            </Link>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
