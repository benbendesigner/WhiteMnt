import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  let machines: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    machines = await prisma.machine.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    machines = [];
  }

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/inventory`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    ...machines.map((m) => ({
      url: `${baseUrl}/inventory/${m.slug}`,
      lastModified: m.updatedAt,
    })),
  ];
}
