import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
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

    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json(
        { error: "Tidak memiliki akses" },
        { status: 401 },
      );
    }

    const userId = (session.user as any).id;

    const notifications = await prisma.notifications.findMany({
      where: { user_id: userId },
      include: {
        profiles_notifications_actor_idToprofiles: {
          select: { name: true, username: true, image: true },
        },
        stories: {
          select: { title: true, slug: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error mengambil notifikasi:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}

export async function PATCH() {
  try {
    const prisma = await getPrisma();

    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json(
        { error: "Tidak memiliki akses" },
        { status: 401 },
      );
    }

    const userId = (session.user as any).id;

    await prisma.notifications.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });

    return NextResponse.json({
      message: "Semua notifikasi ditandai telah dibaca",
    });
  } catch (error) {
    console.error("Error memperbarui notifikasi:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const prisma = await getPrisma();

    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json(
        { error: "Tidak memiliki akses" },
        { status: 401 },
      );
    }

    const userId = (session.user as any).id;

    await prisma.notifications.deleteMany({
      where: { user_id: userId },
    });

    return NextResponse.json({
      message: "Semua notifikasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Error menghapus notifikasi:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
