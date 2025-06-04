
import { useProjectsContext } from "@/contexts/ProjectsContext";
import type { Intern, Project } from "@/types/dataTypes";

export const useProjectSync = () => {
  const { projects, addProject } = useProjectsContext();

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
      addProject(newProject);
    }
  };

  return { syncInternToProject };
};
