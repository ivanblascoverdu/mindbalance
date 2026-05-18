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
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface Recurso {
  _id: string;
  titulo: string;
  tipo: string;
  categoria?: string;
}

const iconFor = (tipo: string) => {
  if (tipo === "audio") return <HeadphonesIcon color="primary" />;
  if (tipo === "video") return <VideocamIcon color="primary" />;
  return <ArticleIcon color="primary" />;
};

const labelFor = (tipo: string) => {
  if (tipo === "audio") return "Audio";
  if (tipo === "video") return "Vídeo";
  return "Artículo";
};

export default function RecommendedResources() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);

  useEffect(() => {
    api
      .get("/recursos")
      .then(({ data }) => {
        const items: Recurso[] = Array.isArray(data) ? data : [];
        setRecursos(items.slice(0, 3));
      })
      .catch((err) => console.error("Error cargando recursos:", err));
  }, []);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Recursos recomendados
        </Typography>
        {recursos.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            Aún no hay recursos disponibles.
          </Typography>
        ) : (
          <List>
            {recursos.map((r) => (
              <ListItem key={r._id} disablePadding>
                <ListItemIcon>{iconFor(r.tipo)}</ListItemIcon>
                <ListItemText
                  primary={r.titulo}
                  secondary={`${labelFor(r.tipo)}${r.categoria ? ` · ${r.categoria}` : ""}`}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          component={Link}
          to="/biblioteca"
        >
          Explorar biblioteca
        </Button>
      </CardContent>
    </Card>
  );
}
