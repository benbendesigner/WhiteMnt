import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "lucide-react";

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
          Based in New England, we buy, sell and ship worldwide
        </p>
        <h1 className="text-4xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
          Used Wire
          <br />
          Processing
          <br />
          <span className="text-primary">Equipment</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/70 sm:text-lg">
          We buy and resell wire processing equipment — strippers, crimpers, and cutters from
          Komax, Schleuniger, Metzner, Carpenter, and more, ready to ship to shops anywhere in
          the world.
        </p>
        <div className="mt-8">
          <Button size="lg" render={<Link href="/inventory" />}>
            Browse inventory
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
