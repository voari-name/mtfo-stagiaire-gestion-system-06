import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Intern = Tables<'interns'>;
type Project = Tables<'projects'>;
type Evaluation = Tables<'evaluations'>;
type Profile = Tables<'profiles'>;
type ProjectIntern = Tables<'project_interns'>;

export const useSupabaseData = () => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projectInterns, setProjectInterns] = useState<ProjectIntern[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [internsRes, projectsRes, evaluationsRes, profilesRes, projectInternsRes] = await Promise.all([
        supabase.from('interns').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('evaluations').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('project_interns').select('*'),
      ]);

      if (internsRes.data) setInterns(internsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (evaluationsRes.data) setEvaluations(evaluationsRes.data);
      if (profilesRes.data) setProfiles(profilesRes.data);
      if (projectInternsRes.data) setProjectInterns(projectInternsRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Intern operations
  const addIntern = async (internData: Omit<Intern, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('interns')
        .insert([internData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setInterns(prev => [...prev, data]);
        toast({
          title: "Stagiaire ajouté",
          description: "Le stagiaire a été ajouté avec succès",
        });
      }
    } catch (error: any) {
      console.error('Error adding intern:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout du stagiaire",
        variant: "destructive"
      });
    }
  };

  const updateIntern = async (id: string, updates: Partial<Intern>) => {
    try {
      const { data, error } = await supabase
        .from('interns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setInterns(prev => prev.map(intern => intern.id === id ? data : intern));
        toast({
          title: "Stagiaire modifié",
          description: "Les informations ont été mises à jour",
        });
      }
    } catch (error: any) {
      console.error('Error updating intern:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification",
        variant: "destructive"
      });
    }
  };

  const deleteIntern = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInterns(prev => prev.filter(intern => intern.id !== id));
      toast({
        title: "Stagiaire supprimé",
        description: "Le stagiaire a été supprimé avec succès",
      });
    } catch (error: any) {
      console.error('Error deleting intern:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  // Project operations
  const addProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProjects(prev => [...prev, data]);
        toast({
          title: "Projet ajouté",
          description: "Le projet a été créé avec succès",
        });
      }
    } catch (error: any) {
      console.error('Error adding project:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création du projet",
        variant: "destructive"
      });
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProjects(prev => prev.map(project => project.id === id ? data : project));
        toast({
          title: "Projet modifié",
          description: "Le projet a été mis à jour",
        });
      }
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification",
        variant: "destructive"
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès",
      });
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  // Evaluation operations
  const addEvaluation = async (evaluationData: Omit<Evaluation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .insert([evaluationData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEvaluations(prev => [...prev, data]);
        toast({
          title: "Évaluation ajoutée",
          description: "L'évaluation a été créée avec succès",
        });
      }
    } catch (error: any) {
      console.error('Error adding evaluation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création de l'évaluation",
        variant: "destructive"
      });
    }
  };

  const updateEvaluation = async (id: string, updates: Partial<Evaluation>) => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setEvaluations(prev => prev.map(evaluation => evaluation.id === id ? data : evaluation));
        toast({
          title: "Évaluation modifiée",
          description: "L'évaluation a été mise à jour",
        });
      }
    } catch (error: any) {
      console.error('Error updating evaluation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification",
        variant: "destructive"
      });
    }
  };

  const deleteEvaluation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('evaluations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
      toast({
        title: "Évaluation supprimée",
        description: "L'évaluation a été supprimée avec succès",
      });
    } catch (error: any) {
      console.error('Error deleting evaluation:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  // Project-Intern link operations
  const addProjectIntern = async (projectInternData: TablesInsert<'project_interns'>) => {
    try {
      const { data, error } = await supabase
        .from('project_interns')
        .insert([projectInternData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProjectInterns(prev => [...prev, data]);
      }
    } catch (error: any) {
      console.error('Error adding project intern link:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la liaison projet-stagiaire",
        variant: "destructive"
      });
    }
  };

  return {
    // Data
    interns,
    projects,
    evaluations,
    profiles,
    projectInterns,
    loading,
    
    // Operations
    addIntern,
    updateIntern,
    deleteIntern,
    addProject,
    updateProject,
    deleteProject,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation,
    addProjectIntern,
    
    // Utility
    fetchData
  };
};
