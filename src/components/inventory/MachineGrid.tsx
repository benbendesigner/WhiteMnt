import MachineCard from "./MachineCard";
import type { MachineCardData } from "@/types";

export default function MachineGrid({ machines }: { machines: MachineCardData[] }) {
  if (machines.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">No machines found</p>
        <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {machines.map((m) => (
        <MachineCard key={m.id} machine={m} />
      ))}
    </div>
  );
}
