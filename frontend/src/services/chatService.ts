import api from "./api";

export const sendMessageToAI = async (message: string, history: any[]) => {
  const response = await api.post("/chat", { message, history });
  return response.data;
};
