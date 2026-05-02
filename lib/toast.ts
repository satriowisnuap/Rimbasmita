export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastConfig {
  title: string;
  message: string;
  variant: ToastVariant;
  actions?: { label: string; onClick: () => void; ghost?: boolean }[];
}

const VARIANT_STYLES: Record<
  ToastVariant,
  {
    wrapper: string;
    icon: string;
    iconBg: string;
    titleColor: string;
    messageColor: string;
    border: string;
  }
> = {
  success: {
    wrapper: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    icon: "✅",
    iconBg: "#bbf7d0",
    titleColor: "#14532d",
    messageColor: "#166534",
    border: "#86efac",
  },
  info: {
    wrapper: "linear-gradient(135deg, #f0fdf4, #d1fae5)",
    icon: "🌿",
    iconBg: "#a7f3d0",
    titleColor: "#064e3b",
    messageColor: "#065f46",
    border: "#6ee7b7",
  },
  warning: {
    wrapper: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    icon: "⏳",
    iconBg: "#fde68a",
    titleColor: "#78350f",
    messageColor: "#92400e",
    border: "#fcd34d",
  },
  error: {
    wrapper: "linear-gradient(135deg, #fff5f5, #fee2e2)",
    icon: "🚫",
    iconBg: "#fecaca",
    titleColor: "#7f1d1d",
    messageColor: "#991b1b",
    border: "#fca5a5",
  },
};

// ── Mapping pesan error dari API → ToastConfig ──────────────────────────────

export function getToastFromApiError(errorMessage: string): ToastConfig {
  const msg = errorMessage.toLowerCase();

  if (msg.includes("sudah terdaftar")) {
    return {
      variant: "error",
      title: "Email sudah terdaftar",
      message:
        "Email ini sudah terhubung ke akun Rimbasmita. Silakan masuk menggunakan password kamu.",
      actions: [
        {
          label: "Masuk sekarang",
          onClick: () => (window.location.href = "/login"),
        },
        {
          label: "Lupa password?",
          onClick: () => (window.location.href = "/forgot"),
          ghost: true,
        },
      ],
    };
  }

  if (msg.includes("masih aktif")) {
    return {
      variant: "info",
      title: "Kode masih aktif",
      message:
        "Kode verifikasi sebelumnya masih berlaku. Silakan cek email kamu.",
    };
  }

  if (msg.includes("tunggu")) {
    return {
      variant: "warning",
      title: "Tunggu sebentar",
      message:
        "Permintaan terlalu sering. Tunggu beberapa detik sebelum meminta kode baru.",
    };
  }

  if (msg.includes("gagal mengirim")) {
    return {
      variant: "error",
      title: "Gagal mengirim email",
      message:
        "Terjadi masalah saat pengiriman. Pastikan email kamu valid, lalu coba lagi.",
      actions: [{ label: "Coba lagi", onClick: () => {} }],
    };
  }

  if (msg.includes("wajib diisi")) {
    return {
      variant: "warning",
      title: "Data tidak lengkap",
      message: "Email dan password wajib diisi sebelum melanjutkan.",
    };
  }

  return {
    variant: "error",
    title: "Terjadi kesalahan",
    message: errorMessage || "Coba lagi beberapa saat.",
  };
}

export function getToastSuccess(): ToastConfig {
  return {
    variant: "success",
    title: "Kode berhasil dikirim!",
    message:
      "Kode verifikasi 6 digit telah dikirim ke email kamu. Berlaku selama 5 menit.",
  };
}

export { VARIANT_STYLES };
