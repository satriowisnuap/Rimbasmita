"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function useSignIn(
  onSuccess?: () => void,
  onError?: (message: string) => void,
) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // LOGIN CREDENTIALS
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        onError?.(res.error);
        return;
      }

      onSuccess?.();

      router.push(res?.url || "/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      onError?.("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  // LOGIN GOOGLE
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Google login error:", err);
      onError?.("Gagal login dengan Google");
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
