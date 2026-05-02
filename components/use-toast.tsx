"use client";

import { useState } from "react";
import { ToastConfig } from "@/lib/toast";

export function useToast() {
  const [toast, setToast] = useState<ToastConfig | null>(null);

  const showToast = (config: ToastConfig) => {
    setToast(config);
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast,
  };
}
