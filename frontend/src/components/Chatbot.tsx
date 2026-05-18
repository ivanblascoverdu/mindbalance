import { useState, useRef, useEffect, type ReactNode } from "react";
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Chip,
  Slide,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SpaIcon from "@mui/icons-material/Spa";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  sendMessageToAI,
  fetchChatSuggestions,
  type ChatTurn,
} from "../services/chatService";

// Render muy ligero: convierte **texto** en <strong>, *texto* en <em>,
// y respeta los saltos de línea sin meter una librería entera.
function renderRich(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts: ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith("**")) {
        parts.push(
          <strong key={`s${i}-${key++}`}>{token.slice(2, -2)}</strong>
        );
      } else {
        parts.push(<em key={`e${i}-${key++}`}>{token.slice(1, -1)}</em>);
      }
      lastIndex = match.index + token.length;
    }
    if (lastIndex < line.length) parts.push(line.slice(lastIndex));
    return (
      <span key={i} style={{ display: "block" }}>
        {parts.length > 0 ? parts : line || " "}
      </span>
    );
  });
}

interface Turn extends ChatTurn {
  followUps?: string[];
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && suggestions.length === 0 && history.length === 0) {
      fetchChatSuggestions().then(setSuggestions);
    }
  }, [open, suggestions.length, history.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history, loading, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userTurn: Turn = { role: "user", parts: [{ text: trimmed }] };
    const next = [...history, userTurn];
    setHistory(next);
    setMessage("");
    setLoading(true);

    try {
      const res = await sendMessageToAI(
        trimmed,
        history.map(({ role, parts }) => ({ role, parts }))
      );
      const modelTurn: Turn = {
        role: "model",
        parts: [{ text: res.reply }],
      };
      if (res.followUps) modelTurn.followUps = res.followUps;
      setHistory([...next, modelTurn]);
    } catch (err: any) {
      // Aunque el backend siempre devuelva 200 con fallback, por si acaso:
      const fallback =
        err?.response?.data?.message ||
        "Estoy teniendo problemas para responder ahora mismo. Mientras tanto, puedes explorar el menú lateral o pulsar el icono ❓ para hacer el tour guiado.";
      setHistory([
        ...next,
        { role: "model", parts: [{ text: fallback }] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(message);
    }
  };

  const resetConversation = () => {
    setHistory([]);
    setMessage("");
    fetchChatSuggestions().then(setSuggestions);
  };

  const lastTurn = history[history.length - 1];
  const showFollowUps =
    lastTurn?.role === "model" && lastTurn.followUps && lastTurn.followUps.length > 0;

  return (
    <>
      <Tooltip title={open ? "Cerrar asistente" : "Habla con el asistente"} placement="left" arrow>
        <Fab
          aria-label="asistente"
          onClick={() => setOpen((s) => !s)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1100,
            background: open
              ? "linear-gradient(135deg, #3F5D63 0%, #1F3A40 100%)"
              : "linear-gradient(135deg, #3A998A 0%, #2A8478 100%)",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(58,153,138,0.40)",
            transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
            "&:hover": {
              transform: "translateY(-2px) scale(1.03)",
              background: open
                ? "linear-gradient(135deg, #3F5D63 0%, #1F3A40 100%)"
                : "linear-gradient(135deg, #3A998A 0%, #1F6A60 100%)",
            },
          }}
        >
          {open ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
        </Fab>
      </Tooltip>

      <Slide direction="up" in={open} mountOnEnter unmountOnExit timeout={320}>
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            bottom: { xs: 0, sm: 88 },
            right: { xs: 0, sm: 20 },
            left: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: 380 },
            height: { xs: "calc(100vh - 64px)", sm: 560 },
            display: "flex",
            flexDirection: "column",
            zIndex: 1099,
            borderRadius: { xs: 0, sm: 4 },
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 30px 80px rgba(31, 58, 64, 0.20)",
            background: "#fff",
          }}
        >
          {/* Header con gradiente */}
          <Box
            sx={{
              p: 2,
              background:
                "linear-gradient(135deg, #3A998A 0%, #2A8478 60%, #1F6A60 100%)",
              color: "#fff",
              position: "relative",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  width: 38,
                  height: 38,
                  boxShadow: "none",
                }}
              >
                <SpaIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={700} sx={{ letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                  Asistente MindBalance
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.7} sx={{ mt: 0.3 }}>
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: "#A7E8B8",
                      boxShadow: "0 0 0 3px rgba(167, 232, 184, 0.3)",
                    }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: 11.5 }}>
                    Aquí para ayudarte
                  </Typography>
                </Stack>
              </Box>
              {history.length > 0 && (
                <Tooltip title="Reiniciar conversación" arrow>
                  <IconButton
                    size="small"
                    onClick={resetConversation}
                    sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.18)" } }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton
                size="small"
                onClick={() => setOpen(false)}
                sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.18)" } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Mensajes */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
              background:
                "linear-gradient(180deg, #F7FBF9 0%, #ffffff 100%)",
            }}
          >
            {history.length === 0 && (
              <Box
                sx={{
                  mt: 1.5,
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(58, 153, 138, 0.06)",
                  border: "1px solid rgba(58, 153, 138, 0.15)",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.55 }}>
                  ¡Hola! 👋 Soy tu asistente. Puedo ayudarte a moverte por la
                  plataforma, recomendarte programas o darte consejos rápidos
                  de bienestar.
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  Prueba alguna de estas preguntas:
                </Typography>
                <Stack direction="row" sx={{ mt: 1, flexWrap: "wrap", gap: 0.7 }}>
                  {suggestions.map((q) => (
                    <Chip
                      key={q}
                      label={q}
                      size="small"
                      onClick={() => send(q)}
                      sx={{
                        bgcolor: "#fff",
                        border: "1px solid",
                        borderColor: "rgba(58,153,138,0.25)",
                        color: "primary.dark",
                        fontWeight: 500,
                        "&:hover": {
                          bgcolor: "rgba(58,153,138,0.08)",
                          borderColor: "primary.main",
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {history.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "86%",
                }}
              >
                <Box
                  sx={{
                    px: 1.6,
                    py: 1.2,
                    borderRadius: 3,
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: msg.role === "user" ? "#fff" : "text.primary",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #3A998A 0%, #2A8478 100%)"
                        : "rgba(31, 58, 64, 0.05)",
                    boxShadow:
                      msg.role === "user"
                        ? "0 8px 20px rgba(58,153,138,0.25)"
                        : "none",
                    borderTopRightRadius: msg.role === "user" ? 4 : undefined,
                    borderTopLeftRadius: msg.role !== "user" ? 4 : undefined,
                    wordBreak: "break-word",
                  }}
                >
                  {renderRich(msg.parts[0]?.text || "")}
                </Box>
                {msg.role === "model" &&
                  msg.followUps &&
                  msg.followUps.length > 0 &&
                  i === history.length - 1 && (
                    <Stack
                      direction="row"
                      sx={{ mt: 0.8, flexWrap: "wrap", gap: 0.6 }}
                    >
                      {msg.followUps.map((f) => (
                        <Chip
                          key={f}
                          label={f}
                          size="small"
                          onClick={() => send(f)}
                          sx={{
                            bgcolor: "#fff",
                            border: "1px solid",
                            borderColor: "rgba(58,153,138,0.25)",
                            color: "primary.dark",
                            fontWeight: 500,
                            "&:hover": {
                              bgcolor: "rgba(58,153,138,0.08)",
                              borderColor: "primary.main",
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  )}
              </Box>
            ))}

            {loading && (
              <Box sx={{ alignSelf: "flex-start", display: "flex", gap: 0.5, p: 1 }}>
                <CircularProgress size={14} sx={{ color: "primary.main" }} />
                <Typography variant="caption" color="text.secondary">
                  Escribiendo…
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
            {/* Espaciador para que el área de input no tape el último mensaje */}
            {showFollowUps && <Box sx={{ height: 4 }} />}
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              gap: 1,
              alignItems: "flex-end",
              bgcolor: "#fff",
            }}
          >
            <TextField
              fullWidth
              size="small"
              multiline
              maxRows={4}
              placeholder="Escribe un mensaje…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 6,
                  bgcolor: "background.default",
                },
              }}
            />
            <IconButton
              onClick={() => send(message)}
              disabled={loading || !message.trim()}
              sx={{
                background: "linear-gradient(135deg, #3A998A 0%, #2A8478 100%)",
                color: "#fff",
                width: 40,
                height: 40,
                "&:hover": {
                  background: "linear-gradient(135deg, #3A998A 0%, #1F6A60 100%)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "rgba(31, 58, 64, 0.12)",
                  color: "rgba(255,255,255,0.7)",
                },
              }}
              aria-label="enviar"
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
}
