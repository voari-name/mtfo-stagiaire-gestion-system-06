
import { useState, useMemo } from 'react';
import { useProjectsContext } from '@/contexts/ProjectsContext';
import type { Project } from '@/types/dataTypes';

export const useProjectsLogic = () => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByStatus,
    calculateProjectProgress
  } = useProjectsContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  // Fonctions utilitaires
  const getProjectProgress = (project: Project) => {
    return calculateProjectProgress(project);
  };

  const duplicateProject = (project: Project) => {
    const duplicatedProject: Project = {
      ...project,
      id: Date.now() + Math.random(),
      title: `${project.title} (Copie)`,
      tasks: project.tasks.map(task => ({
        ...task,
        status: 'not-started' as const
      }))
    };
    
    addProject(duplicatedProject);
    return duplicatedProject;
  };

  return {
    // État
    projects,
    filteredProjects,
    searchTerm,
    statusFilter,
    selectedProject,
    projectStats,

    // Actions de base
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByStatus,

    // Actions de filtrage
    setSearchTerm,
    setStatusFilter,

    // Actions de sélection
    handleSelectProject,
    handleDeselectProject,

    // Utilitaires
    getProjectProgress,
    validateProject,
    duplicateProject
  };
};
