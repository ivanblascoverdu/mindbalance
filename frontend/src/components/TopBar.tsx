import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{ 
        borderBottom: "1px solid rgba(0,0,0,0.05)", 
        bgcolor: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: "100%"
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: "primary.main", letterSpacing: "-0.5px", fontSize: 24 }}>
          MindBalance
        </Typography>
        <Box flexGrow={1}></Box>
        <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
          Hola, {usuario?.nombre || "Usuario"}
        </Typography>
        <IconButton size="large" onClick={handleOpenMenu} sx={{ mr: 1 }}>
          <Avatar src="/assets/avatar.svg" alt={usuario?.nombre} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => { handleCloseMenu(); navigate("/configuracion"); }}>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} /> Configuración
          </MenuItem>
          <MenuItem onClick={() => { handleCloseMenu(); navigate("/perfil"); }}>Perfil</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
