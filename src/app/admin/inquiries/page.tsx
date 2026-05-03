import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export default async function InquiriesPage() {
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unread = inquiries.filter((i) => !i.read).length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Contact Inquiries</h1>
        {unread > 0 && <Badge variant="destructive">{unread} unread</Badge>}
      </div>

      {inquiries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No inquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className={`rounded-lg border p-4 ${
                inq.read
                  ? "border-border bg-card"
                  : "border-primary/30 bg-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{inq.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <a href={`mailto:${inq.email}`} className="transition-colors hover:text-primary">
                      {inq.email}
                    </a>
                    {inq.phone && ` · ${inq.phone}`}
                  </p>
                  {inq.machineName && (
                    <p className="mt-0.5 text-xs text-muted-foreground">Re: {inq.machineName}</p>
                  )}
                </div>
                <p className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-foreground/80">{inq.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
