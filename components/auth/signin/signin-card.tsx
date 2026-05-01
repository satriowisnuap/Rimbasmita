"use client";

import { motion } from "framer-motion";
import { SignInLogo } from "./signin-logo";
import { SignInHero } from "./signin-hero";
import { SignInEmailForm } from "./signin-email-form";
import { SignInGoogleButton } from "./signin-google-button";
import { SignInFooter } from "./signin-footer";
import { Mountain } from "lucide-react";

interface Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  onLogin: () => void;
  onGoogleLogin: () => void;
}

export function SignInCard({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onLogin,
  onGoogleLogin,
}: Props) {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" as const }}
        className="glass-strong rounded-3xl p-8 sm:p-10 text-center"
      >
        <SignInLogo />
        <SignInHero />
        <SignInEmailForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={onLogin}
        />
        <SignInGoogleButton onGoogleLogin={onGoogleLogin} />
        <SignInFooter />
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
