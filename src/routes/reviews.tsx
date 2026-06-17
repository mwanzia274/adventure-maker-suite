import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Quote, ArrowRight } from "lucide-react";
import { SiteLayout, PageHero, SectionHeader } from "@/components/SiteLayout";
import maasai from "@/assets/gallery-maasai.jpg";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Pla2Ride Tours and Safaris (4.9★ on TripAdvisor)" },
      { name: "description", content: "Read what travellers say about their Kenya safari with Pla2Ride — rated 4.9/5 across 380+ TripAdvisor reviews." },
      { property: "og:title", content: "Reviews — Pla2Ride Kenya Safaris" },
      { property: "og:description", content: "Rated 4.9/5 across 380+ TripAdvisor reviews." },
      { property: "og:image", content: maasai },
    ],
  }),
  component: ReviewsPage,
});

const reviews = [
  { name: "Emma & James", from: "London, UK", trip: "Masai Mara Classic", rating: 5, date: "Aug 2026", quote: "From the moment we landed at JKIA, every detail was handled. Our Mara guide spotted leopards twice in a single morning. The camp was beautiful and the food was incredible. Magical week." },
  { name: "Sofia Martínez", from: "Madrid, Spain", trip: "Big Five Grand Circuit", rating: 5, date: "Jul 2026", quote: "Pla2Ride built us an 8-day Kenya route that felt entirely ours. The camps in Amboseli, Nakuru and the Mara were spot-on. Daniel, our guide, made it." },
  { name: "The Chen Family", from: "Singapore", trip: "Amboseli & Mara family safari", rating: 5, date: "Jun 2026", quote: "Travelling with two kids (8 & 11), we needed pros. They were patient, safety-first and made it the trip of our lives. Both kids now want to be rangers." },
  { name: "Aïcha Diallo", from: "Paris, France", trip: "Samburu Wilderness", rating: 5, date: "May 2026", quote: "Samburu in May was empty and stunning. We saw all the Samburu Special Five and the riverside lodge was a dream. A trip that rearranged what I thought travel could feel like." },
  { name: "Mark & Priya", from: "Toronto, Canada", trip: "Mt Kenya Sirimon Trek", rating: 5, date: "Feb 2026", quote: "Summited Point Lenana at sunrise — our guide Joseph and the whole crew were superb. Pacing, food and acclimatisation were perfect." },
  { name: "Hiroshi Tanaka", from: "Tokyo, Japan", trip: "Tsavo East & West", rating: 5, date: "Mar 2026", quote: "Tsavo is raw, vast and wonderfully empty. We had the red elephants almost to ourselves. Excellent driving and beautiful lodges." },
  { name: "Olivia & Tom", from: "Sydney, Australia", trip: "Diani Coastal Escape", rating: 5, date: "Jan 2026", quote: "After 7 nights of safari we collapsed into Diani. The Wasini dhow day was a total highlight — snorkelling with dolphins, fresh seafood on the island." },
  { name: "Lukas Müller", from: "Berlin, Germany", trip: "Lake Nakuru Flamingo Safari", rating: 5, date: "Sep 2026", quote: "Short, sharp and brilliant. Saw both white and black rhino on the same morning. Easy add-on to a longer trip." },
  { name: "Rachel & Amir", from: "Tel Aviv, Israel", trip: "Masai Mara honeymoon", rating: 5, date: "Oct 2025", quote: "They surprised us with a private bush dinner under the stars. Perfect honeymoon — we couldn't recommend Pla2Ride more highly." },
];

const stats = [
  { n: "4.9★", l: "Average rating" },
  { n: "380+", l: "TripAdvisor reviews" },
  { n: "98%", l: "Would recommend" },
  { n: "1.8k", l: "Journeys crafted" },
];

function ReviewsPage() {
  return (
    <SiteLayout>
      <PageHero title="Travellers, in their own words." subtitle="Reviews" image={maasai} />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="Guest Stories"
            title="Rated 4.9 on TripAdvisor."
            description="Real reviews from travellers who explored Kenya with us. Verified through TripAdvisor, Google and our own post-trip questionnaire."
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.l} className="text-center bg-brand-sand rounded-2xl py-8">
                <div className="font-display text-4xl font-semibold text-brand-green-deep">{s.n}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-brand-gold font-semibold">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <figure key={r.name + r.trip} className="bg-card border border-border rounded-2xl p-7 shadow-soft flex flex-col">
                <Quote className="size-7 text-brand-gold/60" />
                <div className="mt-3 flex gap-0.5 text-brand-gold">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="size-4 fill-current" />)}
                </div>
                <blockquote className="mt-4 text-foreground leading-relaxed flex-1">"{r.quote}"</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-border">
                  <div className="font-semibold text-brand-green-deep">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.from} · {r.date}</div>
                  <div className="mt-1 text-xs text-brand-gold font-semibold uppercase tracking-widest">{r.trip}</div>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href="https://www.tripadvisor.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 px-6 py-3 text-sm font-semibold text-brand-green-deep hover:bg-brand-sand transition"
            >
              Read all reviews on TripAdvisor <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-savanna text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-balance">Ready to write your own?</h2>
          <p className="mt-5 text-white/85">Tell us where in Kenya you'd like to go. We'll send a tailor-made proposal within 48 hours.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-green-deep shadow-gold hover:brightness-105 transition">
            Start planning <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}