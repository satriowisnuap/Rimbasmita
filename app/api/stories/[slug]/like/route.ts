import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET stub — required by Next.js 13 build for dynamic routes
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { slug } = params;

    // Find the story by slug
    const story = await prisma.story.findUnique({
      where: { slug },
      select: { id: true, likes_count: true, user_id: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Check if like exists
    const existingLike = await prisma.likes.findUnique({
      where: {
        user_id_story_id: {
          user_id: userId,
          story_id: story.id,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.likes.delete({
          where: {
            user_id_story_id: {
              user_id: userId,
              story_id: story.id,
            },
          },
        }),
        prisma.story.update({
          where: { id: story.id },
          data: { likes_count: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.$transaction([
        prisma.likes.create({
          data: {
            user_id: userId,
            story_id: story.id,
          },
        }),
        prisma.story.update({
          where: { id: story.id },
          data: { likes_count: { increment: 1 } },
        }),
      ]);

      // Create notification
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        userId: story.user_id,
        actorId: userId,
        type: "like",
        storyId: story.id,
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
