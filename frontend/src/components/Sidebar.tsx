import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Badge,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";

const DRAWER_WIDTH = 220;

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const { usuario } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
    { text: "Dashboard", icon: <DashboardIcon />, to: "/", tour: "dashboard" },
    { text: "Programas", icon: <AssignmentIcon />, to: "/programas", tour: "programas" },
    { text: "Biblioteca", icon: <MenuBookIcon />, to: "/biblioteca", tour: "biblioteca" },
    { text: "Comunidad", icon: <GroupsIcon />, to: "/comunidad", tour: "comunidad" },
    { text: "Sesiones", icon: <DateRangeIcon />, to: "/sesiones", tour: "sesiones" },
    { text: "Progreso", icon: <BarChartIcon />, to: "/progreso", tour: "progreso" },
    { text: "Suscripciones", icon: <StarIcon />, to: "/suscripciones", tour: "suscripciones" },
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

  const adminContentItems = [
    { text: "Gestionar Programas", icon: <AssignmentIcon />, to: "/programas" },
    { text: "Gestionar Biblioteca", icon: <MenuBookIcon />, to: "/biblioteca" },
    { text: "Gestionar Comunidad", icon: <GroupsIcon />, to: "/comunidad" },
  ];

  const handleItemClick = () => {
    if (isMobile) {
      onMobileClose();
    }
  };

  const renderMenuItems = (items: { text: string; icon: React.ReactNode; to: string; tour?: string }[]) => (
    <List sx={{ px: 0.5, py: 0.5 }}>
      {items.map(({ text, icon, to, tour }) => {
        const selected = location.pathname === to;
        return (
          <ListItemButton
            component={Link}
            to={to}
            key={text}
            selected={selected}
            onClick={handleItemClick}
            data-tour={tour ? `sidebar-${tour}` : undefined}
            sx={{
              position: "relative",
              // Indicador lateral animado para el seleccionado
              "&.Mui-selected::before": {
                content: '""',
                position: "absolute",
                left: -10,
                top: "20%",
                bottom: "20%",
                width: 4,
                borderRadius: 4,
                background: "linear-gradient(180deg, #5FAE9C 0%, #3A998A 100%)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: selected ? "primary.dark" : "text.secondary",
                transition: "color 0.28s ease",
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontWeight: selected ? 600 : 500,
                fontSize: 14.5,
              }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ flex: 1, overflowY: "auto", pt: 1.5 }}>
        {/* CLIENT MENU */}
        {usuario?.rol === "usuario" && renderMenuItems(clientItems)}

        {/* PROFESSIONAL MENU */}
        {usuario?.rol === "profesional" && renderMenuItems(professionalItems)}

        {/* ADMIN MENU */}
        {usuario?.rol === "admin" && (
          <>
            {renderMenuItems(adminItems)}
            <Divider sx={{ my: 1.5, mx: 2 }} />
            <Box px={2.5} py={0.5}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontSize: 10.5, letterSpacing: "0.14em" }}
              >
                Gestión de contenido
              </Typography>
            </Box>
            {renderMenuItems(adminContentItems)}
          </>
        )}
      </Box>

      {/* Tarjeta inspiradora en el footer del sidebar */}
      <Box sx={{ px: 1.5, pb: 2 }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, rgba(58,153,138,0.10) 0%, rgba(194,154,91,0.10) 100%)",
            border: "1px solid rgba(58,153,138,0.18)",
            borderRadius: 3,
            p: 1.75,
          }}
        >
          <Typography variant="caption" sx={{ color: "primary.dark", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Frase del día
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: "text.primary", lineHeight: 1.45, fontSize: 13 }}>
            “La paz viene de dentro. No la busques fuera.”
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            — Buda
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  // Mobile drawer (temporary)
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            background: "#fff",
            borderRight: "1px solid #eef2f6",
            top: 64,
            height: "calc(100% - 64px)",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop drawer (permanent)
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          background: "#fff",
          borderRight: "1px solid #eef2f6",
          top: 64,
          height: "calc(100% - 64px)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
