import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
  Badge,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Sidebar() {
  const location = useLocation();
  const { usuario } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (usuario?.rol === "admin") {
      fetchPendingCount();
    }
  }, [usuario]);

  const fetchPendingCount = async () => {
    try {
      const { data } = await api.get("/admin/usuarios");
      const pending = data.filter((u: any) => u.estado === "pendiente").length;
      setPendingCount(pending);
    } catch (error) {
      console.error("Error fetching pending users", error);
    }
  };

  const clientItems = [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/" },
    { text: "Programas", icon: <AssignmentIcon />, to: "/programas" },
    { text: "Biblioteca", icon: <MenuBookIcon />, to: "/biblioteca" },
    { text: "Comunidad", icon: <GroupsIcon />, to: "/comunidad" },
    { text: "Sesiones", icon: <DateRangeIcon />, to: "/sesiones" },
    { text: "Progreso", icon: <BarChartIcon />, to: "/progreso" },
  ];

  const professionalItems = [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/" },
    { text: "Mis Pacientes", icon: <GroupsIcon />, to: "/pacientes" },
    { text: "Agenda", icon: <DateRangeIcon />, to: "/agenda" },
    { text: "Recursos", icon: <MenuBookIcon />, to: "/gestion-recursos" },
  ];

  const adminItems = [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/" },
    { 
      text: "Usuarios", 
      icon: (
        <Badge badgeContent={pendingCount} color="error">
          <SupervisorAccountIcon />
        </Badge>
      ), 
      to: "/admin/usuarios" 
    },
    { text: "Configuración", icon: <SettingsIcon />, to: "/admin/config" },
  ];

  // Items for Admin to manage content (reusing paths but context will differ)
  const adminContentItems = [
    { text: "Gestionar Programas", icon: <AssignmentIcon />, to: "/programas" },
    { text: "Gestionar Biblioteca", icon: <MenuBookIcon />, to: "/biblioteca" },
    { text: "Gestionar Comunidad", icon: <GroupsIcon />, to: "/comunidad" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 220,
          boxSizing: "border-box",
          background: "#fff",
          borderRight: "1px solid #eef2f6",
        },
      }}
    >
      <Toolbar>
        <span style={{ fontWeight: 700, fontSize: 22, color: "#1976d2" }}>MindBalance</span>
      </Toolbar>
      
      {/* CLIENT MENU */}
      {usuario?.rol === "usuario" && (
        <List>
          {clientItems.map(({ text, icon, to }) => (
            <ListItemButton
              component={Link}
              to={to}
              key={text}
              selected={location.pathname === to}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      )}

      {/* PROFESSIONAL MENU */}
      {usuario?.rol === "profesional" && (
        <List>
          {professionalItems.map(({ text, icon, to }) => (
            <ListItemButton
              component={Link}
              to={to}
              key={text}
              selected={location.pathname === to}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      )}

      {/* ADMIN MENU */}
      {usuario?.rol === "admin" && (
        <>
          <List>
            {adminItems.map(({ text, icon, to }) => (
              <ListItemButton
                component={Link}
                to={to}
                key={text}
                selected={location.pathname === to}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
          <Box px={2} py={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={700}>
              GESTIÓN DE CONTENIDO
            </Typography>
          </Box>
          <List>
            {adminContentItems.map(({ text, icon, to }) => (
              <ListItemButton
                component={Link}
                to={to}
                key={text}
                selected={location.pathname === to}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Drawer>
  );
}
