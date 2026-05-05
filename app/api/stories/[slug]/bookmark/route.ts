import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  { params }: { params: { slug: string } },
) {
  try {
    const prisma = await getPrisma(); // ✅ FIX

    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { slug } = params;

    // Find the story by slug
    const story = await prisma.story.findUnique({
      where: { slug },
      select: { id: true, user_id: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Check if bookmark exists
    const existingBookmark = await prisma.bookmarks.findUnique({
      where: {
        user_id_story_id: {
          user_id: userId,
          story_id: story.id,
        },
      },
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.$transaction([
        prisma.bookmarks.delete({
          where: {
            user_id_story_id: {
              user_id: userId,
              story_id: story.id,
            },
          },
        }),
        prisma.story.update({
          where: { id: story.id },
          data: { bookmarks_count: { decrement: 1 } },
        }),
      ]);

      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await prisma.$transaction([
        prisma.bookmarks.create({
          data: {
            user_id: userId,
            story_id: story.id,
          },
        }),
        prisma.story.update({
          where: { id: story.id },
          data: { bookmarks_count: { increment: 1 } },
        }),
      ]);

      // Create notification
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        userId: story.user_id,
        actorId: userId,
        type: "bookmark",
        storyId: story.id,
      });

      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
