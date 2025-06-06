
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types/dataTypes';

const API_URL = 'http://localhost:5000/api';

export const useProjectsAPI = (
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const { toast } = useToast();

  // Charger les projets depuis l'API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/projects`);
      
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement des projets';
      setError(errorMessage);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un projet
  const addProject = async (newProject: Project) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/projects`, newProject);
      
      if (response.data.success) {
        setProjects(prev => [...prev, response.data.project]);
        
        toast({
          title: "Projet créé",
          description: `Le projet "${newProject.title}" a été créé avec succès.`,
        });
        
        return true;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création du projet';
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un projet
  const updateProject = async (updatedProject: Project) => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API_URL}/projects/${updatedProject.id}`, updatedProject);
      
      if (response.data.success) {
        setProjects(prev => 
          prev.map(project => project.id === updatedProject.id ? response.data.project : project)
        );
        
        toast({
          title: "Projet mis à jour",
          description: `Le projet "${updatedProject.title}" a été modifié avec succès.`,
        });
        
        return true;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du projet';
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un projet
  const deleteProject = async (id: number) => {
    try {
      setLoading(true);
      
      const response = await axios.delete(`${API_URL}/projects/${id}`);
      
      if (response.data.success) {
        setProjects(prev => prev.filter(project => project.id !== id));
        
        toast({
          title: "Projet supprimé",
          description: "Le projet a été supprimé avec succès.",
          variant: "destructive"
        });
        
        return true;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression du projet';
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProjects,
    addProject,
    updateProject,
    deleteProject
  };
};
