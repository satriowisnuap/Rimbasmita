"use client";

import { motion } from "framer-motion";
import { Mountain } from "lucide-react";
import { RegisterLogo } from "./register-logo";
import { RegisterHero } from "./register-hero";
import { RegisterEmailForm } from "./register-email-form";
import { RegisterGoogleButton } from "./register-google-button";
import { RegisterFooter } from "./register-footer";

interface Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  onRegister: () => void;
  onGoogleRegister: () => void;
}

export function RegisterCard({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onRegister,
  onGoogleRegister,
}: Props) {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-strong rounded-3xl p-8 sm:p-10 text-center"
      >
        <RegisterLogo />
        <RegisterHero />
        <RegisterEmailForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={onRegister}
        />
        <RegisterGoogleButton onGoogleRegister={onGoogleRegister} />
        <RegisterFooter />
      </motion.div>

      {/* Bottom decorative element */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="text-center mt-8"
      >
        <p className="text-xs text-muted-foreground/40 flex items-center justify-center gap-1.5">
          <Mountain className="h-3 w-3" />
          Dibuat untuk pecinta alam Indonesia
        </p>
      </motion.div>
    </div>
  );
}
