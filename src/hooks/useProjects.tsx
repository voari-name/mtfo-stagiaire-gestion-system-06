
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
export type TaskStatus = "completed" | "in-progress" | "not-started";

export interface Task {
  id: number;
  name: string;
  status: TaskStatus;
}

export interface Intern {
  id: number;
  name: string;
  status: string;
  completion: number;
}

export interface Project {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  interns: Intern[];
  tasks: Task[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  // Function to calculate overall project progress
  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(task => task.status === "completed").length;
    return Math.round((completedCount / tasks.length) * 100);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
    setIsEditMode(false);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject({ ...project });
    setIsEditMode(true);
    setIsDetailsOpen(true);
  };

  const handleSaveProject = () => {
    if (selectedProject) {
      setProjects(projects.map(p => 
        p.id === selectedProject.id ? selectedProject : p
      ));
      setIsEditMode(false);
      toast({
        title: "Projet mis à jour",
        description: `Le projet "${selectedProject.title}" a été modifié avec succès.`,
      });
    }
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
    toast({
      title: "Projet supprimé",
      description: "Le projet a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const addProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const updateSelectedProject = (updatedProject: Project) => {
    setSelectedProject(updatedProject);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "not-started": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  return {
    projects,
    selectedProject,
    isDetailsOpen,
    isEditMode,
    setIsDetailsOpen,
    setIsEditMode,
    handleViewDetails,
    handleEditProject,
    handleSaveProject,
    handleDeleteProject,
    addProject,
    updateSelectedProject,
    calculateProgress,
    getStatusColor
  };
};
