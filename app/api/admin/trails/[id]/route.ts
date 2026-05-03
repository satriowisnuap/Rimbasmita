import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.id) {
    return { error: "Unauthorized", status: 401 };
  }
  const profile = await prisma.profile.findUnique({
    where: { id: (session.user as any).id },
    select: { role: true },
  });
  if (profile?.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }
  return { error: null, status: 200 };
}

// GET — fetch single trail (required by Next.js 13 build for dynamic routes)
export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const trail = await prisma.trail.findUnique({
      where: { id: params.id },
    });

    if (!trail) {
      return NextResponse.json({ error: "Trail not found" }, { status: 404 });
    }

    return NextResponse.json({ trail });
  } catch (err) {
    console.error("Error fetching trail:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH — update trail
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await req.json();
    const {
      name,
      location,
      region,
      elevation,
      difficulty,
      estimated_duration,
      description,
      image,
    } = body;

    const trail = await prisma.trail.update({
      where: { id: params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(location && { location: location.trim() }),
        region: region?.trim() || null,
        ...(elevation !== undefined && { elevation: Number(elevation) }),
        ...(difficulty && { difficulty }),
        estimated_duration: estimated_duration?.trim() || null,
        description: description?.trim() || null,
        image: image?.trim() || null,
      },
    });

    return NextResponse.json({ trail });
  } catch (err) {
    console.error("Error updating trail:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE — delete trail
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const existing = await prisma.trail.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Trail not found" }, { status: 404 });
    }
    await prisma.trail.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting trail:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
