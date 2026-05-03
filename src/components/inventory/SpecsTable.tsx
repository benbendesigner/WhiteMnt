export default function SpecsTable({ specs }: { specs: unknown }) {
  if (!specs || typeof specs !== "object") return null;

  const entries = Object.entries(specs as Record<string, unknown>).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );

  if (entries.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? "bg-muted/40" : "bg-background"}>
              <td className="w-2/5 px-4 py-2.5 font-medium capitalize text-foreground">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </td>
              <td className="px-4 py-2.5 text-foreground/80">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
