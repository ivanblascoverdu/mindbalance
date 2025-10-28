import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";

export default function TopBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
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
        <IconButton size="large" onClick={handleOpenMenu} sx={{ mr: 1 }}>
          <Avatar src="/assets/avatar.svg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem>
            <SettingsIcon fontSize="small" sx={{ mr: 1 }} /> Configuración
          </MenuItem>
          <MenuItem>Perfil</MenuItem>
          <MenuItem sx={{ color: "red" }}>Cerrar sesión</MenuItem>
        </Menu>
        <Button variant="contained" color="primary" sx={{ ml: 2 }}>
          Comenzar gratis
        </Button>
      </Toolbar>
    </AppBar>
  );
}
