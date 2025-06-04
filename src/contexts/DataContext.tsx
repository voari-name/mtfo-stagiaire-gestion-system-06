import React, { createContext, useContext, ReactNode, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Import types
export interface Intern {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  startDate: string;
  endDate: string;
  status: "début" | "en cours" | "fin";
  gender: "Masculin" | "Féminin";
  photo?: string;
}

export interface Task {
  id: number;
  name: string;
  status: "completed" | "in-progress" | "not-started";
}

export interface ProjectIntern {
  id: number;
  name: string;
  status: "début" | "en cours" | "fin";
  completion: number;
}

export interface Project {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  interns: ProjectIntern[];
  tasks: Task[];
}

export interface EvaluationType {
  id: number;
  firstName: string;
  lastName: string;
  startDate: string;
  endDate: string;
  grade: number;
  comment: string;
}

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
  const [interns, setInterns] = useState<Intern[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationType[]>([]);
  const { toast } = useToast();

  // Notification trigger function
  const triggerNotification = (notification: { title: string; message: string; type: 'success' | 'info' | 'warning' }) => {
    const event = new CustomEvent('customNotification', { detail: notification });
    window.dispatchEvent(event);
  };

  // Intern functions
  const addIntern = (newIntern: Intern) => {
    // Ensure the intern has all required fields including photo
    const internWithDefaults = {
      ...newIntern,
      photo: newIntern.photo || "",
      gender: newIntern.gender || "Masculin"
    };
    
    setInterns(prev => [...prev, internWithDefaults]);
    toast({
      title: "Stagiaire ajouté",
      description: `${newIntern.firstName} ${newIntern.lastName} a été ajouté avec succès.`,
    });
    
    triggerNotification({
      title: "Nouveau stagiaire",
      message: `${newIntern.firstName} ${newIntern.lastName} a été ajouté au système`,
      type: 'success'
    });

    // Auto-create project if intern is completed
    if (newIntern.status === "fin") {
      syncInternToProject(newIntern);
    }
  };

  const updateIntern = (updatedIntern: Intern) => {
    // Ensure the intern has all required fields including photo
    const internWithDefaults = {
      ...updatedIntern,
      photo: updatedIntern.photo || "",
      gender: updatedIntern.gender || "Masculin"
    };
    
    setInterns(prev => prev.map(intern => 
      intern.id === updatedIntern.id ? internWithDefaults : intern
    ));
    toast({
      title: "Stagiaire modifié",
      description: `${updatedIntern.firstName} ${updatedIntern.lastName} a été modifié avec succès.`,
    });
    
    triggerNotification({
      title: "Stagiaire modifié",
      message: `Informations de ${updatedIntern.firstName} ${updatedIntern.lastName} mises à jour`,
      type: 'info'
    });

    // Auto-create project if intern is completed
    if (updatedIntern.status === "fin") {
      syncInternToProject(updatedIntern);
    }
  };

  const deleteIntern = (id: number) => {
    const intern = interns.find(i => i.id === id);
    setInterns(prev => prev.filter(intern => intern.id !== id));
    toast({
      title: "Stagiaire supprimé",
      description: "Le stagiaire a été supprimé avec succès.",
      variant: "destructive"
    });
    
    if (intern) {
      triggerNotification({
        title: "Stagiaire supprimé",
        message: `${intern.firstName} ${intern.lastName} a été retiré du système`,
        type: 'warning'
      });
    }
  };

  const getCompletedInterns = () => {
    return interns.filter(intern => intern.status === "fin");
  };

  // Project functions
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

  // Evaluation functions
  const addEvaluation = (newEvaluation: EvaluationType) => {
    setEvaluations(prev => [...prev, newEvaluation]);
    
    triggerNotification({
      title: "Évaluation créée",
      message: `Évaluation de ${newEvaluation.firstName} ${newEvaluation.lastName} ajoutée`,
      type: 'success'
    });
  };

  const updateEvaluation = (updatedEvaluation: EvaluationType) => {
    setEvaluations(prev => prev.map(evaluation => 
      evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
    ));
    
    toast({
      title: "Évaluation mise à jour",
      description: `L'évaluation de ${updatedEvaluation.firstName} ${updatedEvaluation.lastName} a été modifiée.`,
    });
    
    triggerNotification({
      title: "Évaluation modifiée",
      message: `Évaluation de ${updatedEvaluation.firstName} ${updatedEvaluation.lastName} mise à jour`,
      type: 'info'
    });
  };

  const deleteEvaluation = (id: number) => {
    const evaluation = evaluations.find(e => e.id === id);
    setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
    toast({
      title: "Évaluation supprimée",
      description: "L'évaluation a été supprimée avec succès.",
      variant: "destructive"
    });
    
    if (evaluation) {
      triggerNotification({
        title: "Évaluation supprimée",
        message: `Évaluation de ${evaluation.firstName} ${evaluation.lastName} supprimée`,
        type: 'warning'
      });
    }
  };

  // Helper function to sync completed interns to projects
  const syncInternToProject = (intern: Intern) => {
    const existingProject = projects.find(p => 
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
      setProjects(prev => [...prev, newProject]);
    }
  };

  const value: DataContextType = {
    // Interns
    interns,
    addIntern,
    updateIntern,
    deleteIntern,
    getCompletedInterns,
    
    // Projects
    projects,
    addProject,
    updateProject,
    deleteProject,
    
    // Evaluations
    evaluations,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation
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
