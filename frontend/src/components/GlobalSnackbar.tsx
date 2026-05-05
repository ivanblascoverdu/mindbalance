import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material";

interface SnackbarPayload {
  message: string;
  severity?: AlertColor;
}

export default function GlobalSnackbar() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<SnackbarPayload | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<SnackbarPayload>).detail;
      if (!detail?.message) return;
      setPayload(detail);
      setOpen(true);
    };
    window.addEventListener("api:error", handler);
    window.addEventListener("app:notify", handler);
    return () => {
      window.removeEventListener("api:error", handler);
      window.removeEventListener("app:notify", handler);
    };
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={payload?.severity || "info"}
        variant="filled"
        sx={{ minWidth: 280, borderRadius: 2 }}
      >
        {payload?.message}
      </Alert>
    </Snackbar>
  );
}
