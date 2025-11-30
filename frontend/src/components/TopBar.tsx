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
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid #e5eeff", bgcolor: "#fff" }}
    >
      <Toolbar sx={{ justifyContent: "flex-end", minHeight: 64 }}>
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
          <MenuItem onClick={handleCloseMenu}>Perfil</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
