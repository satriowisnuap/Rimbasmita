import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function GET() {
  try {
    const prisma = await getPrisma();

    const [storiesRaw, trailsRaw] = await Promise.all([
      prisma.story.findMany({
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
            select: { name: true, username: true, image: true },
          },
          trails: {
            select: { name: true, location: true },
          },
          story_images: {
            orderBy: { display_order: "asc" },
            take: 1,
            select: { image_url: true },
          },
          story_tags: {
            take: 3,
            select: { tag: true },
          },
        },
      }),

      prisma.trail.findMany({
        take: 6,
        orderBy: {
          stories: { _count: "desc" }, // fix: hapus backslash
        },
        include: {
          _count: { select: { stories: true, trail_reviews: true } },
          trail_reviews: { select: { rating: true } },
        },
      }),
    ]);

    // Process trails — hitung avgRating dari reviews yang sudah di-fetch
    const trails = trailsRaw.map((trail) => {
      const storiesCount = trail._count?.stories ?? 0;
      const reviewsCount = trail._count?.trail_reviews ?? 0;

      const validRatings =
        trail.trail_reviews?.map((r) => Number(r.rating) || 0) ?? [];
      const avgRating =
        validRatings.length > 0
          ? validRatings.reduce((a, b) => a + b, 0) / validRatings.length
          : 0;

      return {
        ...trail,
        totalActivity: storiesCount + reviewsCount,
        avgRating: Number(avgRating.toFixed(1)),
        storiesCount,
        reviewsCount,
      };
    });
    // Tidak perlu .sort() + .slice() lagi — DB sudah mengurutkan & membatasi ke 6

    return NextResponse.json({
      stories: storiesRaw,
      trails,
    });
  } catch (error) {
    console.error("Homepage data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
