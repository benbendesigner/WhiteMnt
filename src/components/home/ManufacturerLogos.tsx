const manufacturers = [
  { name: "Komax",        detail: "Wire Processing" },
  { name: "Schleuniger",  detail: "Stripping & Cutting" },
  { name: "Metzner",      detail: "Cutting Systems" },
  { name: "Artos",        detail: "Wire Processing" },
  { name: "Carpenter",    detail: "Mfg. Co." },
  { name: "Eraser",       detail: "Wire Prep" },
  { name: "Mecal",        detail: "Crimping" },
  { name: "Spectrum",     detail: "Technologies" },
  { name: "Laselec",      detail: "Laser Marking" },
  { name: "Cirris",       detail: "Test Systems" },
];

// Duplicate the list so the marquee loops seamlessly
const items = [...manufacturers, ...manufacturers];

export default function ManufacturerLogos() {
  return (
    <section className="border-y border-border bg-muted/40 py-10 overflow-hidden">
      <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Equipment we buy &amp; sell
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-muted/40 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-muted/40 to-transparent" />

        <div
          className="flex w-max gap-10"
          style={{ animation: "marquee 32s linear infinite" }}
        >
          {items.map((mfg, i) => (
            <div
              key={i}
              className="flex w-40 flex-shrink-0 flex-col items-center justify-center gap-0.5 select-none"
            >
              <span className="text-lg font-black tracking-tight text-foreground/70">
                {mfg.name}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                {mfg.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
