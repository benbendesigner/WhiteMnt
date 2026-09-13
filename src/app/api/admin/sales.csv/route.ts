import { auth } from "@/lib/auth";
import { getSaleRecords, toCsv } from "@/lib/sales";

function parseDate(v: string | null): Date | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function GET(request: Request) {
  // The proxy only matches /admin/:path*, so this route guards itself.
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = parseDate(searchParams.get("from"));
  const to = parseDate(searchParams.get("to"));
  if (to) to.setHours(23, 59, 59, 999);

  const records = await getSaleRecords({ from, to });

  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = from || to
    ? `-${from?.toISOString().slice(0, 10) ?? "start"}-to-${to?.toISOString().slice(0, 10) ?? stamp}`
    : `-${stamp}`;

  // The BOM makes Excel read the file as UTF-8 instead of the local codepage,
  // which otherwise mangles names and the em dashes in notes.
  return new Response("﻿" + toCsv(records), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sales${suffix}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
