
-- Add tasks column to projects table if it doesn't exist
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tasks jsonb DEFAULT '[]'::jsonb;

-- Create a table to link interns and projects
CREATE TABLE IF NOT EXISTS public.project_interns (
  project_id uuid NOT NULL,
  intern_id uuid NOT NULL,
  CONSTRAINT project_interns_pkey PRIMARY KEY (project_id, intern_id),
  CONSTRAINT project_interns_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
  CONSTRAINT project_interns_intern_id_fkey FOREIGN KEY (intern_id) REFERENCES public.interns(id) ON DELETE CASCADE
);

-- Enable RLS for the new table
ALTER TABLE public.project_interns ENABLE ROW LEVEL SECURITY;

-- Define RLS policies for project_interns
CREATE POLICY "Authenticated users can view project_interns" ON public.project_interns
FOR SELECT TO authenticated USING (true);

-- Re-create policy to avoid error if it exists
DROP POLICY IF EXISTS "Authenticated users can manage project_interns" ON public.project_interns;
CREATE POLICY "Authenticated users can manage project_interns" ON public.project_interns
FOR ALL TO authenticated USING (true) WITH CHECK (true);
