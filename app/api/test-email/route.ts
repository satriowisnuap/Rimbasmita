import { NextRequest } from "next/server";
import { transporter } from "@/lib/mailer";

export async function GET(req: NextRequest) {
  try {
    // 🔍 cek koneksi SMTP dulu
    await transporter.verify();
    console.log("SMTP READY");

    // 📧 kirim email test
    const info = await transporter.sendMail({
      from: "Rimbasmita <rimbasmita@gmail.com>",
      to: "backupbang2024@gmail.com",
      subject: "TEST EMAIL 🚀",
      text: "Hello world, ini test dari Rimbasmita!",
    });

    console.log("EMAIL SENT:", info);

    return Response.json({
      message: "Email berhasil dikirim",
      info,
    });
  } catch (err) {
    console.error("ERROR EMAIL:", err);

    return Response.json({
      error: "Gagal kirim email",
      detail: err,
    });
  }
}
