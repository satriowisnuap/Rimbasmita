"use client";

import { useRegister } from "@/hooks/auth/use-register";
import { RegisterBackground } from "./register-background";
import { RegisterCard } from "./register-card";

// 🔥 tambah ini
import { Toast } from "@/components/toast";
import { useToast } from "@/components/use-toast";

export function RegisterPage() {
  // 🔥 ambil toast state + showToast
  const { toast, showToast, hideToast } = useToast();

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleRegister,
    handleGoogleRegister,
  } = useRegister(showToast); // ✅ INI YANG PENTING

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <RegisterBackground />

      <RegisterCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        onRegister={handleRegister}
        onGoogleRegister={handleGoogleRegister}
      />

      {/* 🔥 WAJIB */}
      {toast && <Toast {...toast} onClose={hideToast} />}
    </div>
  );
}
