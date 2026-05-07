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
    sessionStorage.setItem("global-alert", JSON.stringify(opts));
    
    // Dispatch event so other instances of the hook can update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('global-alert-update', { detail: opts }));
    }
  }, []);

  const closeAlert = useCallback(() => {
    setState(null);
    sessionStorage.removeItem("global-alert");
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("global-alert");
    if (saved) {
      setState({ ...JSON.parse(saved), open: true });

      setTimeout(() => {
        sessionStorage.removeItem("global-alert");
        setState(null);
      }, 3000);
    }

    // Listen for events from other hook instances
    const handleAlertUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AlertOptions>;
      setState({ ...customEvent.detail, open: true });
      
      setTimeout(() => {
        sessionStorage.removeItem("global-alert");
        setState(null);
      }, 3000);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('global-alert-update', handleAlertUpdate);
      return () => {
        window.removeEventListener('global-alert-update', handleAlertUpdate);
      };
    }
  }, []);

  return { state, showAlert, closeAlert };
}
