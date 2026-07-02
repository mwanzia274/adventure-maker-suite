import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LogOut, LayoutDashboard, Mail, MapPinned, Star, Image as ImageIcon,
  Plus, Pencil, Trash2, Loader2, Check, X as XIcon, ExternalLink, Database, Upload, Search,
  ArrowUp, ArrowDown, MessageCircle, Phone as PhoneIcon, Download, History, Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { seedToursIfEmpty } from "@/lib/tours.functions";
import { resolveImageUrl } from "@/lib/asset-resolver";
import logo from "@/assets/logo.asset.json";
import { toast } from "sonner";

type Tab = "bookings" | "tours" | "reviews" | "gallery";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin · Pla2Ride" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("bookings");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!active) return;
      if (!roleRow) {
        navigate({ to: "/", replace: true });
        return;
      }
      setIsAdmin(true);
      setReady(true);
    })();
    return () => { active = false; };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!ready || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-brand-green-deep" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-sand/30">
      <header className="bg-brand-green-deep text-white">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo.url} alt="" className="h-10 w-10 object-contain" />
            <span className="font-display text-lg font-bold">PLA<span className="text-brand-gold">2</span>RIDE · Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-white/70 hover:text-brand-gold flex items-center gap-1.5">
              View site <ExternalLink className="size-3.5" />
            </Link>
            <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold">
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="flex flex-wrap gap-2 mb-8 border-b border-border">
          {([
            ["bookings", "Bookings", Mail],
            ["tours", "Tours", MapPinned],
            ["reviews", "Reviews", Star],
            ["gallery", "Gallery", ImageIcon],
          ] as const).map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${
                tab === k
                  ? "border-brand-gold text-brand-green-deep"
                  : "border-transparent text-muted-foreground hover:text-brand-green-deep"
              }`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </nav>

        {tab === "bookings" && <BookingsPanel />}
        {tab === "tours" && <ToursPanel />}
        {tab === "reviews" && <ReviewsPanel />}
        {tab === "gallery" && <GalleryPanel />}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-brand-green-deep">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ============ BOOKINGS ============
function BookingsPanel() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const counts = useMemo(() => {
    const all = data ?? [];
    return {
      total: all.length,
      new: all.filter((b) => b.status === "new").length,
      confirmed: all.filter((b) => b.status === "confirmed").length,
    };
  }, [data]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error("Could not update status", { description: error.message }); return; }
    toast.success(`Status set to "${status}"`);
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openRow, setOpenRow] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return [b.reference, b.name, b.email, b.phone, b.trip, b.message]
        .some((f) => (f ?? "").toString().toLowerCase().includes(q));
    });
  }, [data, query, statusFilter]);

  function exportCsv() {
    const rows = filtered;
    if (!rows.length) { toast.error("Nothing to export"); return; }
    const headers = ["reference","name","email","phone","trip","travel_date","travellers","status","message","admin_notes","created_at"];
    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc((r as Record<string, unknown>)[h])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} booking${rows.length === 1 ? "" : "s"}`);
  }

  return (
    <Panel
      title="Bookings & enquiries"
      subtitle="Every enquiry from the contact form lands here."
      action={
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 px-4 py-2 text-xs font-semibold text-brand-green-deep hover:bg-brand-sand">
          <Download className="size-3.5" /> Export CSV
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Total" value={counts.total} />
        <Stat label="New" value={counts.new} accent />
        <Stat label="Confirmed" value={counts.confirmed} />
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ref, name, email, trip…"
            className="rounded-full border border-border bg-background pl-8 pr-3 py-2 text-xs w-72 focus:outline-none focus:border-brand-gold"
          />
        </div>
        <div className="flex gap-1">
          {(["all","new","contacted","confirmed","cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border capitalize transition ${statusFilter === s ? "bg-brand-green-deep text-white border-brand-green-deep" : "bg-background text-muted-foreground border-border hover:border-brand-gold"}`}
            >{s}</button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <Loader2 className="size-5 animate-spin text-brand-green-deep" />
      ) : (data?.length ?? 0) === 0 ? (
        <Empty text="No bookings yet. Submit the contact form to test." />
      ) : filtered.length === 0 ? (
        <Empty text="No bookings match the current filters." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr><th className="text-left py-2 pr-4">Ref</th><th className="text-left py-2 pr-4">Guest</th><th className="text-left py-2 pr-4">Trip</th><th className="text-left py-2 pr-4">Date</th><th className="text-left py-2 pr-4">Status</th><th className="py-2"></th></tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <React.Fragment key={b.id}>
                <tr className="border-b border-border/70 align-top">
                  <td className="py-3 pr-4 font-mono text-xs">{b.reference}</td>
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-brand-green-deep">{b.name}</div>
                    <div className="text-xs text-muted-foreground">{b.email}</div>
                    {b.phone && <div className="text-xs text-muted-foreground">{b.phone}</div>}
                    {b.travellers && <div className="text-xs text-muted-foreground mt-1">{b.travellers}</div>}
                    {b.message && <div className="text-xs text-muted-foreground mt-1 max-w-xs line-clamp-3">"{b.message}"</div>}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <a
                        href={`mailto:${b.email}?subject=${encodeURIComponent("Re: Your Pla2Ride safari enquiry " + b.reference)}&body=${encodeURIComponent("Hi " + b.name + ",\n\nThank you for reaching out to Pla2Ride Tours and Safaris.\n\n")}`}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 hover:bg-brand-green/20 text-brand-green-deep px-2 py-0.5 text-[11px] font-semibold"
                      >
                        <Mail className="size-3" /> Reply
                      </a>
                      {b.phone && (
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent("Hi " + b.name + ", thanks for your enquiry " + b.reference + " with Pla2Ride Tours and Safaris.")}`}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] px-2 py-0.5 text-[11px] font-semibold"
                        >
                          <MessageCircle className="size-3" /> WhatsApp
                        </a>
                      )}
                      {b.phone && (
                        <a
                          href={`tel:${b.phone.replace(/\s+/g, "")}`}
                          className="inline-flex items-center gap-1 rounded-full bg-muted hover:bg-muted/70 text-foreground px-2 py-0.5 text-[11px] font-semibold"
                        >
                          <PhoneIcon className="size-3" /> Call
                        </a>
                      )}
                      <button
                        onClick={() => setOpenRow(openRow === b.id ? null : b.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-sand hover:bg-brand-sand/70 text-brand-green-deep px-2 py-0.5 text-[11px] font-semibold"
                      >
                        <History className="size-3" /> {openRow === b.id ? "Hide" : "Reply log"}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{b.trip || "—"}</td>
                  <td className="py-3 pr-4 text-xs">{b.travel_date || "—"}<div className="text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</div></td>
                  <td className="py-3 pr-4">
                    <select
                      value={b.status}
                      onChange={(e) => setStatus(b.id, e.target.value)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                        b.status === "new" ? "bg-brand-gold/20 border-brand-gold text-brand-green-deep"
                          : b.status === "contacted" ? "bg-blue-100 border-blue-300 text-blue-900"
                          : b.status === "confirmed" ? "bg-green-100 border-green-300 text-green-900"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => remove(b.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
                {openRow === b.id && (
                  <tr className="border-b border-border/70 bg-brand-sand/20">
                    <td colSpan={6} className="p-4">
                      <ReplyHistory bookingId={b.id} bookingRef={b.reference} initialNotes={(b as { admin_notes?: string | null }).admin_notes ?? ""} />
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function ReplyHistory({ bookingId, bookingRef, initialNotes }: { bookingId: string; bookingRef: string; initialNotes: string }) {
  const qc = useQueryClient();
  const [channel, setChannel] = useState("email");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [notesSaving, setNotesSaving] = useState(false);

  const { data: replies, isLoading } = useQuery({
    queryKey: ["booking-replies", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booking_replies")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  async function logReply() {
    if (!message.trim()) { toast.error("Write a reply first"); return; }
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("booking_replies").insert({
      booking_id: bookingId,
      admin_id: u.user?.id ?? null,
      admin_email: u.user?.email ?? null,
      channel,
      message: message.trim(),
    });
    setSaving(false);
    if (error) { toast.error("Could not save reply", { description: error.message }); return; }
    setMessage("");
    toast.success(`Reply logged for ${bookingRef}`);
    qc.invalidateQueries({ queryKey: ["booking-replies", bookingId] });
  }

  async function saveNotes() {
    setNotesSaving(true);
    const { error } = await supabase.from("bookings").update({ admin_notes: notes }).eq("id", bookingId);
    setNotesSaving(false);
    if (error) { toast.error("Could not save note", { description: error.message }); return; }
    toast.success("Internal note saved");
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-brand-green-deep mb-2">Log a reply</div>
        <div className="flex gap-2 mb-2">
          {(["email","whatsapp","phone","other"] as const).map((c) => (
            <button key={c} onClick={() => setChannel(c)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border capitalize ${channel === c ? "bg-brand-green-deep text-white border-brand-green-deep" : "bg-background border-border text-muted-foreground"}`}>{c}</button>
          ))}
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="What did you tell the guest?"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
        />
        <button onClick={logReply} disabled={saving} className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-green-deep disabled:opacity-60">
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} Save reply
        </button>

        <div className="text-xs font-semibold uppercase tracking-widest text-brand-green-deep mt-5 mb-2">Internal note</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Private notes (visible to admins only)"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
        />
        <button onClick={saveNotes} disabled={notesSaving} className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-brand-green-deep hover:bg-brand-sand disabled:opacity-60">
          {notesSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Save note
        </button>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-brand-green-deep mb-2">Reply history</div>
        {isLoading ? <Loader2 className="size-4 animate-spin text-brand-green-deep" /> : (replies?.length ?? 0) === 0 ? (
          <div className="text-xs text-muted-foreground italic">No replies logged yet.</div>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {replies!.map((r) => (
              <li key={r.id} className="rounded-lg border border-border bg-background p-2.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider text-brand-green-deep">{r.channel}</span>
                  <span>{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div className="text-sm mt-1 whitespace-pre-wrap">{r.message}</div>
                {r.admin_email && <div className="text-[11px] text-muted-foreground mt-1">by {r.admin_email}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? "border-brand-gold bg-brand-gold/10" : "border-border bg-background"}`}>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-3xl font-semibold text-brand-green-deep mt-1">{value}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">{text}</div>;
}

// ============ TOURS ============
type TourRow = {
  id: string; slug: string; title: string; duration: string; days: number;
  category: string; group_size: string; location: string; price: string;
  img: string | null; short_desc: string; long_desc: string;
  highlights: unknown; includes: unknown; excludes: unknown; itinerary: unknown;
  published: boolean; sort_order: number;
};

function ToursPanel() {
  const qc = useQueryClient();
  const seed = useServerFn(seedToursIfEmpty);
  const [seeding, setSeeding] = useState(false);
  const [editing, setEditing] = useState<TourRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tours"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tours").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as TourRow[];
    },
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((t) =>
      [t.title, t.slug, t.category, t.location, t.duration, t.price, t.short_desc]
        .some((f) => (f ?? "").toLowerCase().includes(q))
    );
  }, [data, query]);

  async function runSeed() {
    setSeeding(true);
    try {
      await seed();
      qc.invalidateQueries({ queryKey: ["admin-tours"] });
      qc.invalidateQueries({ queryKey: ["public-tours"] });
    } finally {
      setSeeding(false);
    }
  }
  async function togglePublished(t: TourRow) {
    await supabase.from("tours").update({ published: !t.published }).eq("id", t.id);
    qc.invalidateQueries({ queryKey: ["admin-tours"] });
    qc.invalidateQueries({ queryKey: ["public-tours"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this tour permanently?")) return;
    await supabase.from("tours").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-tours"] });
    qc.invalidateQueries({ queryKey: ["public-tours"] });
  }
  async function move(t: TourRow, direction: -1 | 1) {
    const list = [...(data ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    const idx = list.findIndex((x) => x.id === t.id);
    const swapIdx = idx + direction;
    if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return;
    const other = list[swapIdx];
    const a = t.sort_order;
    const b = other.sort_order;
    // If equal, force distinct values to enable a swap.
    const newA = a === b ? b + direction : b;
    const newB = a === b ? a : a;
    const [r1, r2] = await Promise.all([
      supabase.from("tours").update({ sort_order: newA }).eq("id", t.id),
      supabase.from("tours").update({ sort_order: newB }).eq("id", other.id),
    ]);
    if (r1.error || r2.error) {
      toast.error("Could not reorder tours", { description: (r1.error ?? r2.error)?.message });
      return;
    }
    toast.success(`Moved "${t.title}" ${direction === -1 ? "up" : "down"}`);
    qc.invalidateQueries({ queryKey: ["admin-tours"] });
    qc.invalidateQueries({ queryKey: ["public-tours"] });
  }

  return (
    <Panel
      title="Tours catalog"
      subtitle="Manage every safari shown on the public site."
      action={
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tours by name, location…"
              className="rounded-full border border-border bg-background pl-8 pr-3 py-2 text-xs w-64 focus:outline-none focus:border-brand-gold"
            />
          </div>
          {(data?.length ?? 0) === 0 && (
            <button onClick={runSeed} disabled={seeding} className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 px-4 py-2 text-xs font-semibold text-brand-green-deep hover:bg-brand-sand transition disabled:opacity-60">
              {seeding ? <Loader2 className="size-3.5 animate-spin" /> : <Database className="size-3.5" />}
              Seed default tours
            </button>
          )}
          <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-brand-green-deep">
            <Plus className="size-3.5" /> New tour
          </button>
        </div>
      }
    >
      {isLoading ? <Loader2 className="size-5 animate-spin text-brand-green-deep" /> : (data?.length ?? 0) === 0 ? (
        <Empty text="No tours in the database yet. Click 'Seed default tours' to import the 17 existing safaris, or create a new one." />
      ) : filtered.length === 0 ? (
        <Empty text={`No tours match "${query}".`} />
      ) : (
        <div className="grid gap-3">
          {filtered.map((t, i) => (
            <div key={t.id} className="flex items-center gap-4 p-3 border border-border rounded-xl bg-background">
              {t.img && <img src={t.img} alt={t.title} className="size-16 rounded-lg object-cover" />}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-brand-green-deep">{t.title}</span>
                  <span className="text-xs rounded-full bg-brand-sand text-brand-green-deep px-2 py-0.5">{t.category}</span>
                  {!t.published && <span className="text-xs rounded-full bg-muted text-muted-foreground px-2 py-0.5">Hidden</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{t.duration} · {t.location} · {t.price}</div>
              </div>
              <div className="flex items-center gap-1">
                {!query.trim() && (
                  <div className="flex flex-col mr-1">
                    <button onClick={() => move(t, -1)} disabled={i === 0} title="Move up" className="p-1 rounded hover:bg-brand-sand text-brand-green-deep disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button onClick={() => move(t, 1)} disabled={i === filtered.length - 1} title="Move down" className="p-1 rounded hover:bg-brand-sand text-brand-green-deep disabled:opacity-30 disabled:cursor-not-allowed">
                      <ArrowDown className="size-3.5" />
                    </button>
                  </div>
                )}
                <button onClick={() => togglePublished(t)} title={t.published ? "Hide" : "Publish"} className="p-2 rounded-md hover:bg-brand-sand text-brand-green-deep">
                  {t.published ? <Check className="size-4" /> : <XIcon className="size-4" />}
                </button>
                <button onClick={() => setEditing(t)} className="p-2 rounded-md hover:bg-brand-sand text-brand-green-deep"><Pencil className="size-4" /></button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <TourEditor
          tour={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => {
            setEditing(null); setCreating(false);
            qc.invalidateQueries({ queryKey: ["admin-tours"] });
            qc.invalidateQueries({ queryKey: ["public-tours"] });
          }}
        />
      )}
    </Panel>
  );
}

function TourEditor({ tour, onClose, onSaved }: { tour: TourRow | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!tour;
  const asStringArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x) => typeof x === "string") as string[] : [];
  const asItinerary = (v: unknown): { day: number; title: string; text: string }[] =>
    Array.isArray(v)
      ? v.map((x, i) => {
          const o = (x ?? {}) as Record<string, unknown>;
          return {
            day: typeof o.day === "number" ? o.day : i + 1,
            title: typeof o.title === "string" ? o.title : "",
            text: typeof o.text === "string" ? o.text : "",
          };
        })
      : [];
  const [form, setForm] = useState(() => ({
    slug: tour?.slug ?? "",
    title: tour?.title ?? "",
    duration: tour?.duration ?? "3 Days",
    days: tour?.days ?? 3,
    category: tour?.category ?? "Classic Safari",
    group_size: tour?.group_size ?? "2-6 guests",
    location: tour?.location ?? "Kenya",
    price: tour?.price ?? "from $0",
    img: tour?.img ?? "",
    gallery: Array.isArray((tour as unknown as { gallery?: unknown })?.gallery)
      ? ((tour as unknown as { gallery: unknown[] }).gallery.filter((x): x is string => typeof x === "string"))
      : [],
    short_desc: tour?.short_desc ?? "",
    long_desc: tour?.long_desc ?? "",
    highlights: asStringArray(tour?.highlights),
    includes: asStringArray(tour?.includes),
    excludes: asStringArray(tour?.excludes),
    itinerary: asItinerary(tour?.itinerary),
    published: tour?.published ?? true,
    sort_order: tour?.sort_order ?? 0,
  }));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    setSaving(true);
    try {
      const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const rawSlug = form.slug.trim() ? form.slug : form.title;
      const slug = slugify(rawSlug);
      if (!slug) { setErr("Please enter a title so we can build the URL slug."); setSaving(false); return; }
      const highlights = form.highlights.map((s) => s.trim()).filter(Boolean);
      const includes = form.includes.map((s) => s.trim()).filter(Boolean);
      const excludes = form.excludes.map((s) => s.trim()).filter(Boolean);
      const itinerary = form.itinerary
        .map((it, i) => ({ day: Number(it.day) || i + 1, title: it.title.trim(), text: it.text.trim() }))
        .filter((it) => it.title || it.text);
      const gallery = form.gallery.map((s) => s.trim()).filter(Boolean);
      const payload = { ...form, slug, days: Number(form.days), sort_order: Number(form.sort_order), highlights, includes, excludes, itinerary, gallery };
      if (isEdit && tour) {
        const { error } = await supabase.from("tours").update(payload).eq("id", tour.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tours").insert(payload);
        if (error) throw error;
      }
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-3xl rounded-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold text-brand-green-deep">{isEdit ? "Edit tour" : "New tour"}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><XIcon className="size-5" /></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <In label="Slug (URL)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
          <In label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <In label="Duration (e.g. 3 Days)" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
          <In label="Days (number)" type="number" value={String(form.days)} onChange={(v) => setForm({ ...form, days: Number(v) })} />
          <In label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <In label="Group size" value={form.group_size} onChange={(v) => setForm({ ...form, group_size: v })} />
          <In label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <In label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <div className="sm:col-span-2">
            <Lbl>Cover image</Lbl>
            <ImageUploader value={form.img} onChange={(v) => setForm({ ...form, img: v })} pathPrefix="tours" />
          </div>
          <div className="sm:col-span-2">
            <Lbl>Gallery images (shown on the tour page)</Lbl>
            <MultiImageUploader values={form.gallery} onChange={(v) => setForm({ ...form, gallery: v })} pathPrefix="tours/gallery" />
          </div>
          <div className="sm:col-span-2">
            <Lbl>Short description</Lbl>
            <textarea value={form.short_desc} onChange={(e) => setForm({ ...form, short_desc: e.target.value })} rows={2} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <Lbl>Long description</Lbl>
            <textarea value={form.long_desc} onChange={(e) => setForm({ ...form, long_desc: e.target.value })} rows={3} className={inputCls} />
          </div>
          <StringList
            label="Highlights"
            placeholder="e.g. Sundowner on the Mara"
            items={form.highlights}
            onChange={(items) => setForm({ ...form, highlights: items })}
          />
          <StringList
            label="What's included"
            placeholder="e.g. Park fees, all meals"
            items={form.includes}
            onChange={(items) => setForm({ ...form, includes: items })}
          />
          <StringList
            label="What's not included"
            placeholder="e.g. International flights"
            items={form.excludes}
            onChange={(items) => setForm({ ...form, excludes: items })}
          />
          <ItineraryList
            items={form.itinerary}
            onChange={(items) => setForm({ ...form, itinerary: items })}
          />
          <In label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
          <label className="flex items-center gap-2 self-end pb-2">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            <span className="text-sm">Published</span>
          </label>
        </div>
        {err && <div className="mt-4 text-sm text-destructive">{err}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-green-deep transition disabled:opacity-60">
            {saving ? "Saving…" : "Save tour"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-brand-gold";
function Lbl({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-deep block mb-1">{children}</span>;
}
function In({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <Lbl>{label}</Lbl>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}

function StringList({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="sm:col-span-2">
      <Lbl>{label}</Lbl>
      <div className="space-y-2">
        {items.map((val, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={val}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="shrink-0 p-2 rounded-md hover:bg-destructive/10 text-destructive"
              aria-label="Remove"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 px-3 py-1.5 text-xs font-semibold text-brand-green-deep hover:bg-brand-sand"
        >
          <Plus className="size-3.5" /> Add item
        </button>
      </div>
    </div>
  );
}

function ItineraryList({ items, onChange }: { items: { day: number; title: string; text: string }[]; onChange: (v: { day: number; title: string; text: string }[]) => void }) {
  return (
    <div className="sm:col-span-2">
      <Lbl>Day-by-day itinerary</Lbl>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-border p-3 bg-background">
            <div className="flex gap-2 items-start">
              <input
                type="number"
                value={it.day}
                onChange={(e) => {
                  const next = [...items]; next[i] = { ...it, day: Number(e.target.value) }; onChange(next);
                }}
                className={`${inputCls} w-20`}
                aria-label="Day"
              />
              <input
                value={it.title}
                placeholder="Day title (e.g. Arrive Nairobi)"
                onChange={(e) => { const next = [...items]; next[i] = { ...it, title: e.target.value }; onChange(next); }}
                className={inputCls}
              />
              <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="shrink-0 p-2 rounded-md hover:bg-destructive/10 text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
            <textarea
              value={it.text}
              placeholder="What happens this day…"
              onChange={(e) => { const next = [...items]; next[i] = { ...it, text: e.target.value }; onChange(next); }}
              rows={2}
              className={`${inputCls} mt-2`}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, { day: items.length + 1, title: "", text: "" }])}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 px-3 py-1.5 text-xs font-semibold text-brand-green-deep hover:bg-brand-sand"
        >
          <Plus className="size-3.5" /> Add day
        </button>
      </div>
    </div>
  );
}

function ImageUploader({ value, onChange, pathPrefix }: { value: string; onChange: (url: string) => void; pathPrefix: string }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const MAX_MB = 8;

  async function upload(file: File) {
    setErr(null);
    if (!file.type.startsWith("image/")) {
      setErr("Please choose an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErr(`Image is too large. Max ${MAX_MB}MB.`);
      return;
    }
    setUploading(true);
    setProgress(20);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("tour-images").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      setProgress(75);
      const { data, error: sErr } = await supabase.storage
        .from("tour-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (sErr || !data) throw sErr ?? new Error("Could not create URL");
      onChange(data.signedUrl);
      setProgress(100);
      toast.success("Image uploaded");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  }

  return (
    <div>
      <div
        className={`flex items-start gap-4 rounded-xl border-2 border-dashed p-3 transition ${dragOver ? "border-brand-gold bg-brand-sand/40" : "border-transparent"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
      >
        <div className="size-24 rounded-lg overflow-hidden bg-brand-sand grid place-items-center border border-border shrink-0">
          {value ? (
            <img src={value} alt="Image preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-brand-green-deep cursor-pointer">
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
                e.target.value = "";
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="ml-2 inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3" /> Remove
            </button>
          )}
          {uploading && (
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-brand-green transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className={`${inputCls} text-xs`}
          />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <p className="text-xs text-muted-foreground">Drag & drop or click to upload. JPG, PNG, WebP up to {MAX_MB}MB. Images appear at a consistent aspect ratio on the public site.</p>
        </div>
      </div>
    </div>
  );
}

// ============ REVIEWS ============
function MultiImageUploader({ values, onChange, pathPrefix }: { values: string[]; onChange: (v: string[]) => void; pathPrefix: string }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const MAX_MB = 8;

  async function uploadFiles(files: FileList | File[]) {
    setErr(null);
    const arr = Array.from(files);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of arr) {
        if (!file.type.startsWith("image/")) { setErr(`Skipped ${file.name}: not an image.`); continue; }
        if (file.size > MAX_MB * 1024 * 1024) { setErr(`Skipped ${file.name}: over ${MAX_MB}MB.`); continue; }
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("tour-images").upload(path, file, {
          cacheControl: "31536000", upsert: false, contentType: file.type,
        });
        if (upErr) { setErr(upErr.message); continue; }
        const { data, error: sErr } = await supabase.storage
          .from("tour-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
        if (sErr || !data) { setErr(sErr?.message ?? "Could not sign URL"); continue; }
        uploaded.push(data.signedUrl);
      }
      if (uploaded.length) {
        onChange([...values, ...uploaded]);
        toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} added`);
      }
    } finally {
      setUploading(false);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  }

  return (
    <div>
      <div
        className={`rounded-xl border-2 border-dashed p-4 transition ${dragOver ? "border-brand-gold bg-brand-sand/40" : "border-border"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files); }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <label className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-brand-green-deep cursor-pointer">
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {uploading ? "Uploading…" : "Add gallery images"}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => { if (e.target.files?.length) uploadFiles(e.target.files); e.target.value = ""; }}
            />
          </label>
          <span className="text-xs text-muted-foreground">Drag & drop multiple images. JPG, PNG, WebP up to {MAX_MB}MB each.</span>
        </div>
        {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
        {values.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {values.map((url, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-border bg-brand-sand aspect-square">
                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-end justify-between p-1.5 opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} className="p-1 rounded bg-white/90 text-brand-green-deep" title="Move left"><ArrowUp className="size-3 rotate-[-90deg]" /></button>
                    <button type="button" onClick={() => move(i, 1)} className="p-1 rounded bg-white/90 text-brand-green-deep" title="Move right"><ArrowDown className="size-3 rotate-[-90deg]" /></button>
                  </div>
                  <button type="button" onClick={() => onChange(values.filter((_, idx) => idx !== i))} className="p-1 rounded bg-destructive text-white" title="Remove"><Trash2 className="size-3" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewsPanel() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ author: "", location: "", rating: 5, text: "", trip: "" });
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  async function add() {
    if (!form.author || !form.text) return;
    await supabase.from("reviews").insert({ ...form, approved: true });
    setForm({ author: "", location: "", rating: 5, text: "", trip: "" });
    setAdding(false);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  }
  async function toggle(id: string, approved: boolean) {
    await supabase.from("reviews").update({ approved: !approved }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  }
  return (
    <Panel
      title="Guest reviews"
      subtitle="Approved reviews appear on the public Reviews page."
      action={<button onClick={() => setAdding(!adding)} className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-brand-green-deep"><Plus className="size-3.5" /> Add review</button>}
    >
      {adding && (
        <div className="mb-6 p-4 border border-border rounded-xl bg-background grid sm:grid-cols-2 gap-3">
          <In label="Author name" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
          <In label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <In label="Trip" value={form.trip} onChange={(v) => setForm({ ...form, trip: v })} />
          <In label="Rating (1-5)" type="number" value={String(form.rating)} onChange={(v) => setForm({ ...form, rating: Math.min(5, Math.max(1, Number(v))) })} />
          <div className="sm:col-span-2">
            <Lbl>Review text</Lbl>
            <textarea rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={inputCls} />
          </div>
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <button onClick={() => setAdding(false)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
            <button onClick={add} className="rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-primary-foreground">Save</button>
          </div>
        </div>
      )}
      {isLoading ? <Loader2 className="size-5 animate-spin text-brand-green-deep" /> : (data?.length ?? 0) === 0 ? (
        <Empty text="No reviews yet." />
      ) : (
        <div className="grid gap-3">
          {data!.map((r) => (
            <div key={r.id} className="p-4 border border-border rounded-xl bg-background">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-green-deep">{r.author}</span>
                    {r.location && <span className="text-xs text-muted-foreground">· {r.location}</span>}
                    <span className="text-xs text-brand-gold">{"★".repeat(r.rating)}</span>
                    <span className={`text-[10px] rounded-full px-2 py-0.5 ${r.approved ? "bg-green-100 text-green-900" : "bg-muted text-muted-foreground"}`}>
                      {r.approved ? "Live" : "Hidden"}
                    </span>
                  </div>
                  {r.trip && <div className="text-xs text-muted-foreground mt-1">{r.trip}</div>}
                  <p className="mt-2 text-sm">"{r.text}"</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggle(r.id, r.approved)} className="p-2 rounded hover:bg-brand-sand text-brand-green-deep">
                    {r.approved ? <XIcon className="size-4" /> : <Check className="size-4" />}
                  </button>
                  <button onClick={() => remove(r.id)} className="p-2 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

// ============ GALLERY ============
function GalleryPanel() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", caption: "", image_url: "", sort_order: 0 });
  const { data, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
  async function add() {
    if (!form.title || !form.image_url) return;
    await supabase.from("gallery_items").insert({ ...form, published: true });
    setForm({ title: "", caption: "", image_url: "", sort_order: 0 });
    setAdding(false);
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete gallery item?")) return;
    await supabase.from("gallery_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
  }
  return (
    <Panel
      title="Gallery"
      subtitle="Photos shown in the public gallery."
      action={<button onClick={() => setAdding(!adding)} className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-brand-green-deep"><Plus className="size-3.5" /> Add image</button>}
    >
      {adding && (
        <div className="mb-6 p-4 border border-border rounded-xl bg-background grid sm:grid-cols-2 gap-3">
          <In label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <In label="Caption" value={form.caption} onChange={(v) => setForm({ ...form, caption: v })} />
          <div className="sm:col-span-2">
            <Lbl>Image</Lbl>
            <ImageUploader value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} pathPrefix="gallery" />
          </div>
          <In label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <button onClick={() => setAdding(false)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
            <button onClick={add} className="rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-primary-foreground">Save</button>
          </div>
        </div>
      )}
      {isLoading ? <Loader2 className="size-5 animate-spin text-brand-green-deep" /> : (data?.length ?? 0) === 0 ? (
        <Empty text="No gallery photos yet." />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data!.map((g) => (
            <div key={g.id} className="relative group rounded-xl overflow-hidden border border-border">
              <img src={g.image_url} alt={g.title} className="aspect-square w-full object-cover" />
              <div className="p-3 bg-card">
                <div className="font-semibold text-sm text-brand-green-deep">{g.title}</div>
                {g.caption && <div className="text-xs text-muted-foreground">{g.caption}</div>}
              </div>
              <button onClick={() => remove(g.id)} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}