"use client";

interface Props {
  onGoogleRegister: () => void;
}

export function RegisterGoogleButton({ onGoogleRegister }: Props) {
  return (
    <>
      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">atau</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        onClick={onGoogleRegister}
        className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl glass font-medium text-sm"
      >
        <span>Daftar dengan Google</span>
      </button>
    </>
  );
}
