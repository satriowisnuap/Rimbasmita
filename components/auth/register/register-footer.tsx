"use client";

import Link from "next/link";

export function RegisterFooter() {
  return (
    <p className="text-xs text-muted-foreground mt-4">
      Sudah punya akun?{" "}
      <Link href="/auth/signin" className="text-primary hover:underline">
        Masuk
      </Link>
    </p>
  );
}
