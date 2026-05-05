import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token inválido o expirado: limpiar y redirigir al login
    if (status === 401) {
      const path = window.location.pathname;
      const isAuthRoute = path === "/login" || path === "/register";
      if (!isAuthRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        // Forzar recarga limpia hacia login preservando from
        window.location.href = "/login";
      }
    }

    // Eventos globales para que el SnackbarProvider pueda mostrar avisos
    if (status >= 500) {
      window.dispatchEvent(
        new CustomEvent("api:error", {
          detail: {
            message: "El servidor no responde. Inténtalo de nuevo en unos segundos.",
            severity: "error",
          },
        })
      );
    } else if (status === 0 || error.code === "ECONNABORTED" || !error.response) {
      window.dispatchEvent(
        new CustomEvent("api:error", {
          detail: {
            message: "Sin conexión con el servidor. Comprueba tu red.",
            severity: "warning",
          },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api;
