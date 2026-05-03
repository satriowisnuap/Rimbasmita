import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trails = await prisma.trail.findMany({
      include: {
        _count: {
          select: {
            stories: {
              where: {
                is_private: false,
                is_draft: false,
              }
            },
            trail_reviews: true,
          }
        },
        trail_reviews: {
          select: {
            rating: true,
          }
        }
      },
      take: 20,
    });

    const sortedTrails = trails
      .map((trail) => {
        const totalActivity = (trail._count.stories || 0) + (trail._count.trail_reviews || 0);
        const avgRating = trail.trail_reviews.length > 0
          ? trail.trail_reviews.reduce((acc, r) => acc + r.rating, 0) / trail.trail_reviews.length
          : 0;

        return {
          ...trail,
          totalActivity,
          avgRating: Number(avgRating.toFixed(1)),
          storiesCount: trail._count.stories,
          reviewsCount: trail._count.trail_reviews,
        };
      })
      .sort((a, b) => b.totalActivity - a.totalActivity)
      .slice(0, 6);

    return NextResponse.json(sortedTrails);
  } catch (error) {
    console.error("Error fetching top trails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
