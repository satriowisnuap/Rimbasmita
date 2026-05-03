import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { name, bio, location, image, username } = body;

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
