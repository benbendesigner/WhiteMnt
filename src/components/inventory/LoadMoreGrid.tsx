"use client";

import { useState } from "react";
import MachineCard from "./MachineCard";
import type { MachineCardData } from "@/types";

export default function LoadMoreGrid({
  machines,
  initialCount,
}: {
  machines: MachineCardData[];
  initialCount: number;
}) {
  const [showAll, setShowAll] = useState(false);

  if (machines.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">No machines found</p>
        <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  const visible = showAll ? machines : machines.slice(0, initialCount);
  const remaining = machines.length - initialCount;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((m) => (
          <MachineCard key={m.id} machine={m} />
        ))}
      </div>

      {!showAll && remaining > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll(true)}
            className="rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            See {remaining} more {remaining === 1 ? "item" : "items"}
          </button>
        </div>
      )}
    </div>
  );
}
