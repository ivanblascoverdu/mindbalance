import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Fab, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  CircularProgress
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { sendMessageToAI } from '../services/chatService';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ role: string, parts: { text: string }[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const toggleChat = () => setOpen(!open);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, open]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", parts: [{ text: message }] };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setMessage('');
    setLoading(true);

    try {
      const response = await sendMessageToAI(message, history);
      
      const modelMessage = { role: "model", parts: [{ text: response.reply }] };
      setHistory([...newHistory, modelMessage]);
    } catch (error: any) {
      console.error("Error sending message", error);
      const errorText = error.response?.data?.message || error.response?.data?.mensaje || "Lo siento, hubo un error al conectar con el asistente. Asegúrate de haber iniciado sesión.";
      const errorMessage = { role: "model", parts: [{ text: errorText }] };
      setHistory([...newHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="chat" 
        onClick={toggleChat}
        sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {open && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'fixed', 
            bottom: 80, 
            right: 20, 
            width: 350, 
            height: 500, 
            display: 'flex', 
            flexDirection: 'column', 
            zIndex: 1000,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Asistente MindBalance</Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {history.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                ¡Hola! Soy tu asistente virtual. Pregúntame lo que quieras sobre la app o bienestar.
              </Typography>
            )}
            {history.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: msg.role === 'user' ? 'primary.light' : 'grey.100',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                  p: 1.5, 
                  borderRadius: 2,
                  maxWidth: '80%'
                }}
              >
                <Typography variant="body2">{msg.parts[0].text}</Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ alignSelf: 'flex-start', p: 1 }}>
                <CircularProgress size={20} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <IconButton color="primary" onClick={handleSend} disabled={loading || !message.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Chatbot;
