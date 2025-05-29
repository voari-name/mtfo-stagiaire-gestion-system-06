
import React, { createContext, useContext, ReactNode } from "react";
import { useInternships, Intern } from "@/hooks/useInternships";
import { useProjects, Project } from "@/hooks/useProjects";
import { useEvaluations } from "@/hooks/useEvaluations";
import { EvaluationType } from "@/types/evaluations";

interface DataContextType {
  // Interns
  interns: Intern[];
  addIntern: (intern: Intern) => void;
  updateIntern: (intern: Intern) => void;
  deleteIntern: (id: number) => void;
  getCompletedInterns: () => Intern[];
  
  // Projects
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: number) => void;
  
  // Evaluations
  evaluations: EvaluationType[];
  addEvaluation: (evaluation: EvaluationType) => void;
  updateEvaluation: (evaluation: EvaluationType) => void;
  deleteEvaluation: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const internshipHook = useInternships();
  const projectHook = useProjects();
  const evaluationHook = useEvaluations();

  // Sync completed interns to projects
  const syncInternsToProjects = (completedInterns: Intern[]) => {
    completedInterns.forEach(intern => {
      const existingProject = projectHook.projects.find(p => 
        p.title === intern.title && 
        p.interns.some(i => i.name === `${intern.firstName} ${intern.lastName}`)
      );

      if (!existingProject) {
        const newProject: Project = {
          id: Date.now() + Math.random(),
          title: intern.title,
          startDate: intern.startDate,
          endDate: intern.endDate,
          description: `Projet de stage de ${intern.firstName} ${intern.lastName}`,
          interns: [{
            id: intern.id,
            name: `${intern.firstName} ${intern.lastName}`,
            status: "fin",
            completion: 100
          }],
          tasks: [{
            id: 1,
            name: "Stage terminé",
            status: "completed"
          }]
        };
        projectHook.addProject(newProject);
      }
    });
  };

  const addIntern = (intern: Intern) => {
    internshipHook.addIntern(intern);
    if (intern.status === "fin") {
      syncInternsToProjects([intern]);
    }
  };

  const updateIntern = (intern: Intern) => {
    internshipHook.updateIntern(intern);
    if (intern.status === "fin") {
      syncInternsToProjects([intern]);
    }
  };

  const value: DataContextType = {
    // Interns
    interns: internshipHook.interns,
    addIntern,
    updateIntern,
    deleteIntern: internshipHook.deleteIntern,
    getCompletedInterns: internshipHook.getCompletedInterns,
    
    // Projects
    projects: projectHook.projects,
    addProject: projectHook.addProject,
    updateProject: (project: Project) => {
      projectHook.updateSelectedProject(project);
      projectHook.handleSaveProject();
    },
    deleteProject: projectHook.handleDeleteProject,
    
    // Evaluations
    evaluations: evaluationHook.evaluations,
    addEvaluation: evaluationHook.addEvaluation,
    updateEvaluation: (evaluation: EvaluationType) => {
      evaluationHook.handleEditEvaluation(evaluation);
      evaluationHook.handleSaveEvaluation();
    },
    deleteEvaluation: evaluationHook.handleDeleteEvaluation
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
