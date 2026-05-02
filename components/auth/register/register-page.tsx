"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRegister } from "@/hooks/auth/use-register";
import { RegisterBackground } from "./register-background";
import { RegisterCard } from "./register-card";
import { VerifyCard } from "../verify/verify-card";

export function RegisterPage() {
  // 🔥 tambah state ini
  const [step, setStep] = useState<"register" | "verify">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  // 🔥 callback dipanggil setelah register berhasil
  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email);
    setStep("verify");
  };

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleRegister,
    handleGoogleRegister,
  } = useRegister(handleRegisterSuccess);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <RegisterBackground />

      {/* 🔥 AnimatePresence untuk transisi mulus antar step */}
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
              onGoogleRegister={handleGoogleRegister}
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
              onBack={() => setStep("register")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/**/}
    </div>
  );
}
