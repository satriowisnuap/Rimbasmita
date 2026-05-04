import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const prisma = await getPrisma();

    // ✅ await params — wajib di Next.js 15
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Trail ID is required" },
        { status: 400 },
      );
    }

    const trail = await prisma.trail.findUnique({
      where: { id },
      include: {
        stories: {
          where: {
            is_private: false,
            is_draft: false,
          },
          include: {
            profiles: {
              select: {
                name: true,
                username: true,
                image: true,
              },
            },
            story_images: {
              orderBy: { display_order: "asc" },
              take: 1,
            },
            trails: {
              select: {
                name: true,
                location: true,
              },
            },
          },
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!trail) {
      return NextResponse.json({ error: "Trail not found" }, { status: 404 });
    }

    return NextResponse.json(trail);
  } catch (error) {
    console.error("Error fetching trail detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
