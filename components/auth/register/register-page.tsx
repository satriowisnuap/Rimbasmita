"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRegister } from "@/hooks/auth/use-register";
import { RegisterBackground } from "./register-background";
import { RegisterCard } from "./register-card";
import { VerifyCard } from "../verify/verify-card";
import { AlertModal } from "@/components/ui/alert-modal";
import { useRouter } from "next/navigation";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertState {
  open: boolean;
  type: AlertType;
  title?: string;
  message: string;
}

const CLOSED_ALERT: AlertState = { open: false, type: "info", message: "" };

export function RegisterPage() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [username, setUsername] = useState("");
  const [alert, setAlert] = useState<AlertState>(CLOSED_ALERT);
  const router = useRouter();

  const showAlert = (type: AlertType, title: string, message: string) =>
    setAlert({ open: true, type, title, message });

  const closeAlert = () => setAlert((prev) => ({ ...prev, open: false }));

  // 🔥 GOOGLE REGISTER
  const handleGoogleRegisterWithAlert = () => {
    const alertData = {
      type: "info",
      title: "Menghubungkan ke Google...",
      message: "Tunggu sebentar, kami sedang memproses akun kamu.",
    };

    // simpan alert sementara
    sessionStorage.setItem("global-alert", JSON.stringify(alertData));

    // 🔥 kirim mode register (penting)
    handleGoogleRegister();
  };

  // 🔥 REGISTER SUCCESS
  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email);

    showAlert(
      "success",
      "Pendaftaran Berhasil!",
      `Kode verifikasi telah dikirim ke ${email}. Silakan cek inbox kamu.`,
    );

    setTimeout(() => {
      closeAlert();
      setStep("verify");
    }, 1500);
  };

  // 🔥 REGISTER ERROR (INI YANG DIPERBAIKI)
  const handleRegisterError = (message: string) => {
    // jika email sudah terdaftar
    if (message.toLowerCase().includes("sudah terdaftar")) {
      showAlert(
        "warning",
        "Email Sudah Terdaftar",
        "Email ini sudah digunakan. Silakan login saja.",
      );

      // opsional: arahkan ke login
      setTimeout(() => {
        closeAlert();
        router.push("/auth/signin");
      }, 2000);
    } else {
      showAlert("error", "Pendaftaran Gagal", message);

      setTimeout(() => {
        closeAlert();
      }, 2500);
    }
  };

  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    loading,
    handleRegister,
    handleGoogleRegister,
  } = useRegister(handleRegisterSuccess, handleRegisterError);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <RegisterBackground />

      {/* Alert Modal */}
      <AlertModal
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />

      {/* AnimatePresence */}
      <AnimatePresence mode="wait">
        {step === "register" ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <RegisterCard
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              username={username}
              setUsername={setUsername}
              name={name}
              setName={setName}
              loading={loading}
              onRegister={handleRegister}
              onGoogleRegister={handleGoogleRegisterWithAlert}
            />
          </motion.div>
        ) : (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <VerifyCard
              email={registeredEmail}
              onBack={() => {
                showAlert(
                  "warning",
                  "Kembali ke Pendaftaran?",
                  "Kode OTP masih berlaku. Kamu bisa verifikasi nanti.",
                );
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
