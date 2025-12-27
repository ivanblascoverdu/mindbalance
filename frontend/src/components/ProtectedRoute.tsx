import { Navigate } from "react-router-dom";

// Recibe si el usuario está autenticado (por ahora, hardcodeado en App)
export default function ProtectedRoute({
  authenticated,
  children,
}: {
  authenticated: boolean;
  children: React.ReactNode;
}) {
  if (!authenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
