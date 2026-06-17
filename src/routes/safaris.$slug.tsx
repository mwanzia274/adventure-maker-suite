import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, MapPin, Users, X, ChevronLeft, Star } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { getSafari, safaris, type Safari } from "@/lib/safaris-data";

export const Route = createFileRoute("/safaris/$slug")({
  loader: ({ params }) => {
    const safari = getSafari(params.slug);
    if (!safari) throw notFound();
    return { safari };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.safari;
    if (!s) return { meta: [{ title: "Safari — Pla2Ride" }] };
    return {
      meta: [
        { title: `${s.title} (${s.duration}) — Pla2Ride Kenya Safaris` },
        { name: "description", content: s.desc },
        { property: "og:title", content: `${s.title} — Pla2Ride` },
        { property: "og:description", content: s.desc },
        { property: "og:image", content: s.img },
        { name: "twitter:image", content: s.img },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-5xl text-brand-green-deep">Safari not found</h1>
        <p className="mt-4 text-muted-foreground">That itinerary may have moved.</p>
        <Link to="/safaris" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-primary-foreground">
          <ChevronLeft className="size-4" /> Back to all safaris
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error, reset }) => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-display text-4xl text-brand-green-deep">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-primary-foreground">Try again</button>
      </div>
    </SiteLayout>
  ),
  component: SafariDetailPage,
});

function SafariDetailPage() {
  const { safari } = Route.useLoaderData() as { safari: Safari };
  const others = safaris.filter((s) => s.slug !== safari.slug).slice(0, 3);
  return (
    <SiteLayout>
      <section className="relative h-[68vh] min-h-[480px] flex items-end overflow-hidden">
        <img src={safari.img} alt={safari.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.15 0.04 145 / 0.25), oklch(0.15 0.04 145 / 0.9))" }} />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 text-white w-full">
          <Link to="/safaris" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-brand-gold hover:text-white">
            <ChevronLeft className="size-3.5" /> All safaris
          </Link>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-semibold max-w-3xl text-balance">{safari.title}</h1>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/90">
            <span className="flex items-center gap-2"><Clock className="size-4 text-brand-gold" />{safari.duration}</span>
            <span className="flex items-center gap-2"><MapPin className="size-4 text-brand-gold" />{safari.location}</span>
            <span className="flex items-center gap-2"><Users className="size-4 text-brand-gold" />{safari.group}</span>
            <span className="rounded-full bg-brand-gold text-brand-green-deep font-bold px-3 py-1 text-xs">{safari.price}</span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Overview</div>
              <p className="mt-4 text-lg text-foreground leading-relaxed">{safari.long}</p>
            </div>

            <div>
              <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Day by day</div>
              <h2 className="mt-3 font-display text-3xl font-semibold text-brand-green-deep">Your itinerary</h2>
              <ol className="mt-8 space-y-6 border-l-2 border-brand-gold/30 pl-6">
                {safari.itinerary.map((d) => (
                  <li key={d.day} className="relative">
                    <span className="absolute -left-[33px] top-1.5 size-4 rounded-full bg-brand-gold border-4 border-background" />
                    <div className="text-xs font-bold tracking-widest text-brand-gold uppercase">{d.day}</div>
                    <h3 className="mt-1 font-display text-xl font-semibold text-brand-green-deep">{d.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{d.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-brand-sand rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold text-brand-green-deep">What's included</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {safari.includes.map((i) => (
                    <li key={i} className="flex gap-2"><Check className="size-4 text-brand-green shrink-0 mt-0.5" />{i}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold text-brand-green-deep">Not included</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {safari.excludes.map((i) => (
                    <li key={i} className="flex gap-2"><X className="size-4 text-muted-foreground shrink-0 mt-0.5" />{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-card border border-border rounded-2xl p-8 shadow-soft">
              <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Enquire</div>
              <h3 className="mt-3 font-display text-2xl font-semibold text-brand-green-deep">Make this trip yours</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Prices from <strong className="text-brand-green-deep">{safari.price}</strong> per person, sharing. Final quote depends on season, group size and camp choice.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {safari.highlights.map((h) => (
                  <li key={h} className="flex gap-2"><Check className="size-4 text-brand-gold shrink-0 mt-0.5" />{h}</li>
                ))}
              </ul>
              <Link
                to="/contact"
                search={{ trip: safari.title }}
                className="mt-6 inline-flex w-full justify-center items-center gap-2 rounded-full bg-brand-green px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-brand-green-deep transition"
              >
                Enquire about this safari <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full justify-center items-center gap-2 rounded-full border border-brand-green/30 px-6 py-3 text-sm font-semibold text-brand-green-deep hover:bg-brand-sand transition"
              >
                WhatsApp our trip designer
              </a>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex gap-0.5 text-brand-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}
                </div>
                Rated 4.9/5 across 380+ TripAdvisor reviews
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-20 bg-brand-sand">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-green-deep">Other Kenya safaris</h2>
            <Link to="/safaris" className="text-sm font-semibold text-brand-green-deep hover:text-brand-gold">All safaris →</Link>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {others.map((s) => (
              <Link key={s.slug} to="/safaris/$slug" params={{ slug: s.slug }} className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-brand-gold transition">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="text-xs text-muted-foreground">{s.duration} · {s.location}</div>
                  <div className="mt-1 font-display text-lg font-semibold text-brand-green-deep">{s.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}