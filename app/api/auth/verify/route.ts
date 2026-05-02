import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    let { email, code } = await req.json();

    if (!email || !code) {
      return Response.json({ error: "Email dan kode wajib diisi" });
    }

    // 🔥 normalize email (HARUS SAMA dengan register)
    email = email.toLowerCase();

    // 🔍 ambil data OTP
    const { data, error } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return Response.json({ error: "User tidak ditemukan" });
    }

    // 🔢 cek kode
    if (data.code !== code) {
      return Response.json({ error: "Kode salah" });
    }

    // ⏰ cek expired
    const now = Date.now();
    const expiredTime = Number(data.expired);

    if (isNaN(expiredTime)) {
      return Response.json({ error: "Format waktu tidak valid" });
    }

    if (now > expiredTime) {
      return Response.json({ error: "Kode expired" });
    }

    // 🔥 buat user auth
    const { data: userData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError || !userData?.user) {
      return Response.json({
        error: authError?.message || "Gagal membuat user",
      });
    }

    if (!data.password || typeof data.password !== "string") {
      throw new Error("Password tidak valid di database");
    }
    // 🔥 insert ke profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userData.user.id,
      email: data.email,
      password: data.password,
      email_verified: true,
    });

    if (profileError) {
      return Response.json({ error: profileError.message });
    }

    // 🧹 hapus OTP setelah sukses
    await supabase.from("email_verifications").delete().eq("email", email);

    return Response.json({ message: "Berhasil verifikasi" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" });
  }
}
