"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function useSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔐 LOGIN CREDENTIALS
  const handleLogin = async () => {
    if (loading) return; // ⛔ prevent double click
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        alert(res.error);
        setLoading(false);
        return;
      }

      // ✅ redirect manual (karena redirect: false)
      router.push(res?.url || "/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan saat login");
      setLoading(false);
    }
  };

  // 🔥 LOGIN GOOGLE
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // ❗ NextAuth otomatis redirect → jangan pakai router.push
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Google login error:", err);
      alert("Gagal login dengan Google");
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleGoogleLogin,
  };
}
