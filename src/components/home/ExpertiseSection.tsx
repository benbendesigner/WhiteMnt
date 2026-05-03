import { Card, CardContent } from "@/components/ui/card";
import {
  SearchIcon,
  WrenchIcon,
  CheckCircleIcon,
  PackageIcon,
  FileTextIcon,
  HeadphonesIcon,
} from "lucide-react";

const cards = [
  {
    Icon: SearchIcon,
    title: "Thorough Inspection",
    body: "Every machine is fully inspected before listing. We test electrical systems, mechanical components, tooling, and software to identify any issues upfront.",
  },
  {
    Icon: WrenchIcon,
    title: "Service & Repair",
    body: "We repair what needs to be fixed. Worn blades, faulty sensors, bad actuators — we source and replace OEM and compatible parts before machines are sold.",
  },
  {
    Icon: CheckCircleIcon,
    title: "Tested & Verified",
    body: "Machines are run through production test cycles with real wire samples before shipping. If it doesn't pass our test, it doesn't leave our shop.",
  },
  {
    Icon: PackageIcon,
    title: "Nationwide Shipping",
    body: "We crate and ship equipment from New England to anywhere in the country. We work with freight carriers experienced in industrial machinery.",
  },
  {
    Icon: FileTextIcon,
    title: "Documentation",
    body: "Where available, we include original manuals, tooling charts, and service history. We can often source documentation for older machines.",
  },
  {
    Icon: HeadphonesIcon,
    title: "Post-Sale Support",
    body: "Have a question after delivery? We're reachable. We stand behind what we sell and are happy to help with installation, setup, or troubleshooting.",
  },
];

export default function ExpertiseSection() {
  return (
    <section id="expertise" className="bg-foreground px-4 py-20 text-background sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Why buy from us
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            We Know These Machines
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60">
            We don&apos;t flip equipment blind. Every machine we buy gets our full attention
            before it&apos;s offered for sale — and every order ships with our guarantee.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ Icon, title, body }) => (
            <Card key={title} className="border-white/10 bg-white/5 text-background">
              <CardContent className="pt-5">
                <div className="flex size-10 items-center justify-center rounded-md bg-primary/20 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
