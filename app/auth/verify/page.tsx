"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const email = useSearchParams().get("email");
  const router = useRouter();

  const handleVerify = async () => {
    if (!email) {
      alert("Email tidak ditemukan");
      return;
    }

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Berhasil! Silakan login");
      router.push("/auth/signin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 p-6 shadow rounded-xl">
        <h1 className="text-lg font-semibold">Verifikasi Email</h1>

        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Kode OTP"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-black text-white py-2 rounded"
        >
          Verifikasi
        </button>
      </div>
    </div>
  );
}
