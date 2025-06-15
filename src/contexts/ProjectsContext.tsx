
import React, { createContext, useContext, ReactNode, useState } from "react";
import type { Project } from "@/types/dataTypes";

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void; // Changed from number to string
  getProjectById: (id: string) => Project | undefined; // Changed from number to string
  getProjectsByStatus: (status: string) => Project[];
  calculateProjectProgress: (project: Project) => number;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const addProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  const deleteProject = (id: string) => { // Changed from number to string
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const getProjectById = (id: string): Project | undefined => { // Changed from number to string
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
