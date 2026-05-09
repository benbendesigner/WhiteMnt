import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchIcon } from "lucide-react";
import NewsletterSignup from "./NewsletterSignup";

export default function CTABanner() {
  return (
    <section className="border-y border-border bg-muted/40 px-4 py-14 sm:px-6">
      <div className="relative mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:gap-0">
        {/* Buying / Wanted */}
        <div className="flex flex-col items-center text-center md:items-start md:pr-16 md:text-left">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SearchIcon className="size-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Selling equipment?
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">
            We&apos;re Actively Buying
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;re always looking to purchase quality used wire processing equipment. Browse
            our wanted list — if you have something we&apos;re after, get in touch.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button render={<Link href="/wanted" />}>View Wanted List</Button>
            <Button variant="outline" render={<Link href="/contact" />}>Contact Us</Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border md:hidden" />
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border md:block" />

        {/* Newsletter */}
        <div className="md:pl-16">
          <NewsletterSignup inline />
        </div>
      </div>
    </section>
  );
}
