import { createServerFn } from "@tanstack/react-start";
import { safaris } from "./safaris-data";

/**
 * Seeds the tours table from the static safaris-data file the first time
 * it's called. Safe to call repeatedly — no-ops once rows exist.
 */
export const seedToursIfEmpty = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error: countErr } = await supabaseAdmin
    .from("tours")
    .select("*", { count: "exact", head: true });
  if (countErr) throw countErr;
  if ((count ?? 0) > 0) return { seeded: 0 };

  const rows = safaris.map((s, i) => ({
    slug: s.slug,
    title: s.title,
    duration: s.duration,
    days: s.days,
    category: s.category,
    group_size: s.group,
    location: s.location,
    price: s.price,
    img: s.img,
    short_desc: s.desc,
    long_desc: s.long,
    highlights: s.highlights,
    includes: s.includes,
    excludes: s.excludes,
    itinerary: s.itinerary,
    sort_order: i,
    published: true,
  }));

  const { error } = await supabaseAdmin.from("tours").insert(rows);
  if (error) throw error;
  return { seeded: rows.length };
});