"use client";

import { useState } from "react";

interface Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;

  username: string;
  setUsername: (v: string) => void;
  name: string;
  setName: (v: string) => void;

  loading: boolean;
  onSubmit: () => void;
}

export function RegisterEmailForm({
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  name,
  setName,
  loading,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Name */}
      <input
        type="text"
        placeholder="Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl glass bg-transparent text-sm outline-none"
      />

      {/* 🔥 Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          const value = e.target.value;
          setEmail(value);

          // auto generate username dari email
          if (value.includes("@")) {
            const autoUsername = value.split("@")[0];
            setUsername(autoUsername);

            // opsional: isi name kalau masih kosong
            // if (!name) {
            //   setName(autoUsername);
            // }
          }
        }}
        className="w-full px-4 py-3 rounded-xl glass bg-transparent text-sm outline-none"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl glass bg-transparent text-sm outline-none"
      />

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition"
      >
        {loading ? "Memproses..." : "Daftar"}
      </button>
    </div>
  );
}
