import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Joyride, { STATUS } from "react-joyride";
import type { CallBackProps, Step } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const TOUR_STORAGE_KEY = "mb_tour_completed_v1";

const steps: Step[] = [
  {
    target: "body",
    placement: "center",
    title: "👋 ¡Bienvenido a MindBalance!",
    content:
      "Te haré un recorrido rápido por las secciones principales. Puedes cerrar este tour en cualquier momento y volver a abrirlo desde el icono de ayuda (?) en la barra superior.",
    disableBeacon: true,
  },
  {
    target: '[data-tour="sidebar-dashboard"]',
    title: "🏠 Dashboard",
    content:
      "Tu punto de partida. Aquí ves tu saludo del día, tu próxima cita, recursos recomendados y un resumen de tu progreso semanal.",
  },
  {
    target: '[data-tour="sidebar-programas"]',
    title: "📋 Programas terapéuticos",
    content:
      "Intervenciones estructuradas basadas en TCC y mindfulness. Cada programa tiene sesiones progresivas con vídeos, ejercicios y puntos por completarlas.",
  },
  {
    target: '[data-tour="sidebar-biblioteca"]',
    title: "📚 Biblioteca psicoeducativa",
    content:
      "Recursos validados por profesionales: artículos, audios y vídeos sobre salud mental que puedes filtrar por tema.",
  },
  {
    target: '[data-tour="sidebar-comunidad"]',
    title: "👥 Comunidad",
    content:
      "Comparte tu progreso, comenta publicaciones de otros usuarios y únete a grupos de apoyo. Un espacio respetuoso y moderado.",
  },
  {
    target: '[data-tour="sidebar-sesiones"]',
    title: "📞 Teleconsultas",
    content:
      "Reserva videollamadas con psicólogos certificados, gestiona tus citas y reprograma cuando lo necesites.",
  },
  {
    target: '[data-tour="sidebar-progreso"]',
    title: "📊 Tu progreso",
    content:
      "Crea metas personales, sigue tu racha, gana XP y sube de nivel completando programas y hábitos diarios.",
  },
  {
    target: '[data-tour="sidebar-suscripciones"]',
    title: "⭐ Suscripciones",
    content:
      "Accede a contenido premium: programas avanzados, audios exclusivos y más sesiones con profesionales.",
  },
  {
    target: '[data-tour="topbar-avatar"]',
    title: "👤 Tu cuenta",
    content:
      "Edita tu perfil, ajusta preferencias o cierra sesión desde aquí.",
  },
  {
    target: '[data-tour="topbar-help"]',
    title: "❓ Ayuda en cualquier momento",
    content:
      "Si vuelves a necesitar este tour, pulsa este botón. ¡Disfruta de tu camino hacia el bienestar! 🌿",
  },
];

interface TourContextValue {
  startTour: () => void;
  isRunning: boolean;
}

const TourContext = createContext<TourContextValue>({
  startTour: () => {},
  isRunning: false,
});

export const useTour = () => useContext(TourContext);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [run, setRun] = useState(false);
  const { isAuthenticated, usuario, loading } = useAuth();
  const navigate = useNavigate();

  const startTour = useCallback(() => {
    navigate("/");
    setTimeout(() => setRun(true), 300);
  }, [navigate]);

  useEffect(() => {
    if (loading || !isAuthenticated || !usuario) return;
    const done = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!done && usuario.rol === "usuario") {
      navigate("/");
      setTimeout(() => setRun(true), 800);
    }
  }, [isAuthenticated, usuario, loading, navigate]);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    const finished: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finished.includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    }
  };

  return (
    <TourContext.Provider value={{ startTour, isRunning: run }}>
      {children}
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        scrollToFirstStep
        disableScrolling={false}
        callback={handleCallback}
        locale={{
          back: "Atrás",
          close: "Cerrar",
          last: "Finalizar",
          next: "Siguiente",
          nextLabelWithProgress: "Siguiente ({step}/{steps})",
          skip: "Saltar tour",
        }}
        styles={{
          options: {
            primaryColor: "#2A9D8F",
            textColor: "#1f2937",
            zIndex: 10000,
            arrowColor: "#fff",
            backgroundColor: "#fff",
          },
          tooltipContainer: {
            textAlign: "left",
          },
          buttonNext: {
            backgroundColor: "#2A9D8F",
            borderRadius: 24,
            padding: "8px 18px",
            fontWeight: 600,
          },
          buttonBack: {
            color: "#6b7280",
            marginRight: 8,
          },
          buttonSkip: {
            color: "#6b7280",
          },
        }}
      />
    </TourContext.Provider>
  );
}
