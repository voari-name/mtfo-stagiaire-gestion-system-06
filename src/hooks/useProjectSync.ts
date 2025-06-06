
import { useProjectsContext } from "@/contexts/ProjectsContext";
import type { Intern, Project } from "@/types/dataTypes";

export const useProjectSync = () => {
  const { projects, addProject } = useProjectsContext();

  const syncInternToProject = (intern: Intern) => {
    // Vérifier si un projet existe déjà pour ce stagiaire
    const existingProject = projects.find(p => 
      p.interns.some(i => i.name === `${intern.firstName} ${intern.lastName}`)
    );

    if (!existingProject && intern.status === "fin") {
      // Créer un nouveau projet pour ce stagiaire terminé
      const newProject: Project = {
        id: Date.now() + Math.random(),
        title: intern.title,
        startDate: intern.startDate,
        endDate: intern.endDate,
        description: `Projet de stage: ${intern.title}`,
        interns: [{
          id: intern.id,
          name: `${intern.firstName} ${intern.lastName}`,
          status: intern.status,
          completion: 100
        }],
        tasks: [
          {
            id: 1,
            name: "Initialisation du projet",
            status: "completed"
          },
          {
            id: 2,
            name: "Développement",
            status: "completed"
          },
          {
            id: 3,
            name: "Finalisation",
            status: "completed"
          }
        ]
      };
      
      addProject(newProject);
    }
  };

  return { syncInternToProject };
};
