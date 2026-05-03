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

    // Fetch user profile
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch stories from ALL writers for the feed
    const url = new URL(req.url);
    const tab = url.searchParams.get("tab") || "terbaru";
    
    let orderBy: any = { created_at: "desc" };
    let whereClause: any = {
      is_private: false,
      is_draft: false,
    };

    if (tab === "populer") {
      orderBy = { likes_count: "desc" };
    } else if (tab === "trending") {
      // For trending, we'll sort by a combination of likes, comments, and bookmarks
      // Since Prisma doesn't support complex sorting like (likes + comments), we'll sort by likes_count desc as a fallback
      // but in a real app you might use a calculated "trending_score"
      orderBy = [
        { likes_count: "desc" },
        { comments_count: "desc" },
        { bookmarks_count: "desc" }
      ];
    }

    const stories = await prisma.story.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        likes_count: true,
        created_at: true,
        is_private: true,
        is_draft: true,
        profiles: {
          select: {
            name: true,
            username: true,
            image: true,
          }
        },
        trails: {
          select: {
            name: true,
          }
        },
        story_images: {
          select: {
            image_url: true,
          },
          orderBy: {
            display_order: 'asc'
          },
          take: 1
        }
      },
      orderBy,
      take: 20,
    });

    // Calculate stats
    // 1. Cerita ditulis (total stories)
    const totalStories = await prisma.story.count({
      where: { user_id: userId },
    });

    // 2. Total suka (sum of likes_count on all user's stories)
    const storiesForLikes = await prisma.story.findMany({
      where: { user_id: userId },
      select: { likes_count: true }
    });
    const totalLikes = storiesForLikes.reduce((sum, story) => sum + (story.likes_count || 0), 0);

    // 3. Jalur dijelajahi (distinct trails from stories)
    const distinctTrails = await prisma.story.findMany({
      where: { 
        user_id: userId,
        trail_id: { not: null }
      },
      select: { trail_id: true },
      distinct: ['trail_id']
    });
    const trailsExplored = distinctTrails.length;

    // 4. Hari berturut (Consecutive days) - basic implementation
    // For a real app, this would check consecutive daily logins or posts.
    // Here we'll just check if they posted today.
    const lastStory = await prisma.story.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
    
    let streakDays = 0;
    if (lastStory && lastStory.created_at) {
      const today = new Date();
      const lastPostDate = new Date(lastStory.created_at);
      const diffTime = Math.abs(today.getTime() - lastPostDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays <= 1) {
        streakDays = 1; // Basic placeholder for streak
      }
    }

    const stats = {
      totalStories,
      totalLikes,
      trailsExplored,
      streakDays
    };

    return NextResponse.json({
      profile,
      stories,
      stats
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
