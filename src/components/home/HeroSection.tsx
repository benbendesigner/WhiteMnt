import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, PhoneIcon, MailIcon } from "lucide-react";
import { CONTACT_PHONE, CONTACT_EMAIL } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-foreground px-4 py-24 text-background sm:px-6 sm:py-32">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Orange rule */}
      <div className="absolute left-0 top-0 h-1 w-full bg-primary" />

      <div className="relative mx-auto max-w-4xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          New England &mdash; Shipping Nationwide
        </p>
        <h1 className="text-4xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
          Used Wire
          <br />
          Processing
          <br />
          <span className="text-primary">Equipment</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/70 sm:text-lg">
          We buy, inspect, and resell wire processing machinery — strippers, crimpers, and cutters
          from Komax, Schleuniger, Metzner, and more. Every machine is tested before it ships.
          Based in New England, we've shipped to shops across the country.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" render={<Link href="/inventory" />}>
            Browse inventory
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            render={<a href={`tel:${CONTACT_PHONE}`} />}
          >
            <PhoneIcon className="size-4" />
            {CONTACT_PHONE}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            render={<a href={`mailto:${CONTACT_EMAIL}`} />}
          >
            <MailIcon className="size-4" />
            {CONTACT_EMAIL}
          </Button>
        </div>
      </div>
    </section>
  );
}
