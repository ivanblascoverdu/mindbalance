import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import SpaIcon from "@mui/icons-material/Spa";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTour } from "../context/TourContext";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, usuario } = useAuth();
  const { startTour } = useTour();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate("/login");
  };

  const firstName = usuario?.nombre?.split(" ")[0] || "Usuario";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ minHeight: 68, gap: 1, px: { xs: 2, sm: 3 } }}>
        {/* Hamburger en mobile */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="abrir menú"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 0.5 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logotipo */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3A998A 0%, #5FAE9C 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 6px 16px rgba(58, 153, 138, 0.32)",
              transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
              "&:hover": { transform: "rotate(-6deg) scale(1.04)" },
            }}
          >
            <SpaIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: { xs: 18, sm: 21 },
              color: "text.primary",
              display: { xs: "none", sm: "block" },
            }}
          >
            MindBalance
          </Typography>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        {/* Saludo solo sm+ */}
        <Typography
          variant="body2"
          sx={{
            mr: 1.5,
            fontWeight: 500,
            color: "text.secondary",
            display: { xs: "none", sm: "block" },
          }}
        >
          Hola, <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>{firstName}</Box>
        </Typography>

        {/* Botón ayuda */}
        <Tooltip title="Ayuda · Iniciar tour guiado" arrow>
          <IconButton
            onClick={startTour}
            data-tour="topbar-help"
            aria-label="iniciar tour"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>

        {/* Avatar */}
        <Tooltip title="Tu cuenta" arrow>
          <IconButton
            onClick={handleOpenMenu}
            data-tour="topbar-avatar"
            aria-label="abrir menú de cuenta"
            sx={{
              p: 0.4,
              ml: 0.5,
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            <Avatar
              src={undefined}
              alt={usuario?.nombre}
              sx={{
                width: 38,
                height: 38,
                background: "linear-gradient(135deg, #3A998A 0%, #2A8478 100%)",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {initial}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.2,
              minWidth: 220,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 18px 50px rgba(31, 58, 64, 0.14)",
              overflow: "hidden",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography fontWeight={600} fontSize={14} noWrap>
              {usuario?.nombre || "Usuario"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {usuario?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { handleCloseMenu(); navigate("/perfil"); }}>
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            Perfil
          </MenuItem>
          <MenuItem onClick={() => { handleCloseMenu(); navigate("/configuracion"); }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Configuración
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
