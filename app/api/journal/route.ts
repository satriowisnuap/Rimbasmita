import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function GET(req: Request) {
  try {
    const prisma = await getPrisma(); // ✅ FIX

    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch all published stories (both private and public)
    const publishedStories = await prisma.story.findMany({
      where: {
        user_id: userId,
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
      publishedStories,
      drafts,
    });
  } catch (error) {
    console.error("Error fetching journal stories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
