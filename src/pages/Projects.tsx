import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useSettings } from "@/contexts/SettingsContext";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectsStats from "@/components/projects/ProjectsStats";
import ProjectsListSection from "@/components/projects/ProjectsListSection";
import ProjectDetails from "@/components/projects/ProjectDetails";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/dataTypes";
import { useDataContext } from "@/contexts/DataContext";
import type { Json, TablesUpdate } from "@/integrations/supabase/types";

const Projects = () => {
  const { projects, updateProject, deleteProject } = useDataContext();
  const { translations } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate progress for projects
  const calculateProgress = (tasks: any[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingProject) {
      const { id, title, startDate, endDate, description, status, tasks } = editingProject;
      
      const updates: Partial<TablesUpdate<'projects'>> = {
        title,
        start_date: startDate,
        end_date: endDate,
        description: description || null,
        status: status || null,
        tasks: tasks as unknown as Json,
      };

      updateProject(id, updates);
      setIsEditDialogOpen(false);
      setEditingProject(null);
      // Mettre à jour le projet sélectionné s'il correspond
      if (selectedProject && selectedProject.id === editingProject.id) {
        setSelectedProject(editingProject);
      }
    }
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    // Si le projet supprimé était sélectionné, revenir à la liste
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
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
        <div className="space-y-6">
          <Button 
            onClick={handleBackToList}
            variant="outline"
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {translations["Retour à la liste"] || "Retour à la liste"}
          </Button>
          
          <ProjectDetails
            project={selectedProject}
            onEdit={() => handleEditProject(selectedProject)}
            onDelete={() => handleDeleteProject(selectedProject.id)}
          />
        </div>
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
        <ProjectsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          translations={translations}
        />

        <ProjectsStats
          projects={projects}
          translations={translations}
        />

        <ProjectsListSection
          filteredProjects={filteredProjects}
          calculateProgress={calculateProgress}
          onViewDetails={handleViewDetails}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          translations={translations}
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
