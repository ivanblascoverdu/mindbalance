import { Card, CardContent, Typography, Button, Box } from "@mui/material";

export default function NextSession() {
  return (
    <Card
      sx={{
        background: "linear-gradient(90deg, #2A9D8F 0%, #26A69A 100%)",
        color: "#fff",
        boxShadow: 3,
        mt: 3,
      }}
    >
      <CardContent>
        <Typography fontWeight={700} fontSize={20}>
          Próxima sesión programada
        </Typography>
        <Typography fontSize={16} fontWeight={400} mt={1}>
          Martes, 28 de Octubre • 10:00 AM
        </Typography>
        <Typography mt={2}>
          Sesión de seguimiento con la Dra. María González
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            sx={{ background: "#fff", color: "primary.main", fontWeight: 700 }}
            href="https://meet.google.com/abc-defg-hij"
            target="_blank"
          >
            Unirse a videollamada
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
