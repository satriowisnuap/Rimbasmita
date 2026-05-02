"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function useRegister(
  onSuccess?: (email: string) => void,
  onError?: (message: string) => void,
) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // 🔥 handle error dari server
      if (!res.ok) {
        onError?.(data.error || "Email sudah terdaftar");
        return;
      }

      if (data.error) {
        onError?.(data.error);
        return;
      }

      // ✅ sukses
      onSuccess?.(email);
    } catch (err) {
      onError?.("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google register
  const handleGoogleRegister = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleRegister,
    handleGoogleRegister,
  };
}
