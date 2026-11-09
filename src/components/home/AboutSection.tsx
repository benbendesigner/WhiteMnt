import Image from "next/image";
import { GlobeIcon, MailIcon, PhoneIcon, SmartphoneIcon, type LucideIcon } from "lucide-react";

type Contact = { icon: LucideIcon; label: string; value: string; href: string; external?: boolean };

const phone = (label: string, number: string, icon: LucideIcon = PhoneIcon): Contact => ({
  icon,
  label,
  value: number,
  href: `tel:+1${number.replace(/\D/g, "")}`,
});

const email = (address: string): Contact => ({
  icon: MailIcon,
  label: "Email",
  value: address,
  href: `mailto:${address}`,
});

const website = (domain: string): Contact => ({
  icon: GlobeIcon,
  label: "Web",
  value: domain,
  href: `https://${domain}`,
  external: true,
});

const people = [
  {
    name: "Martin Kenner",
    title: "President, Commission Brokers Inc.",
    photo: "/marty-kenner.jpg",
    photoAlt: "Martin Kenner at the Commission Brokers trade show booth",
    photoPosition: "object-[72%_center]",
    bio: [
      "With over 55 years of direct experience in the wire, cable, braiding, and wire harness industries, Martin Kenner provides expert machinery brokering, appraisals, and plant liquidations. Since 1969, he has partnered with corporations, financial institutions, and bankruptcy courts to establish equipment values, manage plant sales, and facilitate direct customer-to-customer equipment brokering worldwide.",
      "A Lifetime Member of the Wire Association International and recipient of the 2004 Charles D. Scott Distinguished Career Award, Martin combines deep technical market knowledge with comprehensive consignment and rebuilding services to support clients across the industry.",
    ],
    contacts: [
      phone("Office", "401-943-3777"),
      phone("Mobile", "401-225-3777", SmartphoneIcon),
      email("marty137@aol.com"),
      website("commissionbrokers.com"),
    ],
  },
  {
    name: "Alan Sorensen",
    title: "Owner & Technical Advisor, White Mountain Representatives",
    photo: "/alan-sorensen-new.jpg",
    photoAlt: "Alan Sorensen, owner of White Mountain Representatives",
    photoPosition: "object-top",
    bio: [
      "As a hands-on owner and technician, Alan Sorensen provides the attentive, old-fashioned service that is increasingly hard to find in today's market. Before founding White Mountain Representatives, he served as Sales Manager and Technical Advisor at Carpenter Mfg., partnering with customers worldwide to solve complex wire processing challenges and develop practical equipment solutions.",
      "Today, Alan brings that same responsive, knowledgeable, and dedicated service to wire assembly operations throughout New England and beyond. Supported by an expanded portfolio of machinery, parts, and brokering services, his top priority is to understand each client's specific production needs, act as a trusted technical partner, and help their business succeed.",
    ],
    contacts: [
      phone("Mobile", "315-391-2534", SmartphoneIcon),
      email("whitemtnrep@gmail.com"),
      website("www.whitemtnrep.com"),
    ],
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-background px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Who we are
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          About Us
        </h2>

        <div className="mt-12 divide-y divide-border">
          {people.map((person) => (
            <article
              key={person.name}
              className="grid items-start gap-8 py-12 first:pt-0 last:pb-0 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14"
            >
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl ring-1 ring-border md:mx-0 md:max-w-none">
                <Image
                  src={person.photo}
                  alt={person.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 352px, (min-width: 768px) 256px, 384px"
                  className={`object-cover ${person.photoPosition}`}
                />
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary">{person.title}</p>
                {person.bio.map((para, i) => (
                  <p key={i} className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {para}
                  </p>
                ))}

                <ul className="mt-6 grid gap-x-6 gap-y-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
                  {person.contacts.map((c) => (
                    <li key={c.href}>
                      <a
                        href={c.href}
                        {...(c.external && { target: "_blank", rel: "noopener noreferrer" })}
                        className="group flex items-center gap-3"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <c.icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-muted-foreground">{c.label}</span>
                          <span className="block truncate font-medium text-foreground underline-offset-4 group-hover:text-primary group-hover:underline">
                            {c.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
