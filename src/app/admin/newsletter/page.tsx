import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export default async function NewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const active = subscribers.filter((s) => s.active).length;

  const csvRows = [
    "Email,Status,Subscribed",
    ...subscribers.map(
      (s) =>
        `${s.email},${s.active ? "Active" : "Unsubscribed"},${s.subscribedAt.toISOString().slice(0, 10)}`
    ),
  ].join("\n");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Newsletter Subscribers</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {active} active · {subscribers.length} total
          </p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvRows)}`}
          download="newsletter-subscribers.csv"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        {subscribers.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No subscribers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((s) => (
                <tr key={s.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.active ? "default" : "secondary"}>
                      {s.active ? "Active" : "Unsubscribed"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.subscribedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
