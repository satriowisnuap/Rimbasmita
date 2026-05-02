import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    let { email, code } = await req.json();

    if (!email || !code) {
      return Response.json(
        { error: "Email dan kode wajib diisi" },
        { status: 400 },
      );
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
      return Response.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // 🔢 cek kode
    if (data.code !== code) {
      return Response.json({ error: "Kode salah" }, { status: 400 });
    }

    // ⏰ cek expired
    const now = Date.now();
    const expiredTime = Number(data.expired);

    if (isNaN(expiredTime)) {
      return Response.json(
        { error: "Format waktu tidak valid" },
        { status: 400 },
      );
    }

    if (now > expiredTime) {
      return Response.json({ error: "Kode expired" }, { status: 400 });
    }

    // 🔐 validasi password
    if (!data.password || typeof data.password !== "string") {
      throw new Error("Password tidak valid di database");
    }

    // 🔥 fallback username & name
    const username = data.username || data.email.split("@")[0];
    const name = data.name || username;

    // ⚠️ cegah duplicate user
    const { data: existing } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return Response.json({ error: "User sudah terdaftar" }, { status: 409 });
    }

    // 🔥 insert ke profiles (FULL NEXTAUTH MODE)
    const { error: profileError } = await supabase.from("profiles").insert({
      email: data.email,
      password: data.password, // hashed
      email_verified: true,
      username,
      name,
    });

    if (profileError) {
      return Response.json({ error: profileError.message }, { status: 500 });
    }

    // 🧹 hapus OTP setelah sukses
    await supabase.from("email_verifications").delete().eq("email", email);

    return Response.json({ message: "Berhasil verifikasi" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
