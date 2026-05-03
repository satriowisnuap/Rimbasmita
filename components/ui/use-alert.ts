import { useState, useCallback, useEffect } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertOptions {
  type?: AlertType;
  title?: string;
  message: string;
}

export function useAlert() {
  const [state, setState] = useState<(AlertOptions & { open: boolean }) | null>(
    null,
  );

  const showAlert = useCallback((opts: AlertOptions) => {
    setState({ ...opts, open: true });

    // 🔥 simpan ke session (biar tidak hilang saat redirect)
    sessionStorage.setItem("global-alert", JSON.stringify(opts));
  }, []);

  const closeAlert = useCallback(() => {
    setState(null);
    sessionStorage.removeItem("global-alert");
  }, []);

  // 🔥 restore saat page load
  useEffect(() => {
    const saved = sessionStorage.getItem("global-alert");
    if (saved) {
      setState({ ...JSON.parse(saved), open: true });

      // auto clear setelah tampil
      setTimeout(() => {
        sessionStorage.removeItem("global-alert");
        setState(null);
      }, 3000);
    }
  }, []);

  return { state, showAlert, closeAlert };
}
