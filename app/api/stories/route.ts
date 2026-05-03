import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: {
        is_draft: false,
        is_private: false,
      },
      orderBy: { created_at: "desc" },
      take: 20,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        difficulty: true,
        duration: true,
        mood: true,
        likes_count: true,
        comments_count: true,
        created_at: true,
        profiles: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        trails: {
          select: {
            name: true,
            location: true,
          },
        },
        story_images: {
          orderBy: { display_order: "asc" },
          take: 1,
          select: {
            image_url: true,
          },
        },
        story_tags: {
          take: 3,
          select: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
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

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    const slug = generateSlug(title);

    // Create story using Prisma
    const story = await prisma.story.create({
      data: {
        user_id: userId,
        title: title.trim(),
        slug,
        content: content.trim(),
        excerpt: content.trim().substring(0, 200),
        trail_id: selectedTrail || null,
        difficulty: difficulty || null,
        duration: duration?.trim() || null,
        elevation: elevation?.trim() || null,
        mood: mood || null,
        tips: tips?.trim() || null,
        warnings: warnings?.trim() || null,
        is_private: isPrivate,
        is_draft: isDraft,
        // Insert tags if any
        ...(tags && tags.length > 0 && {
          story_tags: {
            create: tags.map((tag: string) => ({
              tag,
            })),
          },
        }),
        // Insert images if any
        ...(imageUrls && imageUrls.length > 0 && {
          story_images: {
            create: imageUrls.map((url: string, index: number) => ({
              image_url: url,
              display_order: index,
            })),
          },
        }),
      },
    });

    return NextResponse.json({ success: true, story }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating story:", error);

    // Check for unique constraint violation (P2002)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A story with a similar title already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
