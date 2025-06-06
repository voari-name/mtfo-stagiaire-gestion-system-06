
import { useMemo } from 'react';
import type { Project } from '@/types/dataTypes';

export const useProjectsFilters = (
  projects: Project[],
  searchTerm: string,
  statusFilter: string
) => {
  // Filtrage intelligent des projets
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filtrage par terme de recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.interns.some(intern => 
          intern.name.toLowerCase().includes(searchLower)
        )
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project =>
        project.interns.some(intern => intern.status === statusFilter)
      );
    }

    return filtered;
  }, [projects, searchTerm, statusFilter]);

  // Statistiques des projets
  const projectStats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter(p => 
      p.interns.every(intern => intern.status === 'fin')
    ).length;
    const inProgress = projects.filter(p => 
      p.interns.some(intern => intern.status === 'en cours')
    ).length;
    const notStarted = projects.filter(p => 
      p.interns.every(intern => intern.status === 'début')
    ).length;

    return { total, completed, inProgress, notStarted };
  }, [projects]);

  return {
    filteredProjects,
    projectStats
  };
};
