import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Stack,
  CircularProgress,
  Link,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import SpaIcon from "@mui/icons-material/Spa";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TimelineIcon from "@mui/icons-material/Timeline";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [rol, setRol] = useState("usuario");

  const password = watch("password");
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
      setError(err.response?.data?.mensaje || "Error al registrarse con Google");
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
          document.getElementById("google-signup-button"),
          {
            theme: "outline",
            size: "large",
            width: 360,
            text: "signup_with",
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
      const response = await api.post("/auth/registro", { ...data, rol });
      if (response.data.pendiente) {
        setSuccessMsg(response.data.mensaje);
        setTimeout(() => navigate("/login"), 5000);
      } else {
        const { token, ...usuario } = response.data;
        login(token, usuario);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "No se pudo crear la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: <FavoriteIcon />, label: "Empieza gratis, sin tarjeta" },
    { icon: <VerifiedUserIcon />, label: "Profesionales colegiados verificados" },
    { icon: <TimelineIcon />, label: "Tu progreso, siempre privado y seguro" },
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
      {/* Lado izquierdo — Hero */}
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
            <Typography variant="h3" fontWeight={700} sx={{ lineHeight: 1.15, mb: 2 }}>
              Empieza tu camino hacia el equilibrio.
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: "1.05rem" }}>
              Únete a miles de personas que ya están cuidando de su salud mental
              con apoyo profesional cuando lo necesitan.
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mt: 2 }}>
            {benefits.map((b, i) => (
              <Stack
                key={b.label}
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
                  {b.icon}
                </Box>
                <Typography sx={{ opacity: 0.95 }}>{b.label}</Typography>
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
          sx={{ width: "100%", maxWidth: 440 }}
        >
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
                background: "linear-gradient(135deg, #2A9D8F 0%, #4DB6AC 100%)",
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
            Crea tu cuenta
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Tarda menos de un minuto. Es completamente gratis.
          </Typography>

          {/* Selector de rol — visual cards */}
          <RadioGroup
            row
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            sx={{ mb: 3, gap: 1.5, flexWrap: "nowrap" }}
          >
            {[
              { value: "usuario", icon: <PersonIcon />, label: "Cliente", desc: "Quiero cuidarme" },
              { value: "profesional", icon: <MedicalServicesIcon />, label: "Profesional", desc: "Soy psicólogo/a" },
            ].map((opt) => (
              <Paper
                key={opt.value}
                component={motion.div}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRol(opt.value)}
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: rol === opt.value ? "primary.main" : "divider",
                  bgcolor: rol === opt.value ? "rgba(42,157,143,0.06)" : "transparent",
                  transition: "all 0.25s ease",
                  borderRadius: 3,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <FormControlLabel
                    value={opt.value}
                    control={<Radio sx={{ p: 0.5 }} />}
                    label=""
                    sx={{ m: 0 }}
                  />
                  <Box sx={{ color: rol === opt.value ? "primary.main" : "text.secondary" }}>
                    {opt.icon}
                  </Box>
                  <Box>
                    <Typography fontWeight={600} fontSize={14}>
                      {opt.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {opt.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </RadioGroup>

          {GOOGLE_CLIENT_ID && (
            <>
              <Box
                id="google-signup-button"
                sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2 }}
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
                label="Nombre completo"
                autoComplete="name"
                {...register("nombre", { required: "Nombre obligatorio" })}
                error={!!errors.nombre}
                helperText={errors.nombre?.message as string}
              />
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
                type="password"
                label="Contraseña"
                autoComplete="new-password"
                {...register("password", {
                  required: "Contraseña obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                error={!!errors.password}
                helperText={errors.password?.message as string}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirmar contraseña"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Confirma la contraseña",
                  validate: (val) => val === password || "Las contraseñas no coinciden",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message as string}
              />

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
                  "Crear cuenta"
                )}
              </Button>
            </Stack>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 3 }}
          >
            ¿Ya tienes cuenta?{" "}
            <Link
              component="button"
              type="button"
              fontWeight={600}
              underline="hover"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
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
        <Alert onClose={() => setError("")} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!successMsg}
        autoHideDuration={6000}
        onClose={() => setSuccessMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMsg("")} severity="success" variant="filled">
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
