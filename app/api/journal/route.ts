import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch private stories
    const privateStories = await prisma.story.findMany({
      where: {
        user_id: userId,
        is_private: true,
        is_draft: false,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        mood: true,
        is_draft: true,
        is_private: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    // Fetch drafts
    const drafts = await prisma.story.findMany({
      where: {
        user_id: userId,
        is_draft: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        mood: true,
        is_draft: true,
        is_private: true,
        created_at: true,
      },
      orderBy: { updated_at: "desc" },
    });

    return NextResponse.json({
      privateStories,
      drafts,
    });
  } catch (error) {
    console.error("Error fetching journal stories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
