
import type { Project } from '@/types/dataTypes';

export const useProjectsUtils = (projects: Project[]) => {
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
  const duplicateProject = async (project: Project, addProject: (project: Project) => Promise<boolean>) => {
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
    getProjectById,
    getProjectsByStatus,
    validateProject,
    calculateProjectProgress,
    duplicateProject
  };
};
