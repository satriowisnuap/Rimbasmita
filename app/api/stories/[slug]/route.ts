import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const prisma = await getPrisma(); // ✅ FIX

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const { slug } = params;

    const story = await prisma.story.findUnique({
      where: { slug },
      include: {
        profiles: {
          select: { id: true, name: true, username: true, image: true },
        },
        trails: true,
        story_images: {
          orderBy: { display_order: "asc" },
        },
        story_tags: true,
        comments: {
          include: {
            profiles: {
              select: { name: true, username: true, image: true },
            },
          },
          orderBy: { created_at: "asc" },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    let isLiked = false;
    let isBookmarked = false;

    if (userId) {
      const like = await prisma.likes.findUnique({
        where: {
          user_id_story_id: {
            user_id: userId,
            story_id: story.id,
          },
        },
      });
      isLiked = !!like;

      const bookmark = await prisma.bookmarks.findUnique({
        where: {
          user_id_story_id: {
            user_id: userId,
            story_id: story.id,
          },
        },
      });
      isBookmarked = !!bookmark;
    }

    return NextResponse.json({
      story,
      comments: story.comments,
      isLiked,
      isBookmarked,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
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
    const body = await req.json();

    const {
      title,
      content,
      selectedTrail,
      difficulty,
      duration,
      elevation,
      mood,
      tips,
      warnings,
      isPrivate,
      isDraft,
      tags,
      imageUrls,
    } = body;

    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 1) {
      return NextResponse.json(
        { error: "Maximum 1 image is allowed." },
        { status: 400 },
      );
    }

    const existingStory = await prisma.story.findUnique({
      where: { slug },
      select: { id: true, user_id: true },
    });

    if (!existingStory) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (existingStory.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedStory = await prisma.story.update({
      where: { id: existingStory.id },
      data: {
        title: title?.trim(),
        content: content?.trim(),
        excerpt: content?.trim()?.substring(0, 200),
        trail_id: selectedTrail || null,
        difficulty: difficulty || null,
        duration: duration?.trim() || null,
        elevation: elevation?.trim() || null,
        mood: mood || null,
        tips: tips?.trim() || null,
        warnings: warnings?.trim() || null,
        is_private: isPrivate,
        is_draft: isDraft,
        updated_at: new Date(),
        story_tags: {
          deleteMany: {},
          create:
            tags?.map((tag: string) => ({
              tag,
            })) || [],
        },
        story_images: {
          deleteMany: {},
          create:
            imageUrls?.map((url: string, index: number) => ({
              image_url: url,
              display_order: index,
            })) || [],
        },
      },
    });

    return NextResponse.json({ success: true, story: updatedStory });
  } catch (error: any) {
    console.error("Error updating story:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
