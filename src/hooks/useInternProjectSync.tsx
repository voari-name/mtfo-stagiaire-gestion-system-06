
import { useEffect } from "react";
import { useProjectsContext } from "@/contexts/ProjectsContext";
import { useDataContext } from "@/contexts/DataContext";
import type { Project } from "@/types/dataTypes";

export const useInternProjectSync = () => {
  const { projects, addProject } = useProjectsContext();
  const { interns } = useDataContext();

  useEffect(() => {
    // Synchroniser tous les stagiaires avec les projets
    interns.forEach(intern => {
      // Vérifier si un projet existe déjà pour ce stagiaire
      const existingProject = projects.find(p => 
        p.interns.some(i => i.name === `${intern.firstName} ${intern.lastName}`)
      );

      if (!existingProject) {
        // Créer un nouveau projet pour ce stagiaire
        const newProject: Project = {
          id: Date.now() + Math.random() + intern.id,
          title: intern.title,
          startDate: intern.startDate,
          endDate: intern.endDate,
          description: `Projet de stage: ${intern.title} - ${intern.firstName} ${intern.lastName}`,
          interns: [{
            id: intern.id,
            name: `${intern.firstName} ${intern.lastName}`,
            status: intern.status,
            completion: intern.status === "fin" ? 100 : intern.status === "en cours" ? 50 : 0
          }],
          tasks: [
            {
              id: 1,
              name: "Démarrage du stage",
              status: intern.status === "début" ? "in-progress" : "completed"
            },
            {
              id: 2,
              name: "Développement du projet",
              status: intern.status === "en cours" ? "in-progress" : 
                     intern.status === "fin" ? "completed" : "not-started"
            },
            {
              id: 3,
              name: "Finalisation et présentation",
              status: intern.status === "fin" ? "completed" : "not-started"
            }
          ]
        };
        addProject(newProject);
      }
    });
  }, [interns, projects, addProject]);

  return null;
};
