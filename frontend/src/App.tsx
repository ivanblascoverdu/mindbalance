import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import theme from "./theme/theme";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Programas from "./pages/Programas";
import Biblioteca from "./pages/Biblioteca";
import Comunidad from "./pages/Comunidad";
import Sesiones from "./pages/Sesiones";
import Progreso from "./pages/Progreso";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AppWrapper() {
  const [authenticated, setAuthenticated] = useState(true);
  const location = useLocation();

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
                authenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login setAuthenticated={setAuthenticated} />
                )
              }
            />
            <Route
              path="/register"
              element={
                authenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Register setAuthenticated={setAuthenticated} />
                )
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/programas"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <Programas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/biblioteca"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <Biblioteca />
                </ProtectedRoute>
              }
            />
            <Route
              path="/comunidad"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <Comunidad />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sesiones"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <Sesiones />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progreso"
              element={
                <ProtectedRoute authenticated={authenticated}>
                  <Progreso />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

// App ahora envuelve todo en Router. Así puedes usar useLocation ;)
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
