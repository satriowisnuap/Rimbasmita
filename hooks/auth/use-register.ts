"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function useRegister(
  onSuccess?: (email: string) => void,
  onError?: (message: string) => void,
) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    if (!email || !password) {
      onError?.("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: email.trim(),
        password,
        name: name.trim(),
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        onError?.(data.error || "Pendaftaran gagal");
        return;
      }

      onSuccess?.(email);
    } catch {
      onError?.("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    loading,
    handleRegister,
    handleGoogleRegister,
  };
}
