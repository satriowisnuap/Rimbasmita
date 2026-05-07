"use client";

import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

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

      {/* Email */}
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
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 pr-12 rounded-xl glass bg-transparent text-sm outline-none"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

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
