import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import VideocamIcon from "@mui/icons-material/Videocam";

const resources = [
  {
    title: "Gestión de la ansiedad",
    type: "Artículo · 5 min",
    icon: <ArticleIcon color="primary" />,
  },
  {
    title: "Meditación guiada",
    type: "Audio · 10 min",
    icon: <HeadphonesIcon color="primary" />,
  },
  {
    title: "Higiene del sueño",
    type: "Vídeo · 8 min",
    icon: <VideocamIcon color="primary" />,
  },
];

export default function RecommendedResources() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Recursos recomendados
        </Typography>
        <List>
          {resources.map((r) => (
            <ListItem key={r.title} disablePadding>
              <ListItemIcon>{r.icon}</ListItemIcon>
              <ListItemText primary={r.title} secondary={r.type} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          Explorar biblioteca
        </Button>
      </CardContent>
    </Card>
  );
}
