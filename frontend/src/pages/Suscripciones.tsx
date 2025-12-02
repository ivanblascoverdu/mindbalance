import Grid from "@mui/material/Grid";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";

export default function Suscripciones() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
        setProcessing(false);
        setSelectedPlan(null);
        setSnackOpen(true);
    }, 2000);
  };

  const plans = [
    {
      title: "Básico",
      price: "0€",
      period: "/mes",
      features: [
        "Acceso a programas básicos",
        "Registro diario de emociones",
        "Comunidad pública",
        "1 sesión mensual gratuita",
      ],
      buttonText: "Plan Actual",
      buttonVariant: "outlined" as const,
      recommended: false,
    },
    {
      title: "Premium",
      price: "9.99€",
      period: "/mes",
      features: [
        "Todo lo del plan Básico",
        "Programas avanzados ilimitados",
        "Estadísticas detalladas de progreso",
        "Descuento en sesiones con profesionales",
        "Acceso a grupos VIP en Comunidad",
      ],
      buttonText: "Suscribirse",
      buttonVariant: "contained" as const,
      recommended: true,
      color: "primary.main",
    },
    {
      title: "Profesional",
      price: "29.99€",
      period: "/mes",
      features: [
        "Todo lo del plan Premium",
        "4 sesiones mensuales incluidas",
        "Soporte prioritario 24/7",
        "Plan personalizado de bienestar",
        "Webinars exclusivos con expertos",
      ],
      buttonText: "Suscribirse",
      buttonVariant: "contained" as const,
      recommended: false,
    },
  ];

  return (
    <Box>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Invierte en tu Bienestar
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Elige el plan que mejor se adapte a tus necesidades y empieza a cuidar de ti hoy mismo.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid size={{ xs: 12, md: 4 }} key={plan.title}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                border: plan.recommended ? "2px solid" : "1px solid",
                borderColor: plan.recommended ? "primary.main" : "divider",
                transform: plan.recommended ? "scale(1.05)" : "none",
                zIndex: plan.recommended ? 1 : 0,
                boxShadow: plan.recommended ? 6 : 1,
              }}
            >
              {plan.recommended && (
                <Chip
                  label="Recomendado"
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontWeight: 700,
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Typography
                  variant="h5"
                  component="div"
                  fontWeight={700}
                  color={plan.recommended ? "primary" : "text.primary"}
                  gutterBottom
                >
                  {plan.title}
                </Typography>
                <Box display="flex" alignItems="baseline" mb={2}>
                  <Typography variant="h3" fontWeight={800}>
                    {plan.price}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {plan.period}
                  </Typography>
                </Box>
                <List>
                  {plan.features.map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box p={3} pt={0}>
                <Button
                  fullWidth
                  variant={plan.buttonVariant}
                  color={plan.recommended ? "primary" : "inherit"}
                  size="large"
                  sx={{ py: 1.5, fontWeight: 700 }}
                  onClick={() => plan.title !== "Básico" && setSelectedPlan(plan)}
                >
                  {plan.buttonText}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={8} textAlign="center">
        <Typography variant="h5" fontWeight={700} gutterBottom>
          ¿Por qué suscribirse?
        </Typography>
        <Grid container spacing={4} mt={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StarIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>
              Contenido Exclusivo
            </Typography>
            <Typography color="text.secondary">
              Accede a cientos de horas de contenido creado por expertos.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StarIcon color="info" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>
              Seguimiento Avanzado
            </Typography>
            <Typography color="text.secondary">
              Visualiza tu progreso con gráficas detalladas y métricas.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StarIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" fontWeight={700}>
              Comunidad VIP
            </Typography>
            <Typography color="text.secondary">
              Conecta con personas afines en grupos privados y seguros.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={!!selectedPlan} onClose={() => setSelectedPlan(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Suscribirse al Plan {selectedPlan?.title}</DialogTitle>
        <DialogContent>
            <Typography gutterBottom>
                Estás a un paso de mejorar tu bienestar. Por favor, introduce tus datos de pago.
            </Typography>
            <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Nombre en la tarjeta" fullWidth />
                <TextField label="Número de tarjeta" fullWidth placeholder="0000 0000 0000 0000" />
                <Box display="flex" gap={2}>
                    <TextField label="Fecha de expiración" placeholder="MM/YY" fullWidth />
                    <TextField label="CVC" placeholder="123" fullWidth />
                </Box>
            </Box>
            <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal</Typography>
                    <Typography>{selectedPlan?.price}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight={700}>Total a pagar</Typography>
                    <Typography fontWeight={700}>{selectedPlan?.price}</Typography>
                </Box>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setSelectedPlan(null)}>Cancelar</Button>
            <Button variant="contained" onClick={handlePayment} disabled={processing}>
                {processing ? "Procesando..." : "Pagar y Suscribirse"}
            </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        message="¡Pago realizado con éxito! Bienvenido a tu nuevo plan."
      />
    </Box>
  );
}
