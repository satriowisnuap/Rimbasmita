export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export async function GET() {
  const prisma = await getPrisma(); // ✅ FIX

  const trails = await prisma.trail.findMany();

  return Response.json({
    success: true,
    data: trails,
  });
}
