"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// 🔥 TAMBAHAN (toast)
import { useToast } from "@/components/ui/use-toast";
import { getToastFromApiError, getToastSuccess } from "@/lib/toast";

export function useSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔥 TAMBAHAN
  const { showToast } = useToast();

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

        // 🔥 TAMBAHAN TOAST (tidak mengganggu alert)
        const toastConfig = getToastFromApiError(res.error);
        showToast({
          title: toastConfig.title,
          message: toastConfig.message,
          variant: toastConfig.variant,
        });

        setLoading(false);
        return;
      }

      // 🔥 TAMBAHAN SUCCESS TOAST
      const toastConfig = getToastSuccess();
      showToast({
        title: "Login berhasil",
        message: "Selamat datang kembali di Rimbasmita 🌿",
        variant: "success",
      });

      // ✅ redirect manual (karena redirect: false)
      router.push(res?.url || "/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan saat login");

      // 🔥 TAMBAHAN ERROR TOAST
      showToast({
        title: "Terjadi kesalahan",
        message: "Gagal login, coba lagi nanti",
        variant: "error",
      });

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

      // 🔥 TAMBAHAN TOAST
      showToast({
        title: "Login Google gagal",
        message: "Silakan coba lagi",
        variant: "error",
      });

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
