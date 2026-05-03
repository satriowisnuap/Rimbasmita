import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

// GET stub — required by Next.js 13 build for dynamic routes
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(
  req: Request,
  { params }: { params: { username: string } },
) {
  try {
    const prisma = await getPrisma(); // ✅ FIX

    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { username } = params;

    // Find the profile to follow
    const profile = await prisma.profile.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.id === userId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 },
      );
    }

    // Check if already following
    const existingFollow = await prisma.follows.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: profile.id,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follows.delete({
        where: {
          follower_id_following_id: {
            follower_id: userId,
            following_id: profile.id,
          },
        },
      });

      return NextResponse.json({ following: false });
    } else {
      // Follow
      await prisma.follows.create({
        data: {
          follower_id: userId,
          following_id: profile.id,
        },
      });

      // Create notification
      await createNotification({
        userId: profile.id,
        actorId: userId,
        type: "follow",
      });

      return NextResponse.json({ following: true });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
