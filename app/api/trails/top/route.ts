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

    const trails = await prisma.trail.findMany({
      include: {
        _count: {
          select: {
            stories: {
              where: {
                is_private: false,
                is_draft: false,
              },
            },
            trail_reviews: true,
          },
        },
        trail_reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 20,
    });

    const sortedTrails = trails
      .map((trail) => {
        const storiesCount = trail._count?.stories || 0;
        const reviewsCount = trail._count?.trail_reviews || 0;

        const totalActivity = storiesCount + reviewsCount;

        const validRatings =
          trail.trail_reviews?.map((r) => Number(r.rating) || 0) || [];

        const avgRating =
          validRatings.length > 0
            ? validRatings.reduce((acc, val) => acc + val, 0) /
              validRatings.length
            : 0;

        return {
          ...trail,
          totalActivity,
          avgRating: Number(avgRating.toFixed(1)),
          storiesCount,
          reviewsCount,
        };
      })
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 6);

    return NextResponse.json(sortedTrails);
  } catch (error) {
    console.error("Error fetching top trails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
