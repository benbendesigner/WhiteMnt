import MachineForm from "@/components/admin/MachineForm";
import { getFormSuggestions } from "@/actions/suggestions";

export default async function NewMachinePage() {
  const suggestions = await getFormSuggestions();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground">New listing</h1>
      <MachineForm suggestions={suggestions} />
    </div>
  );
}
