import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const trails = await prisma.trail.findMany();

  return Response.json({
    success: true,
    data: trails,
  });
}
