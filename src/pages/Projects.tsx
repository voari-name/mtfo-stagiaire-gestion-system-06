
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectsList from "@/components/projects/ProjectsList";
import ProjectDetails from "@/components/projects/ProjectDetails";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import EditProjectDialog from "@/components/projects/EditProjectDialog";
import { useProjects } from "@/hooks/useProjects";
import { useDataContext } from "@/contexts/DataContext";

const Projects = () => {
  const {
    selectedProject,
    isDetailsOpen,
    isEditMode,
    setIsDetailsOpen,
    setIsEditMode,
    handleViewDetails,
    handleEditProject,
    handleSaveProject,
    updateSelectedProject,
    calculateProgress,
    getStatusColor
  } = useProjects();

  const { projects, deleteProject, addProject } = useDataContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <MainLayout title="Gestion des projets" currentPage="projects">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Projets</h2>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="debut">Début</TabsTrigger>
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <ProjectsList 
              projects={projects} 
              calculateProgress={calculateProgress}
              onViewDetails={handleViewDetails}
              onEditProject={handleEditProject}
              onDeleteProject={deleteProject}
            />
          </TabsContent>
          
          <TabsContent value="debut">
            <ProjectsList 
              projects={projects.filter(p => p.interns.some(i => i.status === "début"))} 
              calculateProgress={calculateProgress}
              onViewDetails={handleViewDetails}
              onEditProject={handleEditProject}
              onDeleteProject={deleteProject}
            />
          </TabsContent>
          
          <TabsContent value="active">
            <ProjectsList 
              projects={projects.filter(p => p.interns.some(i => i.status === "en cours"))} 
              calculateProgress={calculateProgress}
              onViewDetails={handleViewDetails}
              onEditProject={handleEditProject}
              onDeleteProject={deleteProject}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <ProjectsList 
              projects={projects.filter(p => p.interns.every(i => i.status === "fin"))} 
              calculateProgress={calculateProgress}
              onViewDetails={handleViewDetails}
              onEditProject={handleEditProject}
              onDeleteProject={deleteProject}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ProjectDetails 
        project={selectedProject} 
        open={isDetailsOpen && !isEditMode} 
        onOpenChange={setIsDetailsOpen} 
        getStatusColor={getStatusColor}
      />

      <EditProjectDialog
        project={selectedProject}
        open={isDetailsOpen && isEditMode}
        onOpenChange={setIsDetailsOpen}
        onSave={handleSaveProject}
        onProjectChange={updateSelectedProject}
      />

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onProjectCreated={addProject}
      />
    </MainLayout>
  );
};

export default Projects;
