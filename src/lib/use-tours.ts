import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { safaris, type Safari } from "./safaris-data";

export type DbTour = {
  id: string;
  slug: string;
  title: string;
  duration: string;
  days: number;
  category: string;
  group_size: string;
  location: string;
  price: string;
  img: string | null;
  short_desc: string;
  long_desc: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: { day: string; title: string; text: string }[];
  published: boolean;
  sort_order: number;
};

export function dbToSafari(t: DbTour): Safari {
  return {
    slug: t.slug,
    title: t.title,
    duration: t.duration,
    days: t.days,
    category: (t.category as Safari["category"]) ?? "Classic Safari",
    group: t.group_size,
    location: t.location,
    price: t.price,
    img: t.img ?? "",
    desc: t.short_desc,
    long: t.long_desc,
    highlights: t.highlights ?? [],
    includes: t.includes ?? [],
    excludes: t.excludes ?? [],
    itinerary: t.itinerary ?? [],
  };
}

export function useTours() {
  return useQuery({
    queryKey: ["public-tours"],
    queryFn: async (): Promise<Safari[]> => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      if (error) throw error;
      const rows = (data ?? []) as DbTour[];
      if (rows.length === 0) return safaris;
      return rows.map(dbToSafari);
    },
    staleTime: 30_000,
  });
}

export function useTour(slug: string) {
  return useQuery({
    queryKey: ["public-tour", slug],
    queryFn: async (): Promise<Safari | null> => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (data) return dbToSafari(data as DbTour);
      return safaris.find((s) => s.slug === slug) ?? null;
    },
    staleTime: 30_000,
  });
}