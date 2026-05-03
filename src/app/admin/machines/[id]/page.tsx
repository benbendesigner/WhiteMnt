import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MachineForm from "@/components/admin/MachineForm";
import { getFormSuggestions } from "@/actions/suggestions";

export default async function EditMachinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [machine, suggestions] = await Promise.all([
    prisma.machine.findUnique({ where: { id: parseInt(id) } }),
    getFormSuggestions(),
  ]);
  if (!machine) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground">
        Edit: {machine.title}
      </h1>
      <MachineForm machine={machine} suggestions={suggestions} />
    </div>
  );
}
