import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { stat: "30+", label: "Years Experience" },
  { stat: "200+", label: "Machines Sold" },
  { stat: "50+", label: "States Shipped To" },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-background px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Who we are
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              New England's Wire Processing Specialists
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We are two industry veterans based in New England who spent decades running wire
              processing equipment in production environments. After years of hands-on work with
              machines from Komax, Schleuniger, Metzner, Artos, and others, we started buying
              and reselling the equipment we know best.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Unlike general machinery dealers, we specialize exclusively in wire processing.
              We know what to look for, what the common failure points are, and how to get a
              machine back to reliable condition before it ships — whether you're down the road
              in New England or across the country.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {stats.map((item) => (
                <Card key={item.label} className="border-foreground/10 text-center">
                  <CardContent className="py-4">
                    <p className="text-2xl font-black text-primary">{item.stat}</p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                      {item.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground ring-1 ring-border">
            Photo of owners / shop
          </div>
        </div>
      </div>
    </section>
  );
}
