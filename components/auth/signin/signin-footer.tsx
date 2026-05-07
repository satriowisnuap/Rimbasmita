"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function SignInFooter() {
  return (
    <>
      {/* Register link */}
      <p className="text-xs text-muted-foreground mt-4">
        Belum punya akun?{" "}
        <Link href="/auth/register" className="text-primary hover:underline">
          Daftar
        </Link>
      </p>

      {/* TOS note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="text-xs text-muted-foreground/60 mt-6 leading-relaxed"
      >
        Dengan masuk, kamu menyetujui ketentuan layanan dan kebijakan privasi
        Rimbasmita.
      </motion.p>
    </>
  );
}
