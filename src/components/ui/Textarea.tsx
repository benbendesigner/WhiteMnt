import * as React from "react"
import { Label } from "./label"
import { cn } from "@/lib/utils"

function TextareaBase({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-[80px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none resize-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className, ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}
      <TextareaBase
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={className}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
})

export { Textarea, TextareaBase }
