"use client";

import { useRegister } from "@/hooks/auth/use-register";
import { RegisterBackground } from "./register-background";
import { RegisterCard } from "./register-card";

export function RegisterPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleRegister,
    handleGoogleRegister,
  } = useRegister();

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
    </div>
  );
}
