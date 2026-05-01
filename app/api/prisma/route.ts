import { prisma } from "@/lib/prisma";

export async function GET() {
  const trails = await prisma.trail.findMany();

  return Response.json({
    success: true,
    data: trails,
  });
}
