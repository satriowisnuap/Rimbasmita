import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const { slug } = params;

    const story = await prisma.story.findUnique({
      where: { slug },
      include: {
        profiles: {
          select: { id: true, name: true, username: true, image: true },
        },
        trails: true,
        story_images: {
          orderBy: { display_order: 'asc' }
        },
        story_tags: true,
        comments: {
          include: {
            profiles: {
              select: { name: true, username: true, image: true }
            }
          },
          orderBy: { created_at: 'asc' }
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Check if the current user has liked or bookmarked the story
    let isLiked = false;
    let isBookmarked = false;

    if (userId) {
      const like = await prisma.likes.findUnique({
        where: {
          user_id_story_id: {
            user_id: userId,
            story_id: story.id
          }
        }
      });
      isLiked = !!like;

      const bookmark = await prisma.bookmarks.findUnique({
        where: {
          user_id_story_id: {
            user_id: userId,
            story_id: story.id
          }
        }
      });
      isBookmarked = !!bookmark;
    }

    return NextResponse.json({
      story,
      comments: story.comments,
      isLiked,
      isBookmarked,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
