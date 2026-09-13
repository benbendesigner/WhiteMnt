import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { CONTACT_EMAIL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const active = subscribers.filter((s) => s.active);
  const mailto = `mailto:${CONTACT_EMAIL}?bcc=${encodeURIComponent(active.map((s) => s.email).join(","))}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Newsletter</h1>
        <Badge variant="secondary">
          {active.length} active
        </Badge>
        {active.length > 0 && (
          <a href={mailto} className="text-sm text-primary hover:underline">
            Email all subscribers
          </a>
        )}
      </div>

      {subscribers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No signups yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Signed up</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2.5">
                    <a href={`mailto:${s.email}`} className="text-foreground hover:text-primary">
                      {s.email}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                    {new Date(s.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5">
                    {s.active ? (
                      <span className="text-muted-foreground">Active</span>
                    ) : (
                      <span className="text-muted-foreground/60">Unsubscribed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
