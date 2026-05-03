import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { slug } = params;

    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    // Find the story by slug
    const story = await prisma.story.findUnique({
      where: { slug },
      select: { id: true, user_id: true }
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Add comment
    const [comment] = await prisma.$transaction([
      prisma.comments.create({
        data: {
          user_id: userId,
          story_id: story.id,
          content: content.trim()
        },
        include: {
          profiles: {
            select: { name: true, username: true, image: true }
          }
        }
      }),
      prisma.story.update({
        where: { id: story.id },
        data: { comments_count: { increment: 1 } }
      })
    ]);

    // Create notification
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: story.user_id,
      actorId: userId,
      type: "comment",
      storyId: story.id,
      message: `mengomentari: "${content.trim().substring(0, 50)}${content.trim().length > 50 ? "..." : ""}"`
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
