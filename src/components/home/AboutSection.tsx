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
              About the owner
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Alan Sorensen
            </h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">Owner</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              As a hands-on owner and technician, I provide the attentive, old-fashioned service
              that is increasingly hard to find. Before founding White Mountain Representatives,
              I served as Sales Manager and Technical Advisor at Carpenter Mfg., where I partnered
              with customers worldwide to solve processing challenges and develop practical solutions.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Today, I bring that same responsive, knowledgeable, and friendly service to customers
              throughout New England and beyond, supported by a broader range of products and
              services. My top priority is to understand your company&apos;s needs, work as your
              partner, and help you succeed.
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
