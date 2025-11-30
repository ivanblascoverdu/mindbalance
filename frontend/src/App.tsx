import { CssBaseline, ThemeProvider, CircularProgress, Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import theme from "./theme/theme";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Programas from "./pages/Programas";
import Biblioteca from "./pages/Biblioteca";
import Comunidad from "./pages/Comunidad";
import Sesiones from "./pages/Sesiones";
import Progreso from "./pages/Progreso";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pacientes from "./pages/profesional/Pacientes";
import Agenda from "./pages/profesional/Agenda";
import Usuarios from "./pages/admin/Usuarios";
import Configuracion from "./pages/Configuracion";
import ProgramaDetalle from "./pages/ProgramaDetalle";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

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

  // Oculta Sidebar y TopBar en Login/Register para UI más limpia
  const hideNav =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!hideNav && <TopBar />}
      <div style={{ display: "flex" }}>
        {!hideNav && <Sidebar />}
        <main
          style={{
            flexGrow: 1,
            padding: "2rem",
            minHeight: "100vh",
            background: "#f7fafd",
          }}
        >
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Register />
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programas"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Programas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programas/:id"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <ProgramaDetalle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/biblioteca"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Biblioteca />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comunidad"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Comunidad />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sesiones"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Sesiones />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progreso"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Progreso />
                </ProtectedRoute>
              }
            />
            {/* Rutas Profesional */}
            <Route
              path="/pacientes"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Pacientes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agenda"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Agenda />
                </ProtectedRoute>
              }
            />
            {/* Rutas Admin */}
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Usuarios />
                </ProtectedRoute>
              }
            />
            {/* Configuración (Común) */}
            <Route
              path="/admin/config"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Configuracion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute authenticated={isAuthenticated}>
                  <Configuracion />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
