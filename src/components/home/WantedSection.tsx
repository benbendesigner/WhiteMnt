import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchIcon } from "lucide-react";

export default function WantedSection() {
  return (
    <section className="border-y border-border bg-muted/40 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SearchIcon className="size-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Selling equipment?
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">
          We&apos;re Actively Buying
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          We&apos;re always looking to purchase quality used wire processing equipment. Browse our
          wanted list — if you have something we&apos;re after, get in touch.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button render={<Link href="/wanted" />}>View Wanted List</Button>
          <Button variant="outline" render={<Link href="/contact" />}>Contact Us</Button>
        </div>
      </div>
    </section>
  );
}
