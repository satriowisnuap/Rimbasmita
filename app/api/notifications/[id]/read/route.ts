import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

// GET stub — required by Next.js 13 build for dynamic routes
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH(
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

    const notification = await prisma.notifications.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      );
    }

    if (notification.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.notifications.update({
      where: { id },
      data: { is_read: true },
    });

    return NextResponse.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
