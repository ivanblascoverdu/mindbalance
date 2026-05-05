import {
  CssBaseline,
  ThemeProvider,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import { AnimatePresence } from "framer-motion";
import theme from "./theme/theme";
import Chatbot from "./components/Chatbot";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalSnackbar from "./components/GlobalSnackbar";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Lazy-load de páginas para mejorar el tiempo de carga inicial
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Programas = lazy(() => import("./pages/Programas"));
const Biblioteca = lazy(() => import("./pages/Biblioteca"));
const Comunidad = lazy(() => import("./pages/Comunidad"));
const Sesiones = lazy(() => import("./pages/Sesiones"));
const Progreso = lazy(() => import("./pages/Progreso"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Pacientes = lazy(() => import("./pages/profesional/Pacientes"));
const Agenda = lazy(() => import("./pages/profesional/Agenda"));
const Usuarios = lazy(() => import("./pages/admin/Usuarios"));
const Configuracion = lazy(() => import("./pages/Configuracion"));
const ProgramaDetalle = lazy(() => import("./pages/ProgramaDetalle"));
const Suscripciones = lazy(() => import("./pages/Suscripciones"));
const Perfil = lazy(() => import("./pages/Perfil"));

const DRAWER_WIDTH = 220;

function FullscreenLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        width: "100%",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function AnimatedRoutes({ isAuthenticated }: { isAuthenticated: boolean }) {
  const location = useLocation();

  const wrap = (el: React.ReactNode) => <PageTransition>{el}</PageTransition>;
  const guard = (el: React.ReactNode) => (
    <ProtectedRoute authenticated={isAuthenticated}>{wrap(el)}</ProtectedRoute>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : wrap(<Login />)}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : wrap(<Register />)}
        />

        <Route path="/" element={guard(<Dashboard />)} />
        <Route path="/programas" element={guard(<Programas />)} />
        <Route path="/programas/:id" element={guard(<ProgramaDetalle />)} />
        <Route path="/biblioteca" element={guard(<Biblioteca />)} />
        <Route path="/comunidad" element={guard(<Comunidad />)} />
        <Route path="/sesiones" element={guard(<Sesiones />)} />
        <Route path="/progreso" element={guard(<Progreso />)} />
        <Route path="/pacientes" element={guard(<Pacientes />)} />
        <Route path="/agenda" element={guard(<Agenda />)} />
        <Route path="/admin/usuarios" element={guard(<Usuarios />)} />
        <Route path="/admin/config" element={guard(<Configuracion />)} />
        <Route path="/configuracion" element={guard(<Configuracion />)} />
        <Route path="/suscripciones" element={guard(<Suscripciones />)} />
        <Route path="/perfil" element={guard(<Perfil />)} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Login/Register tienen layout fullscreen propio
  const hideNav =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <CssBaseline />
      {!hideNav && <TopBar onMenuClick={() => setMobileOpen((s) => !s)} />}
      <Box sx={{ display: "flex" }}>
        {!hideNav && (
          <Sidebar
            mobileOpen={mobileOpen}
            onMobileClose={() => setMobileOpen(false)}
          />
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: hideNav ? 0 : { xs: 2, sm: 3, md: 4 },
            minHeight: "100vh",
            width: "100%",
            maxWidth: "100%",
            ml: !hideNav && !isMobile ? `${DRAWER_WIDTH}px` : 0,
            transition: muiTheme.transitions.create("margin-left", {
              duration: muiTheme.transitions.duration.standard,
              easing: muiTheme.transitions.easing.easeInOut,
            }),
            boxSizing: "border-box",
          }}
        >
          {!hideNav && <Box sx={{ height: 64 }} />}
          <ErrorBoundary>
            <Suspense fallback={<FullscreenLoader />}>
              <AnimatedRoutes isAuthenticated={isAuthenticated} />
            </Suspense>
          </ErrorBoundary>
        </Box>
        {!hideNav && <Chatbot />}
      </Box>
      <GlobalSnackbar />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
