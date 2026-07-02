// Resolves image URLs stored in the database.
//
// Some seeded tours store legacy dev paths like "/src/assets/dest-masai.jpg".
// Those paths do not exist in the production bundle, so <img src="…"> 404s.
// We map every bundled asset (by filename) to its hashed URL and rewrite
// legacy paths transparently.

const modules = import.meta.glob("/src/assets/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byFilename: Record<string, string> = {};
for (const [key, url] of Object.entries(modules)) {
  const name = key.split("/").pop();
  if (name) byFilename[name] = url;
}

export function resolveImageUrl(src: string | null | undefined): string {
  if (!src) return "";
  if (src.startsWith("/src/assets/")) {
    const name = src.split("/").pop() ?? "";
    return byFilename[name] ?? src;
  }
  return src;
}

export function resolveImageUrls(list: (string | null | undefined)[] | null | undefined): string[] {
  if (!Array.isArray(list)) return [];
  return list.map((s) => resolveImageUrl(s)).filter((s): s is string => Boolean(s));
}