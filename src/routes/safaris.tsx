import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Users, ArrowRight, Check } from "lucide-react";
import { SiteLayout, PageHero, SectionHeader } from "@/components/SiteLayout";
import serengeti from "@/assets/dest-serengeti.jpg";
import masai from "@/assets/dest-masai.jpg";
import kilimanjaro from "@/assets/dest-kilimanjaro.jpg";
import zanzibar from "@/assets/dest-zanzibar.jpg";
import camp from "@/assets/about-camp.jpg";
import balloon from "@/assets/gallery-balloon.jpg";
import hero from "@/assets/hero-savanna.jpg";

export const Route = createFileRoute("/safaris")({
  head: () => ({
    meta: [
      { title: "Safari Packages — Pla2Ride Tours and Safaris" },
      { name: "description", content: "Hand-picked safari itineraries across Kenya, Tanzania, Uganda and Rwanda. From 3-day classic getaways to 14-day grand circuits." },
      { property: "og:title", content: "Safari Packages — Pla2Ride" },
      { property: "og:description", content: "Hand-picked safari itineraries across East Africa." },
      { property: "og:image", content: hero },
    ],
  }),
  component: SafarisPage,
});

const safaris = [
  { title: "Masai Mara Classic", duration: "4 Days", group: "2–6 guests", location: "Kenya", price: "from $1,290", img: masai, desc: "Wildlife at its rawest. Lion prides, leopards in the fig trees, and sunset game drives across the Mara plains.", highlights: ["Daily game drives", "Mid-range tented camp", "Maasai village visit", "Airport transfers"] },
  { title: "Serengeti & Ngorongoro Grand", duration: "7 Days", group: "2–6 guests", location: "Tanzania", price: "from $2,450", img: serengeti, desc: "Chase the Great Migration through the Serengeti, then descend into the crater for the highest density of wildlife on Earth.", highlights: ["Migration tracking", "Crater floor drive", "Luxury safari lodge", "Bush breakfast"] },
  { title: "Kilimanjaro Machame Trek", duration: "8 Days", group: "2–10 climbers", location: "Tanzania", price: "from $2,150", img: kilimanjaro, desc: "The whisky route to Uhuru Peak. Seven days through five climate zones with seasoned summit guides and full crew.", highlights: ["Machame route", "Certified guides", "All camp gear", "Summit certificate"] },
  { title: "Zanzibar Spice & Sands", duration: "5 Days", group: "2–8 guests", location: "Zanzibar", price: "from $980", img: zanzibar, desc: "Slow mornings on white sand, spice farm walks through Stone Town, and dhow sails into the Indian Ocean sunset.", highlights: ["Beachfront stay", "Stone Town tour", "Spice farm visit", "Sunset dhow cruise"] },
  { title: "Kenya–Tanzania Big Circuit", duration: "14 Days", group: "2–6 guests", location: "Kenya · Tanzania", price: "from $4,890", img: hero, desc: "The grand tour: Amboseli, Mara, Serengeti, Ngorongoro and a Zanzibar finish. Everything you came to East Africa for.", highlights: ["5 national parks", "Domestic flights", "All meals included", "Private 4×4"] },
  { title: "Balloon Safari & Bush Camp", duration: "3 Days", group: "2–4 guests", location: "Serengeti", price: "from $1,690", img: balloon, desc: "Drift over the plains at sunrise, champagne breakfast on landing, then two nights under canvas in a hidden bush camp.", highlights: ["Hot-air balloon flight", "Champagne breakfast", "Private guide", "Star-deck dinner"] },
];

function SafarisPage() {
  return (
    <SiteLayout>
      <PageHero title="Safaris built for the way you travel." subtitle="Itineraries" image={camp} />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="Featured Journeys"
            title="Pick a route — or tell us yours."
            description="Every package is a starting point. Tweak the days, swap the camps, add a balloon or a beach. Your trip designer will make it real."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {safaris.map((s) => (
              <article key={s.title} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:border-brand-gold transition">
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
                  <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-green-deep hover:text-brand-gold">
                    Enquire about this trip <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}