import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WantedForm from "@/components/admin/WantedForm";

export default async function EditWantedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.wantedItem.findUnique({ where: { id: parseInt(id) } });
  if (!item) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground">Edit: {item.title}</h1>
      <WantedForm item={item} />
    </div>
  );
}
