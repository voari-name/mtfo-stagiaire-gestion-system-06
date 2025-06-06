
import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import type { Project } from '@/types/dataTypes';

const API_URL = 'http://localhost:5000/api';

export const useProjectsLogic = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Charger les projets au montage du composant
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtrage intelligent des projets
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filtrage par terme de recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.interns.some(intern => 
          intern.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project =>
        project.interns.some(intern => intern.status === statusFilter)
      );
    }

    return filtered;
  }, [projects, searchTerm, statusFilter]);

  // Statistiques des projets
  const projectStats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter(p => 
      p.interns.every(intern => intern.status === 'fin')
    ).length;
    const inProgress = projects.filter(p => 
      p.interns.some(intern => intern.status === 'en cours')
    ).length;
    const notStarted = projects.filter(p => 
      p.interns.every(intern => intern.status === 'début')
    ).length;

    return { total, completed, inProgress, notStarted };
  }, [projects]);

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

  // Obtenir un projet par ID
  const getProjectById = (id: number): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  // Obtenir des projets par statut
  const getProjectsByStatus = (status: string): Project[] => {
    return projects.filter(project => 
      project.interns.some(intern => intern.status === status)
    );
  };

  // Gestion de la sélection de projet
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleDeselectProject = () => {
    setSelectedProject(null);
  };

  // Validation des données de projet
  const validateProject = (project: Partial<Project>): string[] => {
    const errors: string[] = [];
    
    if (!project.title?.trim()) {
      errors.push('Le titre du projet est requis');
    }
    
    if (!project.startDate) {
      errors.push('La date de début est requise');
    }
    
    if (!project.endDate) {
      errors.push('La date de fin est requise');
    }
    
    if (project.startDate && project.endDate && project.startDate > project.endDate) {
      errors.push('La date de début doit être antérieure à la date de fin');
    }
    
    if (!project.interns || project.interns.length === 0) {
      errors.push('Au moins un stagiaire doit être assigné');
    }

    return errors;
  };

  // Calculer la progression d'un projet
  const calculateProjectProgress = (project: Project): number => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  // Dupliquer un projet
  const duplicateProject = async (project: Project) => {
    const duplicatedProject: Project = {
      ...project,
      id: Date.now() + Math.random(),
      title: `${project.title} (Copie)`,
      tasks: project.tasks.map(task => ({
        ...task,
        status: 'not-started' as const
      }))
    };
    
    const success = await addProject(duplicatedProject);
    return success ? duplicatedProject : null;
  };

  return {
    // État
    projects,
    filteredProjects,
    searchTerm,
    statusFilter,
    selectedProject,
    projectStats,
    loading,
    error,

    // Actions de base
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByStatus,
    fetchProjects,

    // Actions de filtrage
    setSearchTerm,
    setStatusFilter,

    // Actions de sélection
    handleSelectProject,
    handleDeselectProject,

    // Utilitaires
    calculateProjectProgress,
    validateProject,
    duplicateProject
  };
};
