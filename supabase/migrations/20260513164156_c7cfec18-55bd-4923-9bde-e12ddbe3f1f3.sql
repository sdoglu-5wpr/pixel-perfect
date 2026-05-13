DROP POLICY IF EXISTS "public read site_settings" ON public.site_settings;

CREATE POLICY "public read site_settings"
ON public.site_settings
FOR SELECT
USING (key <> 'admin_emails' OR public.is_staff(auth.uid()));