import { NextRequest } from "next/server";
import { transporter } from "@/lib/mailer";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { verificationEmailTemplate } from "@/lib/verification-email";

function json(data: object, status = 200) {
  return Response.json(data, { status });
}

async function checkExistingProfile(email: string) {
  const { data } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  return data;
}

async function checkExistingOtp(email: string) {
  const { data } = await supabase
    .from("email_verifications")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  return data;
}

function validateCooldown(
  existingOtp: { expired: number } | null,
): string | null {
  if (!existingOtp) return null;
  const now = Date.now();
  const expired = Number(existingOtp.expired);
  if (now < expired) return "Kode masih aktif, cek email kamu";
  if (now - expired < 30_000)
    return "Tunggu beberapa detik sebelum meminta kode baru";
  return null;
}

function generateOtp(): { code: string; expired: number } {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return { code, expired: Date.now() + 5 * 60 * 1000 };
}

async function saveOtp(
  email: string,
  hashed: string,
  code: string,
  expired: number,
  username: string,
  name: string,
) {
  await supabase.from("email_verifications").delete().eq("email", email);
  const { error } = await supabase
    .from("email_verifications")
    .insert({ email, password: hashed, code, expired, username, name });
  return error;
}

async function sendVerificationEmail(email: string, code: string) {
  return transporter.sendMail({
    from: "Rimbasmita <rimbasmita@gmail.com>",
    to: email,
    subject: "Kode Verifikasi Rimbasmita",
    text: `Kode verifikasi kamu adalah ${code}. Berlaku 5 menit.`,
    html: verificationEmailTemplate({ code }),
  });
}

export async function POST(req: NextRequest) {
  try {
    let { email, password, username, name } = await req.json();

    if (!email || !password)
      return json({ error: "Email & password wajib diisi" }, 400);

    email = (email as string).toLowerCase().trim();

    if (!name || name.trim().length < 2) {
      return json({ error: "Nama wajib diisi minimal 2 karakter" }, 400);
    }

    // ambil default dari email kalau kosong
    const defaultUsername = email.split("@")[0];

    username = username?.trim() || defaultUsername;
    name = name?.trim();

    if (await checkExistingProfile(email))
      return json({ error: "Email sudah terdaftar, silakan login" }, 409);

    const existingOtp = await checkExistingOtp(email);
    const cooldownError = validateCooldown(existingOtp);
    if (cooldownError) return json({ error: cooldownError }, 429);

    const hashed = await bcrypt.hash(password, 10);
    const { code, expired } = generateOtp();

    const insertError = await saveOtp(
      email,
      hashed,
      code,
      expired,
      username,
      name,
    );
    if (insertError) return json({ error: insertError.message }, 500);

    try {
      await sendVerificationEmail(email, code);
    } catch (mailError) {
      console.error("Email error:", mailError);
      return json({ error: "Gagal mengirim email, coba lagi nanti" }, 500);
    }

    return json({ message: "Kode verifikasi dikirim!" });
  } catch (err) {
    console.error(err);
    return json({ error: "Server error" }, 500);
  }
}
