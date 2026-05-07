import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function PATCH(req: Request) {
  try {
    const prisma = await getPrisma(); // ✅ FIX

    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string | null;
    const location = formData.get("location") as string | null;
    const username = formData.get("username") as string;
    const file = formData.get("avatar") as File | null;
    let image = formData.get("image") as string | null;

    if (file && file.size > 0) {
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Ukuran gambar maksimal 2MB" },
          { status: 400 }
        );
      }
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Hanya file gambar yang diperbolehkan" },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/\s+/g, "_")}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("avatar")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase avatar upload error:", uploadError);
        return NextResponse.json(
          { error: "Gagal mengupload gambar profil" },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("avatar")
        .getPublicUrl(filePath);

      image = publicUrlData.publicUrl;
    }

    // Optional: Check if username is taken (if changed)
    if (username) {
      const existing = await prisma.profile.findFirst({
        where: {
          username: username.toLowerCase(),
          id: { not: userId },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 },
        );
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: userId },
      data: {
        name,
        bio,
        location,
        image,
        username: username?.toLowerCase(),
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
