"use client";

import { useState, useEffect } from "react";
import { useSignIn } from "@/hooks/auth/use-signin";
import { SignInBackground } from "./signin-background";
import { SignInCard } from "./signin-card";
import { AlertModal } from "@/components/ui/alert-modal";
import { useRouter, useSearchParams } from "next/navigation";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertState {
  open: boolean;
  type: AlertType;
  title?: string;
  message: string;
}

const CLOSED_ALERT: AlertState = { open: false, type: "info", message: "" };

export function SignInPage() {
  const [alert, setAlert] = useState<AlertState>(CLOSED_ALERT);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showAlert = (type: AlertType, title: string, message: string) =>
    setAlert({ open: true, type, title, message });

  const closeAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  const handleLoginError = (message: string) => {
    showAlert("error", "Login Gagal", message);

    setTimeout(() => {
      closeAlert();
    }, 2500); // kasih waktu lebih lama biar kebaca
  };

  const handleLoginSuccess = () => {
    const alertData = {
      type: "success",
      title: "Selamat Datang! 🌿",
      message: "Login berhasil. Siap menjelajah alam Indonesia bersama kami!",
    };

    sessionStorage.setItem("global-alert", JSON.stringify(alertData));

    router.push("/dashboard");
  };

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setAlert({
        open: true,
        type: "success",
        title: "Verifikasi Berhasil! 🌿",
        message: "Akunmu telah diaktifkan. Silakan login untuk melanjutkan.",
      });

      // 🔥 auto close setelah 2.5 detik
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, open: false }));
      }, 2500);

      const url = new URL(window.location.href);
      url.searchParams.delete("verified");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const handleGoogleLoginWithAlert = () => {
    const alertData = {
      type: "success",
      title: "Login dengan Google Berhasil 🌿",
      message: "Selamat datang kembali! Petualanganmu siap dimulai ",
    };

    // simpan alert untuk dashboard
    sessionStorage.setItem("global-alert", JSON.stringify(alertData));

    // lanjut ke google login
    handleGoogleLogin();
  };

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
    handleGoogleLogin,
  } = useSignIn(handleLoginSuccess, handleLoginError);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <SignInBackground />

      {/* Alert Modal */}
      <AlertModal
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />

      <SignInCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loading={loading}
        onLogin={handleLogin}
        // onClose={() => setAlert(CLOSED_ALERT)}
        onGoogleLogin={handleGoogleLoginWithAlert}
      />
    </div>
  );
}
