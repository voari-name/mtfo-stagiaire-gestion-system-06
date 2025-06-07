
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { API_URL } from '@/config/api';
import type { Intern, Project } from '@/types/dataTypes';

export const useProjectSync = () => {
  const { toast } = useToast();

  const syncInternToProject = async (intern: Intern) => {
    try {
      // Récupérer tous les projets
      const projectsResponse = await axios.get(`${API_URL}/projects`);
      const projects = projectsResponse.data.success ? projectsResponse.data.projects : [];
      
      // Vérifier si un projet existe déjà pour ce stagiaire
      const existingProject = projects.find((p: Project) => 
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
        
        // Envoyer la requête pour créer le projet
        const response = await axios.post(`${API_URL}/projects`, newProject);
        
        if (response.data.success) {
          toast({
            title: "Projet créé automatiquement",
            description: `Un projet a été créé pour le stagiaire ${intern.firstName} ${intern.lastName}`,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la synchronisation stagiaire-projet:', error);
      return false;
    }
  };

  return { syncInternToProject };
};
