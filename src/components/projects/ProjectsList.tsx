
import React from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/hooks/useProjects";

interface ProjectsListProps {
  projects: Project[];
  calculateProgress: (tasks: any[]) => number;
  onViewDetails: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: number) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ 
  projects, 
  calculateProgress,
  onViewDetails,
  onEditProject,
  onDeleteProject
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Aucun projet trouvé</div>
        <p className="text-gray-400">Cliquez sur "Nouveau projet" pour commencer</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => {
        const progress = calculateProgress(project.tasks);
        return (
          <ProjectCard
            key={project.id}
            project={project}
            progress={progress}
            onViewDetails={onViewDetails}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
          />
        );
      })}
    </div>
  );
};

export default ProjectsList;
