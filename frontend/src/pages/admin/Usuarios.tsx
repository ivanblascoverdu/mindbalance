import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const { data } = await api.get("/admin/usuarios");
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const handleAprobar = async (id: string) => {
    try {
      await api.put(`/admin/usuarios/${id}/aprobar`);
      fetchUsuarios();
    } catch (error) {
      console.error("Error aprobando usuario:", error);
    }
  };

  const pendientes = usuarios.filter((u) => u.estado === "pendiente");
  const mostrados = tabValue === 0 ? usuarios : pendientes;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Administración de cuentas y permisos
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Todos los usuarios" />
          <Tab 
            label={
              <Badge badgeContent={pendientes.length} color="error" sx={{ pr: 2 }}>
                Solicitudes Pendientes
              </Badge>
            } 
          />
        </Tabs>
      </Box>

      {/* Debug Info: Remove in production */}
      {/* <Typography variant="caption" display="block" gutterBottom>
        Total usuarios: {usuarios.length} | Pendientes: {pendientes.length}
      </Typography> */}

      <Button onClick={fetchUsuarios} sx={{ mb: 2 }}>Refrescar lista</Button>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mostrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography py={3} color="text.secondary">
                    No hay usuarios en esta sección.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              mostrados.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={u.rol} 
                      color={u.rol === "admin" ? "error" : u.rol === "profesional" ? "primary" : "default"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={u.estado} 
                      color={u.estado === "activo" ? "success" : u.estado === "pendiente" ? "warning" : "default"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {u.estado === "pendiente" && (
                      <Button 
                        startIcon={<CheckCircleIcon />} 
                        size="small" 
                        color="success"
                        onClick={() => handleAprobar(u._id)}
                        sx={{ mr: 1 }}
                      >
                        Aprobar
                      </Button>
                    )}
                    <IconButton size="small"><EditIcon /></IconButton>
                    <IconButton size="small"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
