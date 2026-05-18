import api from "./api";

export interface ChatTurn {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface ChatResponse {
  reply: string;
  followUps?: string[];
  source?: "ai" | "fallback";
}

export const sendMessageToAI = async (
  message: string,
  history: ChatTurn[]
): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/chat", { message, history });
  return response.data;
};

export const fetchChatSuggestions = async (): Promise<string[]> => {
  try {
    const res = await api.get<{ suggestions: string[] }>("/chat/suggestions");
    return res.data.suggestions || [];
  } catch {
    return [
      "¿Cómo agendo una cita?",
      "¿Qué programas hay?",
      "Me siento con ansiedad",
      "¿Cómo funciona el progreso?",
    ];
  }
};
