import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [rol, setRol] = useState("usuario");

  const password = watch("password");

  const onSubmit = async (data: any) => {
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
              helperText={errors.nombre?.message as string}
            />
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
            <TextField
              margin="normal"
              fullWidth
              type="password"
              label="Confirmar Contraseña"
              {...register("confirmPassword", {
                required: "Confirmar contraseña es obligatorio",
                validate: (val) =>
                  val === password || "Las contraseñas no coinciden",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message as string}
            />

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Quiero registrarme como:</FormLabel>
              <RadioGroup
                row
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <FormControlLabel
                  value="usuario"
                  control={<Radio />}
                  label="Cliente"
                />
                <FormControlLabel
                  value="profesional"
                  control={<Radio />}
                  label="Profesional"
                />
              </RadioGroup>
            </FormControl>

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Crear cuenta
            </Button>
            <Button
              color="secondary"
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ mt: 2, width: "100%" }}
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
          <Snackbar
            open={!!successMsg}
            autoHideDuration={6000}
            onClose={() => setSuccessMsg("")}
            message={successMsg}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
