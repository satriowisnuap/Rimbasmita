"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function useRegister(onSuccess?: (email: string) => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Berhasil! Silakan login");
      onSuccess?.(email); // 🔥 ganti router.push dengan ini
    }

    setLoading(false);
  };

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
