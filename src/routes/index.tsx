import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Binoculars, Tent, Mountain, Sailboat, Users, Star, Shield, Leaf } from "lucide-react";
import { SiteLayout, SectionHeader } from "@/components/SiteLayout";
import hero from "@/assets/hero-savanna.jpg";
import serengeti from "@/assets/dest-serengeti.jpg";
import masai from "@/assets/dest-masai.jpg";
import kilimanjaro from "@/assets/dest-kilimanjaro.jpg";
import zanzibar from "@/assets/dest-zanzibar.jpg";
import camp from "@/assets/about-camp.jpg";
import lion from "@/assets/gallery-lion.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pla2Ride Tours and Safaris — Authentic East African Adventures" },
      { name: "description", content: "Tailor-made safaris and tours across Kenya, Tanzania, Uganda and Zanzibar. Game drives, Kilimanjaro treks, beach escapes and cultural journeys with expert local guides." },
      { property: "og:title", content: "Pla2Ride Tours and Safaris" },
      { property: "og:description", content: "Unforgettable East African journeys — built around you." },
      { property: "og:image", content: hero },
      { name: "twitter:image", content: hero },
    ],
  }),
  component: Index,
});

const experiences = [
  { icon: Binoculars, title: "Wildlife Safaris", text: "Track the Big Five across iconic parks and private conservancies." },
  { icon: Mountain, title: "Mountain Treks", text: "Summit Kilimanjaro, Mt Kenya and the Rwenzoris with seasoned guides." },
  { icon: Sailboat, title: "Beach & Island", text: "Unwind on Zanzibar's spice-island shores after the dust settles." },
  { icon: Users, title: "Cultural Journeys", text: "Meet Maasai, Samburu and Swahili communities on respectful visits." },
];

const destinations = [
  { slug: "serengeti", name: "Serengeti", country: "Tanzania", img: serengeti, tag: "Great Migration" },
  { slug: "masai-mara", name: "Maasai Mara", country: "Kenya", img: masai, tag: "Big Five" },
  { slug: "kilimanjaro", name: "Kilimanjaro", country: "Tanzania", img: kilimanjaro, tag: "Roof of Africa" },
  { slug: "zanzibar", name: "Zanzibar", country: "Tanzania", img: zanzibar, tag: "Spice Island" },
];

const testimonials = [
  { name: "Emma & James", from: "London, UK", quote: "From the moment we landed, every detail was handled. Our Mara guide spotted leopards twice in a single morning. Magical." },
  { name: "Sofia M.", from: "Madrid, Spain", quote: "Pla2Ride built us a 14-day Kenya–Tanzania route that felt entirely ours. The camps, the food, the people — flawless." },
  { name: "The Chen Family", from: "Singapore", quote: "Travelling with two kids, we needed pros. They were patient, safety-first and made it the trip of our lives." },
];

function Index() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[640px] flex items-center overflow-hidden">
        <img src={hero} alt="Elephants grazing in the savanna with Kilimanjaro at sunset" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, oklch(0.15 0.04 145 / 0.75) 0%, oklch(0.15 0.04 145 / 0.35) 55%, transparent 100%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 w-full text-white">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold">
              <span className="size-1.5 rounded-full bg-brand-gold animate-pulse" /> Est. East Africa
            </div>
            <h1 className="mt-6 font-display text-5xl sm:text-7xl font-semibold leading-[1.05] text-balance">
              Where the wild <span className="italic text-brand-gold">writes</span> your story.
            </h1>
            <p className="mt-6 text-lg text-white/85 max-w-xl leading-relaxed">
              Tailor-made safaris and tours across Kenya, Tanzania, Uganda and Zanzibar — crafted by
              local guides who know every track, river crossing and starlit camp.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/safaris" className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-green-deep shadow-gold hover:brightness-105 transition">
                Explore Safaris <ArrowRight className="size-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 backdrop-blur bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/15 transition">
                Design my trip
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: "12+", l: "Years guiding" },
                { n: "4.9★", l: "Guest rating" },
                { n: "1.8k", l: "Journeys crafted" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-semibold text-brand-gold">{s.n}</div>
                  <div className="text-xs uppercase tracking-widest text-white/70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="What we craft"
            title="Journeys built around what moves you"
            description="Pick a thread — wildlife, summits, shores or stories — and we'll weave it into a route that feels entirely yours."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((e) => (
              <div key={e.title} className="group relative bg-card border border-border rounded-2xl p-8 hover:border-brand-gold transition-all hover:-translate-y-1 shadow-soft">
                <div className="size-12 rounded-xl bg-brand-sand grid place-items-center text-brand-green-deep group-hover:bg-brand-gold transition">
                  <e.icon className="size-6" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-brand-green-deep">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-24 bg-brand-sand">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-xl">
              <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Iconic Destinations</div>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold text-brand-green-deep text-balance">
                Four corners of East Africa.
              </h2>
            </div>
            <Link to="/destinations" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green-deep hover:text-brand-gold">
              All destinations <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destinations.map((d, i) => (
              <Link
                to="/destinations"
                key={d.slug}
                className={`group relative overflow-hidden rounded-2xl shadow-soft ${i % 2 === 0 ? "lg:translate-y-6" : ""}`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={d.img} alt={d.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, oklch(0.15 0.04 145 / 0.85))" }} />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <div className="text-[10px] font-semibold tracking-[0.3em] uppercase text-brand-gold">{d.country}</div>
                  <div className="mt-1 font-display text-2xl font-semibold">{d.name}</div>
                  <div className="mt-1 text-xs text-white/80">{d.tag}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={camp} alt="Luxury safari tent under the milky way" loading="lazy" className="rounded-2xl shadow-soft w-full h-auto" />
            <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-card border border-border rounded-2xl p-6 shadow-gold max-w-[260px]">
              <div className="flex gap-0.5 text-brand-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">"A trip that rearranged what I thought travel could feel like."</p>
              <p className="mt-2 text-xs text-muted-foreground">— Aïcha D., Paris</p>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Our story</div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold text-brand-green-deep text-balance">
              Twelve years on the road, and still in love with the silence.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Pla2Ride was founded by a team of East African guides who wanted to do safaris properly —
              small groups, fair partnerships with local communities, and the time to actually
              <em> see</em> something. Today our drivers, trackers and trip designers craft journeys
              for travellers from every corner of the world.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { i: Shield, l: "Fully licensed & insured" },
                { i: Leaf, l: "Eco-certified camps" },
                { i: Tent, l: "24/7 trip support" },
              ].map((b) => (
                <div key={b.l} className="flex flex-col items-start gap-2">
                  <b.i className="size-5 text-brand-gold" />
                  <span className="text-sm font-medium text-foreground">{b.l}</span>
                </div>
              ))}
            </div>
            <Link to="/about" className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-brand-green-deep transition">
              More about us <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-savanna text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Guest Stories</div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold text-white text-balance">
              Travellers, in their own words.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <figure key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
                <div className="flex gap-0.5 text-brand-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-white/90 leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-6 text-sm">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-white/60">{t.from}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <img src={lion} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, oklch(0.22 0.05 145 / 0.92), oklch(0.22 0.05 145 / 0.55))" }} />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="max-w-2xl text-white">
            <h2 className="font-display text-4xl sm:text-6xl font-semibold text-balance">
              Your next chapter starts <span className="text-brand-gold">at dawn</span>.
            </h2>
            <p className="mt-6 text-lg text-white/85">
              Tell us what you dream of. We'll send a tailor-made proposal within 48 hours — no
              templates, no hard sell.
            </p>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-green-deep shadow-gold hover:brightness-105 transition">
              Start planning <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
