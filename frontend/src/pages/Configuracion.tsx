import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Avatar,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Configuracion() {
  const { usuario } = useAuth();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Configuración
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Gestiona tu perfil y preferencias de la cuenta
      </Typography>

      <Grid container spacing={3}>
        {/* Perfil */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Datos Personales</Typography>
              <Box display="flex" alignItems="center" mb={3} gap={2}>
                <Avatar sx={{ width: 64, height: 64 }} />
                <Button variant="outlined" size="small">Cambiar foto</Button>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Nombre completo" defaultValue={usuario?.nombre} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Email" defaultValue={usuario?.email} disabled />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Teléfono" placeholder="+34 600 000 000" />
                </Grid>
              </Grid>
              <Button variant="contained" sx={{ mt: 3 }}>Guardar Cambios</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferencias y Seguridad */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Seguridad</Typography>
              <TextField fullWidth label="Contraseña actual" type="password" margin="normal" />
              <TextField fullWidth label="Nueva contraseña" type="password" margin="normal" />
              <Button variant="outlined" sx={{ mt: 2 }}>Actualizar Contraseña</Button>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Preferencias</Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="Recibir notificaciones por email" />
              <FormControlLabel control={<Switch defaultChecked />} label="Recordatorios de sesiones" />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Métodos de Pago</Typography>
              <Typography color="text.secondary" fontSize={14} mb={2}>
                Tarjeta terminada en **** 4242
              </Typography>
              <Button variant="outlined" size="small">Gestionar métodos de pago</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Legal */}
        <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>Legal y Políticas</Typography>
                    <Box display="flex" gap={2}>
                        <Button color="inherit">Términos de Uso</Button>
                        <Button color="inherit">Política de Privacidad</Button>
                        <Button color="inherit">Política de Cookies</Button>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
