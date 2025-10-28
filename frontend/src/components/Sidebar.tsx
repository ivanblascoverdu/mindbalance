import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import DateRangeIcon from "@mui/icons-material/DateRange";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, to: "/" },
  { text: "Programas", icon: <AssignmentIcon />, to: "/programas" },
  { text: "Biblioteca", icon: <MenuBookIcon />, to: "/biblioteca" },
  { text: "Comunidad", icon: <GroupsIcon />, to: "/comunidad" },
  { text: "Sesiones", icon: <DateRangeIcon />, to: "/sesiones" },
  { text: "Progreso", icon: <BarChartIcon />, to: "/progreso" },
];

export default function Sidebar() {
  const location = useLocation();
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
        <span style={{ fontWeight: 700, fontSize: 22 }}>MindBalance</span>
      </Toolbar>
      <List>
        {menuItems.map(({ text, icon, to }) => (
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
    </Drawer>
  );
}
