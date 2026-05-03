import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const prisma = await getPrisma(); // ✅ FIX

    const { id } = params;

    const reviews = await prisma.trailReview.findMany({
      where: { trail_id: id },
      include: {
        profiles: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching trail reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const prisma = await getPrisma(); // ✅ FIX

    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = params;
    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const review = await prisma.trailReview.create({
      data: {
        trail_id: id,
        user_id: userId,
        rating: Number(rating),
        comment: comment || "",
      },
      include: {
        profiles: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating trail review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
