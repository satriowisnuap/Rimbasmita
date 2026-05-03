import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = (session?.user as any)?.id;
    const { username } = params;

    // Fetch profile
    const profile = await prisma.profile.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const isOwnProfile = currentUserId === profile.id;

    // Fetch stats
    const storiesCount = await prisma.story.count({
      where: {
        user_id: profile.id,
        is_draft: false,
        ...(isOwnProfile ? {} : { is_private: false }),
      },
    });

    const storiesForLikes = await prisma.story.findMany({
      where: {
        user_id: profile.id,
        is_draft: false,
        ...(isOwnProfile ? {} : { is_private: false }),
      },
      select: { likes_count: true },
    });
    const totalLikes = storiesForLikes.reduce((sum, s) => sum + (s.likes_count || 0), 0);

    const storiesForTrails = await prisma.story.findMany({
      where: {
        user_id: profile.id,
        is_draft: false,
        ...(isOwnProfile ? {} : { is_private: false }),
      },
      select: { trail_id: true },
      distinct: ['trail_id'],
    });
    const trailsVisited = storiesForTrails.filter(s => s.trail_id).length;

    const followersCount = await prisma.follows.count({
      where: { following_id: profile.id },
    });

    const followingCount = await prisma.follows.count({
      where: { follower_id: profile.id },
    });

    // Check if current user follows this profile
    let isFollowing = false;
    if (currentUserId && !isOwnProfile) {
      const follow = await prisma.follows.findUnique({
        where: {
          follower_id_following_id: {
            follower_id: currentUserId,
            following_id: profile.id,
          }
        }
      });
      isFollowing = !!follow;
    }

    // Fetch stories for the initial tab (cerita)
    const stories = await prisma.story.findMany({
      where: {
        user_id: profile.id,
        is_draft: false,
        ...(isOwnProfile ? {} : { is_private: false }),
      },
      include: {
        profiles: {
          select: { name: true, username: true, image: true }
        },
        trails: {
          select: { name: true, location: true }
        },
        story_images: {
          orderBy: { display_order: 'asc' }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Fetch bookmarks (separate tab)
    const bookmarks = await prisma.bookmarks.findMany({
      where: { user_id: profile.id },
      include: {
        stories: {
          include: {
            profiles: {
              select: { name: true, username: true, image: true }
            },
            trails: {
              select: { name: true, location: true }
            },
            story_images: {
              orderBy: { display_order: 'asc' }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Filter bookmarks for privacy
    const filteredBookmarks = bookmarks
      .map(b => b.stories)
      .filter(s => {
        if (!s) return false;
        if (s.is_draft) return false; // Bookmarks shouldn't be drafts anyway
        if (!s.is_private) return true;
        return s.user_id === currentUserId;
      });

    return NextResponse.json({
      profile,
      stats: {
        storiesCount,
        totalLikes,
        trailsVisited,
        followersCount,
        followingCount,
      },
      isFollowing,
      isOwnProfile,
      stories,
      bookmarkedStories: filteredBookmarks,
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
