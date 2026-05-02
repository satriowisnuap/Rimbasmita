"use client";

import { useEffect, useState } from "react";
import { ToastConfig, VARIANT_STYLES } from "@/lib/toast";

interface ToastProps extends ToastConfig {
  onClose: () => void;
  duration?: number;
}

export function Toast({
  title,
  message,
  variant,
  actions,
  onClose,
  duration = 5000,
}: ToastProps) {
  const [visible, setVisible] = useState(false);
  const s = VARIANT_STYLES[variant];

  useEffect(() => {
    // mount animation
    const t1 = setTimeout(() => setVisible(true), 10);
    // auto-close
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, onClose]);

  return (
    <>
      {/* 🔥 Overlay (biar fokus ke popup) */}
      <div
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 250);
        }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />

      {/* 🔥 Toast Card */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: visible
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -60%) scale(0.96)",
          zIndex: 9999,
          maxWidth: 420,
          width: "90%",
          background: s.wrapper,
          border: `1px solid ${s.border}`,
          borderRadius: 16,
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.15), 0 6px 16px rgba(0,0,0,0.10)",
          opacity: visible ? 1 : 0,
          transition: "all 0.25s cubic-bezier(0.34,1.26,0.64,1)",
          overflow: "hidden",
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            height: 4,
            background: s.border,
          }}
        />

        <div style={{ padding: "18px 18px 10px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 10,
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: s.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: s.titleColor,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  color: s.messageColor,
                  fontSize: 13,
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {message}
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 250);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                opacity: 0.6,
              }}
            >
              ✕
            </button>
          </div>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div style={{ display: "flex", gap: 8, paddingBottom: 14 }}>
              {actions.map((a, i) => (
                <button
                  key={i}
                  onClick={a.onClick}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: a.ghost ? `1px solid ${s.border}` : "none",
                    background: a.ghost ? "transparent" : s.titleColor,
                    color: a.ghost ? s.titleColor : "#fff",
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
