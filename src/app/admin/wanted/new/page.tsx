import WantedForm from "@/components/admin/WantedForm";

export default function NewWantedPage() {
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-xl font-bold tracking-tight text-foreground">Add wanted item</h1>
      <WantedForm />
    </div>
  );
}
