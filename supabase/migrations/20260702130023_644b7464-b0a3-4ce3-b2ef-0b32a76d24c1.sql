
UPDATE public.tours SET slug = 'karura' WHERE (slug IS NULL OR btrim(slug) = '') AND lower(title) LIKE '%karura%';
UPDATE public.tours SET slug = 'nairobi-national-park' WHERE slug = 'Nairobi tour';
UPDATE public.tours SET slug = 'mombasa-fort-jesus-old-town-walking-tour' WHERE slug ILIKE 'Mombasa Fort Jesus%';

-- Generic backfill: any remaining empty/space-containing slug becomes a slugified title
UPDATE public.tours
SET slug = regexp_replace(regexp_replace(lower(coalesce(nullif(btrim(title),''),'tour-'||substr(id::text,1,8))), '[^a-z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g')
WHERE slug IS NULL OR btrim(slug) = '' OR slug ~ '\s';

ALTER TABLE public.tours
  ADD CONSTRAINT tours_slug_not_blank CHECK (slug IS NOT NULL AND btrim(slug) <> '' AND slug !~ '\s');
