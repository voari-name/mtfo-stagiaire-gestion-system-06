
import React from "react";
import ProjectsList from "./ProjectsList";
import type { Project } from "@/types/dataTypes";

interface ProjectsListSectionProps {
  filteredProjects: Project[];
  calculateProgress: (tasks: any[]) => number;
  onViewDetails: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  translations: Record<string, string>;
}

const ProjectsListSection: React.FC<ProjectsListSectionProps> = ({
  filteredProjects,
  calculateProgress,
  onViewDetails,
  onEditProject,
  onDeleteProject,
  translations
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-emerald-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-4"></div>
          {translations["Liste des projets"] || "Liste des projets"}
        </h3>
        <p className="text-gray-600">
          {filteredProjects.length > 0 
            ? `${filteredProjects.length} ${translations["projet(s) trouvé(s)"] || "projet(s) trouvé(s)"}`
            : translations["Aucun projet disponible - Les projets sont créés automatiquement depuis la gestion des stagiaires"] || 
              "Aucun projet disponible - Les projets sont créés automatiquement depuis la gestion des stagiaires"
          }
        </p>
      </div>
      
      <ProjectsList
        projects={filteredProjects}
        calculateProgress={calculateProgress}
        onViewDetails={onViewDetails}
        onEditProject={onEditProject}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
};

export default ProjectsListSection;
