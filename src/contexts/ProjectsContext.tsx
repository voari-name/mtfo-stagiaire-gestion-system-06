
import React, { createContext, useContext, ReactNode, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/types/dataTypes";

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: number) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  const addProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
    toast({
      title: "Projet ajouté",
      description: `Le projet "${newProject.title}" a été créé avec succès.`,
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
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    toast({
      title: "Projet supprimé",
      description: "Le projet a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const value: ProjectsContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject
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
