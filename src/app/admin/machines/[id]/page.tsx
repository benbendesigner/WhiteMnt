import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MachineForm from "@/components/admin/MachineForm";
import MachineSales, { type SaleRow } from "@/components/admin/MachineSales";
import { getFormSuggestions } from "@/actions/suggestions";

export default async function EditMachinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const machineId = parseInt(id);
  const [machine, suggestions, sales] = await Promise.all([
    prisma.machine.findUnique({ where: { id: machineId } }),
    getFormSuggestions(),
    prisma.sale.findMany({ where: { machineId }, orderBy: { soldAt: "desc" } }),
  ]);
  if (!machine) notFound();

  const saleRows: SaleRow[] = sales.map((s) => ({
    id: s.id,
    quantity: s.quantity,
    salePrice: s.salePrice !== null ? Number(s.salePrice) : null,
    buyerName: s.buyerName,
    buyerEmail: s.buyerEmail,
    notes: s.notes,
    soldAt: s.soldAt.toISOString(),
  }));

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Edit: {machine.title}
      </h1>

      <MachineSales machine={machine} sales={saleRows} />

      <MachineForm machine={machine} suggestions={suggestions} />
    </div>
  );
}
