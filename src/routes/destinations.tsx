import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, SectionHeader } from "@/components/SiteLayout";
import serengeti from "@/assets/dest-serengeti.jpg";
import masai from "@/assets/dest-masai.jpg";
import kilimanjaro from "@/assets/dest-kilimanjaro.jpg";
import zanzibar from "@/assets/dest-zanzibar.jpg";
import elephants from "@/assets/gallery-elephants.jpg";
import lion from "@/assets/gallery-lion.jpg";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations — East Africa | Pla2Ride Tours and Safaris" },
      { name: "description", content: "Explore Kenya, Tanzania, Uganda, Rwanda and Zanzibar. National parks, mountains, lakes and beaches across East Africa." },
      { property: "og:title", content: "Destinations — Pla2Ride" },
      { property: "og:description", content: "Where will the road take you?" },
      { property: "og:image", content: serengeti },
    ],
  }),
  component: DestinationsPage,
});

const list = [
  { name: "Maasai Mara", country: "Kenya", img: masai, text: "Rolling grasslands famed for the Great Migration river crossings and Africa's densest big cat population." },
  { name: "Serengeti", country: "Tanzania", img: serengeti, text: "Two million wildebeest, endless plains and the most cinematic skies on the continent." },
  { name: "Mount Kilimanjaro", country: "Tanzania", img: kilimanjaro, text: "The world's tallest free-standing mountain — five climate zones from rainforest to glacier." },
  { name: "Zanzibar Archipelago", country: "Tanzania", img: zanzibar, text: "Spice-island heritage, turquoise reefs and Stone Town's labyrinth of carved wooden doors." },
  { name: "Amboseli", country: "Kenya", img: elephants, text: "Big-tusked elephant herds drifting beneath the snow-capped silhouette of Kilimanjaro." },
  { name: "Ngorongoro Crater", country: "Tanzania", img: lion, text: "An intact volcanic caldera and one of the highest concentrations of wildlife on Earth." },
];

function DestinationsPage() {
  return (
    <SiteLayout>
      <PageHero title="Where the road takes you." subtitle="Destinations" image={kilimanjaro} />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="East Africa"
            title="Six landscapes that change you."
            description="From snow-line to spice farm, these are the places we know best — and where our guides will take you deeper than the guidebook."
          />
          <div className="mt-16 space-y-20">
            {list.map((d, i) => (
              <article key={d.name} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative overflow-hidden rounded-2xl shadow-soft aspect-[5/4]">
                  <img src={d.img} alt={d.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">{d.country}</div>
                  <h3 className="mt-3 font-display text-4xl font-semibold text-brand-green-deep text-balance">{d.name}</h3>
                  <p className="mt-5 text-muted-foreground leading-relaxed text-lg">{d.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}