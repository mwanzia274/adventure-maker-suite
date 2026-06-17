import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Users, ArrowRight, Check } from "lucide-react";
import { SiteLayout, PageHero, SectionHeader } from "@/components/SiteLayout";
import camp from "@/assets/about-camp.jpg";
import hero from "@/assets/hero-savanna.jpg";
import { safaris } from "@/lib/safaris-data";

export const Route = createFileRoute("/safaris")({
  head: () => ({
    meta: [
      { title: "Kenya Safari Packages — Pla2Ride Tours and Safaris" },
      { name: "description", content: "Hand-picked Kenya safari itineraries — Masai Mara, Amboseli, Tsavo, Samburu, Lake Nakuru, Mt Kenya and Diani beach. Built by local guides." },
      { property: "og:title", content: "Kenya Safari Packages — Pla2Ride" },
      { property: "og:description", content: "Hand-picked Kenya safari itineraries by local guides." },
      { property: "og:image", content: hero },
    ],
  }),
  component: SafarisPage,
});

function SafarisPage() {
  return (
    <SiteLayout>
      <PageHero title="Kenya safaris, built for the way you travel." subtitle="Itineraries" image={camp} />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="Featured Journeys"
            title="Pick a route — or tell us yours."
            description="Every package is a starting point. Tweak the days, swap the camps, add a balloon ride or a beach finish. Your trip designer will make it real."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {safaris.map((s) => (
              <article key={s.slug} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:border-brand-gold transition">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-brand-gold text-brand-green-deep text-xs font-bold px-3 py-1.5 rounded-full">{s.price}</div>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-brand-gold" />{s.duration}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-brand-gold" />{s.location}</span>
                    <span className="flex items-center gap-1.5"><Users className="size-3.5 text-brand-gold" />{s.group}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-brand-green-deep">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-foreground">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2"><Check className="size-4 text-brand-gold shrink-0" />{h}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-5">
                    <Link
                      to="/safaris/$slug"
                      params={{ slug: s.slug }}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-green-deep transition"
                    >
                      View itinerary <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      to="/contact"
                      search={{ trip: s.title }}
                      className="text-sm font-semibold text-brand-green-deep hover:text-brand-gold"
                    >
                      Enquire now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}