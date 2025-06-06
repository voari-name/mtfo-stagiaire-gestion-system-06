
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { triggerNotification } from "@/utils/notifications";
import type { Project } from "@/types/dataTypes";

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: number) => void;
  getProjectById: (id: number) => Project | undefined;
  getProjectsByStatus: (status: string) => Project[];
  calculateProjectProgress: (project: Project) => number;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  // Chargement initial des projets depuis le localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      }
    }
  }, []);

  // Sauvegarde automatique des projets
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = (newProject: Project) => {
    // Vérifier si le projet existe déjà
    const existingProject = projects.find(p => p.id === newProject.id);
    if (existingProject) {
      console.warn('Un projet avec cet ID existe déjà');
      return;
    }

    setProjects(prev => [...prev, newProject]);
    
    toast({
      title: "Projet créé",
      description: `Le projet "${newProject.title}" a été créé avec succès.`,
    });
    
    triggerNotification({
      title: "Nouveau projet",
      message: `Projet "${newProject.title}" créé`,
      type: 'success'
    });
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
    
    toast({
      title: "Projet mis à jour",
      description: `Le projet "${updatedProject.title}" a été modifié avec succès.`,
    });
    
    triggerNotification({
      title: "Projet modifié",
      message: `Projet "${updatedProject.title}" mis à jour`,
      type: 'info'
    });
  };

  const deleteProject = (id: number) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(project => project.id !== id));
    
    toast({
      title: "Projet supprimé",
      description: "Le projet a été supprimé avec succès.",
      variant: "destructive"
    });
    
    if (project) {
      triggerNotification({
        title: "Projet supprimé",
        message: `Projet "${project.title}" supprimé`,
        type: 'warning'
      });
    }
  };

  const getProjectById = (id: number): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const getProjectsByStatus = (status: string): Project[] => {
    return projects.filter(project => 
      project.interns.some(intern => intern.status === status)
    );
  };

  const calculateProjectProgress = (project: Project): number => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const value: ProjectsContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByStatus,
    calculateProjectProgress
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
};
