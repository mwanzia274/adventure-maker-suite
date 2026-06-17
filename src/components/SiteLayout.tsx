import { type ReactNode, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, Mail, MapPin, Instagram, Facebook, Compass } from "lucide-react";
import logo from "@/assets/logo.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/safaris", label: "Safaris" },
  { to: "/destinations", label: "Destinations" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="bg-brand-green-deep text-brand-gold-soft text-xs">
        <div className="mx-auto max-w-7xl px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2"><Compass className="size-3.5" /> Kenya owned · Expert local guides · Tailor-made safaris</span>
          <span className="hidden sm:flex items-center gap-4">
            <a href="tel:+254700000000" className="flex items-center gap-1.5 hover:text-white"><Phone className="size-3.5" /> +254 700 000 000</a>
            <a href="mailto:hello@pla2ride.com" className="flex items-center gap-1.5 hover:text-white"><Mail className="size-3.5" /> hello@pla2ride.com</a>
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur bg-background/85 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="Pla2Ride Tours and Safaris" className="h-14 w-14 object-contain" />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-brand-green-deep">PLA<span className="text-brand-gold">2</span>RIDE</span>
              <span className="text-[10px] tracking-[0.3em] text-brand-gold font-medium">TOURS & SAFARIS</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-brand-green-deep rounded-md transition-colors"
                activeProps={{ className: "px-4 py-2 text-sm font-semibold text-brand-green-deep bg-brand-sand rounded-md" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-brand-green-deep transition-colors"
            >
              Plan your trip
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-brand-green-deep"
              aria-label="Toggle menu"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-3 text-base font-medium text-foreground border-b border-border last:border-0"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex justify-center items-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Plan your trip
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 bg-savanna text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo.url} alt="" className="h-14 w-14 rounded-full bg-white/5 object-contain p-1" />
              <div>
                <div className="font-display text-2xl font-bold">PLA<span className="text-brand-gold">2</span>RIDE</div>
                <div className="text-[10px] tracking-[0.3em] text-brand-gold">TOURS & SAFARIS</div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm text-white/70 leading-relaxed">
              A Kenya-based safari company crafting unforgettable journeys — from the Big Five on the
              Masai Mara to Amboseli elephants beneath Kilimanjaro and dhow sails on the Diani coast.
            </p>
            <div className="mt-6">
              <div className="text-[10px] tracking-[0.3em] text-brand-gold font-semibold uppercase">Proud partners</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/80">
                <span className="rounded-full border border-white/15 px-3 py-1">TripAdvisor</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Kenya Wildlife Service</span>
                <span className="rounded-full border border-white/15 px-3 py-1">KATO Member</span>
                <span className="rounded-full border border-white/15 px-3 py-1">Magical Kenya</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Instagram" className="size-10 grid place-items-center rounded-full border border-white/15 hover:bg-brand-gold hover:text-brand-green-deep transition"><Instagram className="size-4" /></a>
              <a href="#" aria-label="Facebook" className="size-10 grid place-items-center rounded-full border border-white/15 hover:bg-brand-gold hover:text-brand-green-deep transition"><Facebook className="size-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-brand-gold">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {nav.slice(1).map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-brand-gold">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-brand-gold">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><MapPin className="size-4 text-brand-gold shrink-0 mt-0.5" /> Karen Office Park, Nairobi, Kenya</li>
              <li className="flex gap-2"><Phone className="size-4 text-brand-gold shrink-0 mt-0.5" /> +254 700 000 000</li>
              <li className="flex gap-2"><Mail className="size-4 text-brand-gold shrink-0 mt-0.5" /> hello@pla2ride.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/60">
            <span>© {new Date().getFullYear()} Pla2Ride Tours and Safaris. All rights reserved.</span>
            <span>Crafted with care in East Africa.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "max-w-2xl mx-auto text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className={align === "center" ? "divider-compass text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase" : "text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase"}>
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold text-brand-green-deep text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}

export function PageHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <section className="relative h-[55vh] min-h-[380px] flex items-end overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.15 0.04 145 / 0.2), oklch(0.15 0.04 145 / 0.85))" }} />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 text-white">
        <div className="text-xs font-semibold tracking-[0.4em] uppercase text-brand-gold">{subtitle}</div>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl font-semibold max-w-3xl text-balance">{title}</h1>
      </div>
    </section>
  );
}