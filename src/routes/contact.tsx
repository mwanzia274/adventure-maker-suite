import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import zanzibar from "@/assets/dest-zanzibar.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Plan Your Safari | Pla2Ride Tours and Safaris" },
      { name: "description", content: "Get in touch to start planning your East African safari. We reply within 24 hours, 7 days a week." },
      { property: "og:title", content: "Plan Your Safari — Pla2Ride" },
      { property: "og:description", content: "Tell us your dream trip. We'll send a proposal within 48 hours." },
      { property: "og:image", content: zanzibar },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteLayout>
      <PageHero title="Tell us your dream trip." subtitle="Contact" image={zanzibar} />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-5 gap-12">
          <aside className="lg:col-span-2 space-y-8">
            <div>
              <div className="text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Reach us</div>
              <h2 className="mt-3 font-display text-4xl font-semibold text-brand-green-deep text-balance">
                Real people, fast replies.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Send us a note about where you'd like to go, when, and who's coming. We'll come back
                within 24 hours with first ideas and within 48 with a full tailor-made proposal.
              </p>
            </div>
            <ul className="space-y-5">
              {[
                { i: Phone, l: "+254 700 000 000 · +255 700 000 000", s: "Phone & WhatsApp" },
                { i: Mail, l: "hello@pla2ride.com", s: "Email" },
                { i: MapPin, l: "Nairobi, Kenya · Arusha, Tanzania", s: "Offices" },
                { i: Clock, l: "Mon–Sun, 7am–9pm EAT", s: "Hours" },
              ].map((c) => (
                <li key={c.s} className="flex gap-4">
                  <div className="size-11 shrink-0 rounded-full bg-brand-sand grid place-items-center text-brand-green-deep">
                    <c.i className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-brand-gold font-semibold">{c.s}</div>
                    <div className="mt-0.5 font-medium text-foreground">{c.l}</div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-soft">
            {sent ? (
              <div className="py-20 text-center">
                <div className="mx-auto size-16 rounded-full bg-brand-gold grid place-items-center text-brand-green-deep">
                  <Check className="size-7" />
                </div>
                <h3 className="mt-6 font-display text-3xl font-semibold text-brand-green-deep">Karibu! Your message is on its way.</h3>
                <p className="mt-3 text-muted-foreground">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Phone (optional)" name="phone" />
                  <Select label="Trip type" name="trip">
                    <option>Wildlife Safari</option>
                    <option>Mountain Trek</option>
                    <option>Beach & Island</option>
                    <option>Cultural Tour</option>
                    <option>Custom Combination</option>
                  </Select>
                  <Field label="Travel dates" name="dates" placeholder="e.g. mid-September 2026" />
                  <Field label="Travellers" name="people" placeholder="e.g. 2 adults" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Tell us about your dream trip</label>
                  <textarea
                    required
                    rows={5}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    placeholder="Where you want to go, what you want to see, anything special..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-brand-green-deep transition"
                >
                  Send enquiry <Send className="size-4" />
                </button>
                <p className="text-xs text-muted-foreground">No spam. We'll only use this to plan your trip.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground">{label}</label>
      <input id={name} name={name} type={type} required={required} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
    </div>
  );
}

function Select({ label, name, children }: { label: string; name: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground">{label}</label>
      <select id={name} name={name} className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold">
        {children}
      </select>
    </div>
  );
}