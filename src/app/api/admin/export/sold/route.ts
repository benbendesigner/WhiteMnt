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
    where: { status: "SOLD" },
    orderBy: { soldAt: "desc" },
    select: {
      id: true,
      title: true,
      manufacturer: true,
      category: true,
      model: true,
      price: true,
      comparablePrice: true,
      soldTo: true,
      soldAt: true,
      salePrice: true,
      soldNotes: true,
      dateListed: true,
    },
  });

  const header = [
    "ID", "Title", "Manufacturer", "Category", "Model",
    "Asking Price (USD)", "Comparable Price (USD)",
    "Buyer", "Date Sold", "Sale Price (USD)", "Notes", "Date Listed",
  ].join(",");

  const rows = machines.map((m) =>
    [
      m.id,
      esc(m.title),
      esc(m.manufacturer),
      esc(m.category),
      esc(m.model),
      m.price != null ? Number(m.price) : "",
      m.comparablePrice != null ? Number(m.comparablePrice) : "",
      esc(m.soldTo),
      m.soldAt ? new Date(m.soldAt).toISOString().slice(0, 10) : "",
      m.salePrice != null ? Number(m.salePrice) : "",
      esc(m.soldNotes),
      new Date(m.dateListed).toISOString().slice(0, 10),
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="sold-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
