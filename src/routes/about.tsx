import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Leaf, Heart, Award, ArrowRight } from "lucide-react";
import { SiteLayout, PageHero, SectionHeader } from "@/components/SiteLayout";
import camp from "@/assets/about-camp.jpg";
import maasai from "@/assets/gallery-maasai.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Pla2Ride Tours and Safaris" },
      { name: "description", content: "Locally owned safari operator with 12+ years of experience crafting authentic East African journeys." },
      { property: "og:title", content: "About — Pla2Ride Tours and Safaris" },
      { property: "og:description", content: "Locally owned. Expertly guided. Built on respect." },
      { property: "og:image", content: camp },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Heart, title: "Locally rooted", text: "Born and based in East Africa, owned and run by the people who guide you." },
  { icon: Leaf, title: "Low-impact travel", text: "We work only with camps that protect wildlife and reinvest in local communities." },
  { icon: Shield, title: "Safety as standard", text: "Fully licensed, insured, and trained for everything from game drives to summits." },
  { icon: Award, title: "Detail obsessed", text: "From the welcome drink to the airport farewell, every moment is choreographed." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero title="A safari company shaped by the people who guide it." subtitle="About us" image={maasai} />

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Our story</div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold text-brand-green-deep text-balance">
            We grew up in this landscape. We've spent twelve years sharing it well.
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-10 text-muted-foreground leading-relaxed">
            <p>
              Pla2Ride Tours and Safaris was founded by a small team of Kenyan and Tanzanian guides who
              were tired of seeing visitors hurried through the parks. We started with one Land
              Cruiser, a hand-drawn map of the Mara and a stubborn belief that a proper safari needs
              time, silence, and a guide who knows what to look for.
            </p>
            <p>
              Today we run tailor-made journeys across Kenya, Tanzania, Uganda, Rwanda and Zanzibar.
              We partner with eco-certified camps, train and employ locally, and donate a portion
              of every trip to wildlife conservation. The road has been long, beautiful, and almost
              always at first light.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-sand">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader eyebrow="What we stand for" title="Four promises we keep on every trip." />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-8 shadow-soft">
                <v.icon className="size-7 text-brand-gold" />
                <h3 className="mt-5 font-display text-xl font-semibold text-brand-green-deep">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-4 gap-8 text-center">
          {[
            { n: "12+", l: "Years operating" },
            { n: "1,800", l: "Guests guided" },
            { n: "27", l: "Local team members" },
            { n: "4.9★", l: "Average rating" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-5xl font-semibold text-brand-green-deep">{s.n}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-savanna text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-balance">Let's plan something extraordinary.</h2>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-green-deep hover:brightness-105 transition">
            Get in touch <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}