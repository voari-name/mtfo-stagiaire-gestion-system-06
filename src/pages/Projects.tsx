
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useProjectsContext } from "@/contexts/ProjectsContext";
import { useSettings } from "@/contexts/SettingsContext";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import ProjectsList from "@/components/projects/ProjectsList";
import ProjectDetails from "@/components/projects/ProjectDetails";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, FolderPlus } from "lucide-react";
import type { Project } from "@/types/dataTypes";

const Projects = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjectsContext();
  const { translations } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingProject) {
      updateProject(editingProject);
      setIsEditDialogOpen(false);
      setEditingProject(null);
    }
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  // If a project is selected, show its details
  if (selectedProject) {
    return (
      <MainLayout 
        title={`${translations["Projet"] || "Projet"}: ${selectedProject.title}`} 
        currentPage="projects" 
        username="RAHAJANIAINA Olivier"
      >
        <ProjectDetails
          project={selectedProject}
          onBack={handleBackToList}
          onEdit={() => handleEditProject(selectedProject)}
          onDelete={() => {
            deleteProject(selectedProject.id);
            handleBackToList();
          }}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={translations["Gestion des projets"] || "Gestion des projets"} 
      currentPage="projects" 
      username="RAHAJANIAINA Olivier"
    >
      <div className="space-y-8 animate-fade-in min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg flex items-center">
                <FolderPlus className="w-8 h-8 mr-3" />
                {translations["Gestion des projets"] || "Gestion des projets"}
              </h2>
              <p className="text-emerald-100 text-lg">
                Créez, organisez et suivez vos projets de stage
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={translations["Rechercher un projet..."] || "Rechercher un projet..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 bg-white/90 backdrop-blur-sm border-0 rounded-xl h-12 text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 focus:scale-105 focus:bg-white pl-12"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg rounded-xl px-6 h-12 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                {translations["Nouveau projet"] || "Nouveau projet"}
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-semibold">Total des projets</p>
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
                <p className="text-teal-600 text-sm font-semibold">Projets actifs</p>
                <p className="text-3xl font-bold text-gray-800">{projects.filter(p => {
                  const today = new Date();
                  const startDate = new Date(p.startDate);
                  const endDate = new Date(p.endDate);
                  return startDate <= today && endDate >= today;
                }).length}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-cyan-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-600 text-sm font-semibold">Projets terminés</p>
                <p className="text-3xl font-bold text-gray-800">{projects.filter(p => {
                  const today = new Date();
                  const endDate = new Date(p.endDate);
                  return endDate < today;
                }).length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-emerald-200">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-4"></div>
              {translations["Liste des projets"] || "Liste des projets"}
            </h3>
            <p className="text-gray-600">
              {filteredProjects.length > 0 
                ? `${filteredProjects.length} projet(s) trouvé(s)`
                : "Aucun projet disponible"
              }
            </p>
          </div>
          
          <ProjectsList
            projects={filteredProjects}
            onViewDetails={handleViewDetails}
            onEditProject={handleEditProject}
            onDeleteProject={deleteProject}
          />
        </div>

        {/* Dialogs */}
        <CreateProjectDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onProjectCreated={addProject}
        />

        <EditProjectDialog
          project={editingProject}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
          onProjectChange={setEditingProject}
        />
      </div>
    </MainLayout>
  );
};

export default Projects;
