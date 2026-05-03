import { Badge, badgeVariants } from "@/components/ui/Badge";
import type { ListingStatus } from "@/generated/prisma/client";
import type { VariantProps } from "class-variance-authority";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export default function StatusBadge({ status }: { status: ListingStatus }) {
  if (status === "ACTIVE") return null;
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    PENDING: { label: "Pending Sale", variant: "secondary" },
    SOLD: { label: "Sold", variant: "destructive" },
    DRAFT: { label: "Draft", variant: "outline" },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
