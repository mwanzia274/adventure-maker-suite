import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
import { z } from "zod";
import { Phone, Mail, MapPin, Clock, Send, Check, Loader2, AlertCircle, MessageCircle } from "lucide-react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import zanzibar from "@/assets/dest-zanzibar.jpg";
import { submitEnquiry } from "@/lib/enquiries.functions";

const searchSchema = z.object({
  trip: z.string().optional(),
  dates: z.string().optional(),
  people: z.string().optional(),
});

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(40, "Phone number is too long")
    .regex(/^[+0-9 ()\-]+$/, "Phone can only contain digits, spaces, +, -, ()"),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)").max(2000, "Message is too long"),
});
type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

export const Route = createFileRoute("/contact")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Contact — Plan Your Kenya Safari | Pla2Ride Tours and Safaris" },
      { name: "description", content: "Get in touch to start planning your Kenya safari. We reply within 24 hours, 7 days a week from our Nairobi office." },
      { property: "og:title", content: "Plan Your Kenya Safari — Pla2Ride" },
      { property: "og:description", content: "Tell us your dream trip. We'll send a proposal within 48 hours." },
      { property: "og:image", content: zanzibar },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const search = Route.useSearch();
  const send = useServerFn(submitEnquiry);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      trip: String(fd.get("trip") ?? ""),
      dates: String(fd.get("dates") ?? ""),
      people: String(fd.get("people") ?? ""),
      message: String(fd.get("message") ?? ""),
      safari: String(fd.get("safari") ?? ""),
    };
    const parsed = enquirySchema.safeParse({
      name: payload.name, email: payload.email, phone: payload.phone, message: payload.message,
    });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      setStatus("idle");
      return;
    }
    setFieldErrors({});
    setStatus("sending");
    try {
      const result = await send({ data: payload });
      setReference(result.reference);
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again or email us directly.");
      setStatus("error");
    }
  }

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
                Send us a note about where in Kenya you'd like to go, when, and who's coming. We'll
                come back within 24 hours with first ideas and within 48 with a full tailor-made
                proposal.
              </p>
            </div>
            <ul className="space-y-5">
              {[
                { i: MessageCircle, l: "0723 349 496", s: "WhatsApp", href: "https://wa.me/254723349496" },
                { i: Phone, l: "0787 186 615", s: "Phone", href: "tel:+254787186615" },
                { i: Mail, l: "pla2ridesafaris@gmail.com", s: "Email", href: "mailto:pla2ridesafaris@gmail.com" },
                { i: MapPin, l: "Nairobi, Kenya", s: "Office" },
                { i: Clock, l: "Operating since 2018 · Mon–Sun, 7am–9pm EAT", s: "Hours" },
              ].map((c) => (
                <li key={c.s} className="flex gap-4">
                  <div className="size-11 shrink-0 rounded-full bg-brand-sand grid place-items-center text-brand-green-deep">
                    <c.i className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-brand-gold font-semibold">{c.s}</div>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="mt-0.5 font-medium text-foreground hover:text-brand-green-deep">{c.l}</a>
                    ) : (
                      <div className="mt-0.5 font-medium text-foreground">{c.l}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-soft">
            {status === "sent" ? (
              <div className="py-20 text-center">
                <div className="mx-auto size-16 rounded-full bg-brand-gold grid place-items-center text-brand-green-deep">
                  <Check className="size-7" />
                </div>
                <h3 className="mt-6 font-display text-3xl font-semibold text-brand-green-deep">Karibu! Your message is on its way.</h3>
                <p className="mt-3 text-muted-foreground">We'll be in touch within 24 hours.</p>
                {reference && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Your reference: <span className="font-mono text-brand-green-deep">{reference}</span>
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {search.trip && (
                  <div className="rounded-lg border border-brand-gold/40 bg-brand-sand px-4 py-3 text-sm text-brand-green-deep">
                    Enquiring about: <strong>{search.trip}</strong>
                    <input type="hidden" name="safari" value={search.trip} />
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full name" name="name" required maxLength={100} error={fieldErrors.name} />
                  <Field label="Email" name="email" type="email" required maxLength={255} error={fieldErrors.email} />
                  <Field label="Phone" name="phone" type="tel" required maxLength={40} placeholder="+254 712 345 678" error={fieldErrors.phone} />
                  <Select label="Trip type" name="trip" defaultValue={search.trip}>
                    <option>Wildlife Safari</option>
                    <option>Mountain Trek</option>
                    <option>Beach & Island</option>
                    <option>Cultural Tour</option>
                    <option>Custom Combination</option>
                  </Select>
                  <Field label="Travel dates" name="dates" placeholder="e.g. mid-September 2026" maxLength={120} defaultValue={search.dates} />
                  <Field label="Travellers" name="people" placeholder="e.g. 2 adults" maxLength={40} defaultValue={search.people} />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Tell us about your dream trip</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    maxLength={2000}
                    aria-invalid={!!fieldErrors.message}
                    className={`mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold ${fieldErrors.message ? "border-destructive" : "border-border"}`}
                    placeholder="Where in Kenya you want to go, what you want to see, anything special..."
                  />
                  {fieldErrors.message && (
                    <p className="mt-1.5 text-xs text-destructive flex items-center gap-1"><AlertCircle className="size-3" /> {fieldErrors.message}</p>
                  )}
                </div>
                {status === "error" && error && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-brand-green-deep transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>Sending… <Loader2 className="size-4 animate-spin" /></>
                    ) : (
                      <>Send enquiry <Send className="size-4" /></>
                    )}
                  </button>
                  <a
                    href="https://wa.me/254723349496?text=Hi%20Pla2Ride%2C%20I%27d%20like%20to%20plan%20a%20safari."
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white hover:brightness-95 transition"
                  >
                    <MessageCircle className="size-4" /> Chat on WhatsApp
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">No spam. We'll only use this to plan your trip.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", required, placeholder, maxLength, defaultValue, error }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; maxLength?: number; defaultValue?: string; error?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground">{label}{required && <span className="text-destructive"> *</span>}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        className={`mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold ${error ? "border-destructive" : "border-border"}`}
      />
      {error && <p className="mt-1.5 text-xs text-destructive flex items-center gap-1"><AlertCircle className="size-3" /> {error}</p>}
    </div>
  );
}

function Select({ label, name, children, defaultValue }: { label: string; name: string; children: ReactNode; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground">{label}</label>
      <select id={name} name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold">
        {children}
      </select>
    </div>
  );
}