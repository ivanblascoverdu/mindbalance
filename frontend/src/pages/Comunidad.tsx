import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const posts = [
  {
    usuario: "María G.",
    avatar: "MG",
    tiempo: "Hace 2 horas",
    contenido:
      "Hoy completé mi primera semana de mindfulness y me siento increíble. ¡Gracias por el apoyo!",
    likes: 12,
    comentarios: 3,
    tags: ["Mindfulness", "Progreso"],
  },
  {
    usuario: "Carlos R.",
    avatar: "CR",
    tiempo: "Hace 5 horas",
    contenido:
      "¿Alguien tiene consejos para mejorar la calidad del sueño? Llevo varias noches durmiendo mal.",
    likes: 8,
    comentarios: 7,
    tags: ["Sueño", "Ayuda"],
  },
  {
    usuario: "Ana L.",
    avatar: "AL",
    tiempo: "Hace 1 día",
    contenido:
      "Quiero compartir mi experiencia con la terapia cognitivo-conductual. Ha sido transformadora.",
    likes: 24,
    comentarios: 11,
    tags: ["Terapia", "Experiencia"],
  },
];

export default function Comunidad() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Comunidad
        </Typography>
        <Typography color="text.secondary" mb={3}>
          Comparte tu progreso, conecta con otros usuarios y encuentra apoyo
        </Typography>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="¿Qué quieres compartir con la comunidad?"
              variant="outlined"
            />
            <Button variant="contained" sx={{ mt: 2 }}>
              Publicar
            </Button>
          </CardContent>
        </Card>

        {posts.map((post, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  {post.avatar}
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>{post.usuario}</Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {post.tiempo}
                  </Typography>
                </Box>
              </Box>
              <Typography mb={2}>{post.contenido}</Typography>
              <Box display="flex" gap={1} mb={2}>
                {post.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
              <Box display="flex" gap={2}>
                <Button startIcon={<FavoriteBorderIcon />} size="small">
                  {post.likes} Me gusta
                </Button>
                <Button startIcon={<ChatBubbleOutlineIcon />} size="small">
                  {post.comentarios} Comentarios
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        <Box mt={4}>
          <Typography fontSize={14} color="text.secondary">
            Recuerda: Esta es una comunidad de apoyo. Sé respetuoso y comparte
            experiencias positivas. Para crisis o emergencias, contacta con tu
            profesional de salud mental.
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}
