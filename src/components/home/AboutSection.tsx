import Image from "next/image";

const people = [
  {
    name: "Martin Kenner",
    title: "President, Commission Brokers Inc.",
    photo: "/marty-kenner.jpg",
    photoAlt: "Martin Kenner, President of Commission Brokers Inc.",
    photoPosition: "object-[72%_center]",
    bio: [
      "With over 55 years of direct experience in the wire, cable, braiding, and wire harness industries, Martin Kenner provides expert machinery brokering, appraisals, and plant liquidations. Since 1969, he has partnered with corporations, financial institutions, and bankruptcy courts to establish equipment values, manage plant sales, and facilitate direct customer-to-customer equipment brokering worldwide.",
      "A Lifetime Member of the Wire Association International and recipient of the 2004 Charles D. Scott Distinguished Career Award, Martin combines deep technical market knowledge with comprehensive consignment and rebuilding services to support clients across the industry.",
    ],
    contact: {
      phone: "401-943-3777",
      mobile: "401-225-3777",
      email: "marty137@aol.com",
      web: "commissionbrokers.com",
    },
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
    contact: {
      mobile: "315-391-2534",
      email: "whitemtnrep@gmail.com",
    },
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

        <div className="mt-12 space-y-20">
          {people.map((person, idx) => (
            <div
              key={person.name}
              className="grid items-start gap-10 md:grid-cols-5"
            >
              <div
                className={`relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl ring-1 ring-border md:col-span-2 ${
                  idx % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={person.photo}
                  alt={person.photoAlt}
                  fill
                  sizes="(min-width: 768px) 40vw, 384px"
                  className={`object-cover ${person.photoPosition}`}
                />
              </div>

              <div className="md:col-span-3">
                <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-primary">{person.title}</p>
                {person.bio.map((para, i) => (
                  <p key={i} className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {para}
                  </p>
                ))}
                <div className="mt-6 space-y-1 text-sm text-muted-foreground">
                  {"phone" in person.contact && (
                    <p>
                      <span className="font-medium text-foreground">Phone:</span>{" "}
                      <a href={`tel:${person.contact.phone}`} className="hover:text-primary">
                        {person.contact.phone}
                      </a>
                    </p>
                  )}
                  {"mobile" in person.contact && (
                    <p>
                      <span className="font-medium text-foreground">Mobile:</span>{" "}
                      <a href={`tel:${person.contact.mobile}`} className="hover:text-primary">
                        {person.contact.mobile}
                      </a>
                    </p>
                  )}
                  {"email" in person.contact && (
                    <p>
                      <span className="font-medium text-foreground">Email:</span>{" "}
                      <a href={`mailto:${person.contact.email}`} className="hover:text-primary">
                        {person.contact.email}
                      </a>
                    </p>
                  )}
                  {"web" in person.contact && (
                    <p>
                      <span className="font-medium text-foreground">Web:</span>{" "}
                      <a
                        href={`https://${person.contact.web}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {person.contact.web}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
