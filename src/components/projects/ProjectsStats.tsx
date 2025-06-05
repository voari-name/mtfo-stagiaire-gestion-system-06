
import React from "react";
import { FolderPlus } from "lucide-react";
import type { Project } from "@/types/dataTypes";

interface ProjectsStatsProps {
  projects: Project[];
  translations: Record<string, string>;
}

const ProjectsStats: React.FC<ProjectsStatsProps> = ({ projects, translations }) => {
  const activeProjects = projects.filter(p => {
    const today = new Date();
    const startDate = new Date(p.startDate);
    const endDate = new Date(p.endDate);
    return startDate <= today && endDate >= today;
  }).length;

  const completedProjects = projects.filter(p => {
    const today = new Date();
    const endDate = new Date(p.endDate);
    return endDate < today;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-600 text-sm font-semibold">
              {translations["Total des projets"] || "Total des projets"}
            </p>
            <p className="text-3xl font-bold text-gray-800">{projects.length}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <FolderPlus className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-teal-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-600 text-sm font-semibold">
              {translations["Projets actifs"] || "Projets actifs"}
            </p>
            <p className="text-3xl font-bold text-gray-800">{activeProjects}</p>
          </div>
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-cyan-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-600 text-sm font-semibold">
              {translations["Projets terminés"] || "Projets terminés"}
            </p>
            <p className="text-3xl font-bold text-gray-800">{completedProjects}</p>
          </div>
          <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsStats;
