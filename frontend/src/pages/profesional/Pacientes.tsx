import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Button,
} from "@mui/material";

// Datos de ejemplo (luego se conectará con backend)
const pacientes = [
  { id: 1, nombre: "Juan Pérez", email: "juan@example.com", estado: "Activo", ultimaSesion: "2023-10-25" },
  { id: 2, nombre: "Ana García", email: "ana@example.com", estado: "En pausa", ultimaSesion: "2023-10-20" },
  { id: 3, nombre: "Carlos López", email: "carlos@example.com", estado: "Activo", ultimaSesion: "2023-10-28" },
];

export default function Pacientes() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Mis Pacientes
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Gestión y seguimiento de tus pacientes asignados
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Última Sesión</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pacientes.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{p.nombre.charAt(0)}</Avatar>
                    <Typography fontWeight={500}>{p.nombre}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={p.estado} 
                    color={p.estado === "Activo" ? "success" : "warning"} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{p.ultimaSesion}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined">Ver ficha</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
