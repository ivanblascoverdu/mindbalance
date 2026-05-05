import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary capturó:", error, info);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ maxWidth: 480, textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "rgba(231,111,81,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "secondary.main",
            }}
          >
            <SentimentDissatisfiedIcon sx={{ fontSize: 44 }} />
          </Box>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              Algo no ha ido bien
            </Typography>
            <Typography color="text.secondary">
              Hemos tenido un problema mostrando esta página. Puedes recargar o
              volver al inicio para continuar.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReload}
            >
              Recargar
            </Button>
            <Button variant="outlined" onClick={this.handleGoHome}>
              Ir al inicio
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }
}
