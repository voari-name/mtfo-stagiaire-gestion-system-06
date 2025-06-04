
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { InternsProvider, useInternsContext } from "@/contexts/InternsContext";
import { ProjectsProvider, useProjectsContext } from "@/contexts/ProjectsContext";
import { EvaluationsProvider, useEvaluationsContext } from "@/contexts/EvaluationsContext";
import { useProjectSync } from "@/hooks/useProjectSync";

// Re-export types for backward compatibility
export type { Intern, Task, ProjectIntern, Project, EvaluationType } from "@/types/dataTypes";

interface DataContextType {
  // Interns
  interns: any[];
  addIntern: (intern: any) => void;
  updateIntern: (intern: any) => void;
  deleteIntern: (id: number) => void;
  getCompletedInterns: () => any[];
  
  // Projects
  projects: any[];
  addProject: (project: any) => void;
  updateProject: (project: any) => void;
  deleteProject: (id: number) => void;
  
  // Evaluations
  evaluations: any[];
  addEvaluation: (evaluation: any) => void;
  updateEvaluation: (evaluation: any) => void;
  deleteEvaluation: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProviderInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const internsContext = useInternsContext();
  const projectsContext = useProjectsContext();
  const evaluationsContext = useEvaluationsContext();
  const { syncInternToProject } = useProjectSync();

  // Enhanced intern functions with project sync
  const addIntern = (newIntern: any) => {
    internsContext.addIntern(newIntern);
    
    // Auto-create project if intern is completed
    if (newIntern.status === "fin") {
      syncInternToProject(newIntern);
    }
  };

  const updateIntern = (updatedIntern: any) => {
    internsContext.updateIntern(updatedIntern);
    
    // Auto-create project if intern is completed
    if (updatedIntern.status === "fin") {
      syncInternToProject(updatedIntern);
    }
  };

  const value: DataContextType = {
    // Interns
    interns: internsContext.interns,
    addIntern,
    updateIntern,
    deleteIntern: internsContext.deleteIntern,
    getCompletedInterns: internsContext.getCompletedInterns,
    
    // Projects
    projects: projectsContext.projects,
    addProject: projectsContext.addProject,
    updateProject: projectsContext.updateProject,
    deleteProject: projectsContext.deleteProject,
    
    // Evaluations
    evaluations: evaluationsContext.evaluations,
    addEvaluation: evaluationsContext.addEvaluation,
    updateEvaluation: evaluationsContext.updateEvaluation,
    deleteEvaluation: evaluationsContext.deleteEvaluation
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <InternsProvider>
      <ProjectsProvider>
        <EvaluationsProvider>
          <DataProviderInner>
            {children}
          </DataProviderInner>
        </EvaluationsProvider>
      </ProjectsProvider>
    </InternsProvider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
