import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ stories: [], trails: [], authors: [] });
    }

    const [stories, trails, authors] = await Promise.all([
      // Search Stories
      prisma.story.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
          is_private: false,
          is_draft: false,
        },
        include: {
          profiles: {
            select: { name: true, username: true, image: true },
          },
          story_images: {
            where: { display_order: 0 },
            take: 1,
          },
        },
        take: 5,
      }),

      // Search Trails
      prisma.trail.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { location: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),

      // Search Authors
      prisma.profile.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      stories,
      trails,
      authors,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
