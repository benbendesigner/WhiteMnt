import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function esc(v: unknown): string {
  const s = v == null ? "" : String(v);
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const machines = await prisma.machine.findMany({
    orderBy: { dateListed: "desc" },
    select: {
      id: true,
      title: true,
      manufacturer: true,
      category: true,
      model: true,
      serialNumber: true,
      condition: true,
      quantity: true,
      price: true,
      comparablePrice: true,
      callForPrice: true,
      status: true,
      featured: true,
      dateListed: true,
      views: true,
    },
  });

  const header = [
    "ID", "Title", "Manufacturer", "Category", "Model", "Serial Number",
    "Condition", "Quantity", "Price (USD)", "Comparable Price (USD)",
    "Call For Price", "Status", "Featured", "Date Listed", "Views",
  ].join(",");

  const rows = machines.map((m) =>
    [
      m.id,
      esc(m.title),
      esc(m.manufacturer),
      esc(m.category),
      esc(m.model),
      esc(m.serialNumber),
      m.condition,
      m.quantity,
      m.price != null ? Number(m.price) : "",
      m.comparablePrice != null ? Number(m.comparablePrice) : "",
      m.callForPrice ? "Yes" : "No",
      m.status,
      m.featured ? "Yes" : "No",
      new Date(m.dateListed).toISOString().slice(0, 10),
      m.views,
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="listings-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
