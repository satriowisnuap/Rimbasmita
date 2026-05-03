import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as any)?.id) {
    return { error: "Unauthorized", status: 401, userId: null };
  }
  const profile = await prisma.profile.findUnique({
    where: { id: (session.user as any).id },
    select: { role: true },
  });
  if (profile?.role !== "admin") {
    return { error: "Forbidden", status: 403, userId: null };
  }
  return { error: null, status: 200, userId: (session.user as any).id };
}

// GET — list all trails
export async function GET() {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const trails = await prisma.trail.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ trails });
  } catch (err) {
    console.error("Error fetching trails:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — create trail
export async function POST(req: Request) {
  const { error, status } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await req.json();
    const { name, location, region, elevation, difficulty, estimated_duration, description, image } = body;

    if (!name?.trim() || !location?.trim()) {
      return NextResponse.json({ error: "Nama dan lokasi wajib diisi" }, { status: 400 });
    }

    const trail = await prisma.trail.create({
      data: {
        name: name.trim(),
        location: location.trim(),
        region: region?.trim() || null,
        elevation: elevation ? Number(elevation) : 0,
        difficulty: difficulty || "medium",
        estimated_duration: estimated_duration?.trim() || null,
        description: description?.trim() || null,
        image: image?.trim() || null,
      },
    });

    return NextResponse.json({ trail }, { status: 201 });
  } catch (err) {
    console.error("Error creating trail:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
