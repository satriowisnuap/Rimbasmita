import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
              }
            },
            story_images: {
              orderBy: { display_order: 'asc' },
              take: 1
            },
            trails: {
              select: {
                name: true,
                location: true,
              }
            }
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!trail) {
      return NextResponse.json({ error: "Trail not found" }, { status: 404 });
    }

    return NextResponse.json(trail);
  } catch (error) {
    console.error("Error fetching trail detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
