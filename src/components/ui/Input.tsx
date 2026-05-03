import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Label } from "./label"
import { cn } from "@/lib/utils"

/* ─── Base input (ShadCN primitive) ────────────────────── */
function InputBase({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

/* ─── Labeled field wrapper (used by forms) ─────────────── */
interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}
      <InputBase
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={className}
        {...props}
      />
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
})

export { Input, InputBase }
