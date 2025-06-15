
-- Supprimer les anciennes politiques s'il y en a
DROP POLICY IF EXISTS "Users can view all interns" ON public.interns;
DROP POLICY IF EXISTS "Users can create interns" ON public.interns;
DROP POLICY IF EXISTS "Users can update interns" ON public.interns;
DROP POLICY IF EXISTS "Users can delete interns" ON public.interns;

-- Créer de nouvelles politiques RLS pour la table interns
CREATE POLICY "Users can view all interns" ON public.interns
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create interns" ON public.interns
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update interns" ON public.interns
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete interns" ON public.interns
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
