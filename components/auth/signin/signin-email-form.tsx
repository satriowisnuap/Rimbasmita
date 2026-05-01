"use client";

interface Props {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
}

export function SignInEmailForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl glass bg-transparent text-sm outline-none"
      />

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
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </div>
  );
}
