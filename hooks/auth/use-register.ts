"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// 🔥 import toast helper kamu
import { getToastFromApiError, getToastSuccess } from "@/lib/toast";

// ✅ TERIMA showToast dari parameter
export function useRegister(showToast?: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.error) {
      const toastConfig = getToastFromApiError(data.error);

      if (showToast) {
        showToast({
          title: toastConfig.title,
          message: toastConfig.message,
          variant: toastConfig.variant,
        });
      }
    } else {
      const toastConfig = getToastSuccess();

      if (showToast) {
        showToast({
          title: toastConfig.title,
          message: toastConfig.message,
          variant: toastConfig.variant,
        });
      }

      router.push(`/auth/verify?email=${email}`);
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
