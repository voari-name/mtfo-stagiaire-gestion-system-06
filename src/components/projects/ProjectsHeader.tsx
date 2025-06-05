
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, FolderPlus } from "lucide-react";

interface ProjectsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  translations: Record<string, string>;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  searchTerm,
  onSearchChange,
  translations
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 shadow-xl">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg flex items-center">
            <FolderPlus className="w-8 h-8 mr-3" />
            {translations["Gestion des projets"] || "Gestion des projets"}
          </h2>
          <p className="text-emerald-100 text-lg">
            {translations["Organisez et suivez vos projets de stage créés depuis la gestion des stagiaires"] || 
             "Organisez et suivez vos projets de stage créés depuis la gestion des stagiaires"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder={translations["Rechercher un projet..."] || "Rechercher un projet..."}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-80 bg-white/90 backdrop-blur-sm border-0 rounded-xl h-12 text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 focus:scale-105 focus:bg-white pl-12"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHeader;
