"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

interface Props {
  open: boolean;
  type?: AlertType;
  title?: string;
  message: string;
}

const styles = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    border: "border-green-500/30",
    bg: "bg-green-500/10",
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    border: "border-red-500/30",
    bg: "bg-red-500/10",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
};

export function AlertModal({ open, type = "info", title, message }: Props) {
  const style = styles[type];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="
    fixed inset-x-0 top-6 z-[9999]
    flex justify-center
    pointer-events-none
  "
        >
          <div
            className={`
      ${style.bg} ${style.border}
      backdrop-blur-xl border
      shadow-lg rounded-2xl px-4 py-3
      flex items-start gap-3
      text-left
      w-[92%] max-w-md
      pointer-events-auto
    `}
          >
            <div className="mt-0.5">{style.icon}</div>

            <div className="flex-1">
              {title && (
                <p className="text-sm font-semibold leading-tight">{title}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
