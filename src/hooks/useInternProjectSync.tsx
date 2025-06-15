
import { useEffect } from "react";
import { useDataContext } from "@/contexts/DataContext";
import type { TablesInsert } from "@/integrations/supabase/types";

export const useInternProjectSync = () => {
  const { projects, interns, addProject, addProjectIntern } = useDataContext();

  useEffect(() => {
    const syncInternsWithProjects = async () => {
      for (const intern of interns) {
        const existingProject = projects.find(p => 
          p.interns.some(i => i.id === intern.id)
        );

        if (!existingProject) {
          const newProjectData: Omit<TablesInsert<'projects'>, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
            title: intern.title,
            start_date: intern.startDate,
            end_date: intern.endDate,
            description: `Projet de stage: ${intern.title} - ${intern.firstName} ${intern.lastName}`,
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

          const newProject = await addProject(newProjectData);

          if (newProject && newProject.id && intern.id) {
            await addProjectIntern({
              project_id: newProject.id,
              intern_id: intern.id,
            });
          }
        }
      }
    };
    
    if (interns.length > 0 && projects) {
        syncInternsWithProjects();
    }
  }, [interns, projects, addProject, addProjectIntern]);

  return null;
};
