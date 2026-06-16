import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import lion from "@/assets/gallery-lion.jpg";
import balloon from "@/assets/gallery-balloon.jpg";
import maasai from "@/assets/gallery-maasai.jpg";
import elephants from "@/assets/gallery-elephants.jpg";
import serengeti from "@/assets/dest-serengeti.jpg";
import masai from "@/assets/dest-masai.jpg";
import kilimanjaro from "@/assets/dest-kilimanjaro.jpg";
import zanzibar from "@/assets/dest-zanzibar.jpg";
import camp from "@/assets/about-camp.jpg";
import hero from "@/assets/hero-savanna.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Pla2Ride Tours and Safaris" },
      { name: "description", content: "Photos from the field — wildlife, landscapes, camps and the people who make the journey." },
      { property: "og:title", content: "Gallery — Pla2Ride" },
      { property: "og:description", content: "Photos from the field." },
      { property: "og:image", content: lion },
    ],
  }),
  component: GalleryPage,
});

const photos: { src: string; alt: string; span?: string }[] = [
  { src: lion, alt: "Male lion in golden grass", span: "md:row-span-2" },
  { src: balloon, alt: "Hot air balloons at sunrise" },
  { src: maasai, alt: "Maasai warriors dancing", span: "md:col-span-2" },
  { src: elephants, alt: "Elephant family on dusty road" },
  { src: serengeti, alt: "Wildebeest crossing river", span: "md:row-span-2" },
  { src: masai, alt: "Safari vehicle at sunset" },
  { src: kilimanjaro, alt: "Kilimanjaro at golden hour" },
  { src: zanzibar, alt: "Dhow boat on turquoise water", span: "md:col-span-2" },
  { src: camp, alt: "Tented camp under stars" },
  { src: hero, alt: "Savanna at sunset with Kilimanjaro" },
];

function GalleryPage() {
  return (
    <SiteLayout>
      <PageHero title="A thousand small wonders." subtitle="Gallery" image={balloon} />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-3">
            {photos.map((p, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-xl ${p.span ?? ""}`}>
                <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-brand-green-deep/0 group-hover:bg-brand-green-deep/30 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}