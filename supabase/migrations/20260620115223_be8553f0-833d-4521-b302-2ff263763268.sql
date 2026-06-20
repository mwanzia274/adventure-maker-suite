CREATE POLICY "tour-images authenticated upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tour-images');
CREATE POLICY "tour-images authenticated update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tour-images');
CREATE POLICY "tour-images authenticated delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tour-images');
CREATE POLICY "tour-images authenticated read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'tour-images');