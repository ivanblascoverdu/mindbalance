import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

export default function Agenda() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Agenda Profesional
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Gestiona tus citas y disponibilidad
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Calendario Semanal</Typography>
              <Box height={400} bgcolor="#f0f0f0" display="flex" alignItems="center" justifyContent="center" borderRadius={2}>
                <Typography color="text.secondary">Vista de Calendario (Próximamente)</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Próximas Citas</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Juan Pérez" secondary="Hoy, 10:00 AM - Terapia Individual" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Ana García" secondary="Mañana, 16:00 PM - Seguimiento" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Carlos López" secondary="Viernes, 11:00 AM - Primera Consulta" />
                </ListItem>
              </List>
              <Button fullWidth variant="contained" sx={{ mt: 2 }}>Nueva Cita</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
