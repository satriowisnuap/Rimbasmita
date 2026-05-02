// components/auth/verify/verify-page.tsx
"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mountain, Mail, ArrowLeft } from "lucide-react";

export function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const email = useSearchParams().get("email");
  const router = useRouter();

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted) {
      const next = [...otp];
      pasted.split("").forEach((c, i) => (next[i] = c));
      setOtp(next);
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return alert("Masukkan 6 digit kode OTP");
    if (!email) return alert("Email tidak ditemukan");

    setLoading(true);

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    setLoading(false);

    console.log("VERIFY RESPONSE:", data); 

    if (!res.ok || data.error) {
      alert(data.error || "Verifikasi gagal");
      return;
    }

    alert("Berhasil! Silakan login");

    setTimeout(() => {
      router.push("/auth/signin");
    }, 1000);
  };

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-strong rounded-3xl p-8 sm:p-10 text-center"
      >
        {/* Logo — sama dengan signin */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Verifikasi Email
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Masukkan kode 6 digit yang kami kirim ke
          </p>
          {email && (
            <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-muted/50 border border-border text-muted-foreground">
              {email}
            </span>
          )}
        </motion.div>

        {/* OTP input boxes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 justify-center mb-6"
          onPaste={handlePaste}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="
                w-11 h-14 text-center text-xl font-bold rounded-xl
                border border-border bg-background/50
                focus:border-primary focus:ring-2 focus:ring-primary/20
                outline-none transition-all
                text-foreground
              "
            />
          ))}
        </motion.div>

        {/* Verify button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 6}
          className="
            w-full py-3 rounded-2xl font-semibold text-sm
            bg-foreground text-background
            hover:bg-foreground/90 active:scale-[0.98]
            transition-all disabled:opacity-40 disabled:cursor-not-allowed
            mb-4
          "
        >
          {loading ? "Memverifikasi..." : "Verifikasi"}
        </motion.button>

        {/* Resend + back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <p className="text-xs text-muted-foreground">
            Tidak menerima kode?{" "}
            <button className="underline underline-offset-2 hover:text-foreground transition-colors">
              Kirim ulang
            </button>
          </p>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground mx-auto transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Kembali
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom decorative — sama dengan signin */}
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
