import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Users, ArrowRight, Check, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout, PageHero, SectionHeader } from "@/components/SiteLayout";
import camp from "@/assets/about-camp.jpg";
import hero from "@/assets/hero-savanna.jpg";
import { safaris } from "@/lib/safaris-data";

export const Route = createFileRoute("/safaris/")({
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

const CATEGORIES = ["All", "Day Trip", "Short Safari", "Classic Safari", "Hiking", "Beach", "City Experience"] as const;
const DURATIONS = [
  { label: "Any length", min: 0, max: 99 },
  { label: "Day trips", min: 1, max: 1 },
  { label: "2–3 days", min: 2, max: 3 },
  { label: "4–6 days", min: 4, max: 6 },
  { label: "7+ days", min: 7, max: 99 },
] as const;

function SafarisPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [duration, setDuration] = useState(0);

  const filtered = useMemo(() => {
    const d = DURATIONS[duration];
    const q = query.trim().toLowerCase();
    return safaris.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (s.days < d.min || s.days > d.max) return false;
      if (q && !(`${s.title} ${s.location} ${s.desc}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [query, category, duration]);

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

          <div className="mt-12 bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold">
              <SlidersHorizontal className="size-3.5" /> Filter safaris
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
              <label className="relative block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Mara, Amboseli, Naivasha…"
                  className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                />
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
                className="rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
                ))}
              </select>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
              >
                {DURATIONS.map((d, i) => (
                  <option key={d.label} value={i}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition ${
                    category === c
                      ? "bg-brand-green text-primary-foreground border-brand-green"
                      : "border-border text-muted-foreground hover:border-brand-gold hover:text-brand-green-deep"
                  }`}
                >
                  {c}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">
                Showing <strong className="text-brand-green-deep">{filtered.length}</strong> of {safaris.length} tours
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-16 text-center py-16 border border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground">No tours match those filters. Try widening your search.</p>
              <button
                onClick={() => { setQuery(""); setCategory("All"); setDuration(0); }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Reset filters
              </button>
            </div>
          ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {filtered.map((s) => (
              <article key={s.slug} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:border-brand-gold transition">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-brand-gold text-brand-green-deep text-xs font-bold px-3 py-1.5 rounded-full">{s.price}</div>
                  <div className="absolute top-4 left-4 bg-brand-green-deep/85 text-primary-foreground text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full">{s.category}</div>
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
                      Book / Enquire
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}