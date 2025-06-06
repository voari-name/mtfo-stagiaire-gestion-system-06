
import { useEffect } from 'react';
import { useProjectsState } from './projects/useProjectsState';
import { useProjectsAPI } from './projects/useProjectsAPI';
import { useProjectsFilters } from './projects/useProjectsFilters';
import { useProjectsUtils } from './projects/useProjectsUtils';

export const useProjectsLogic = () => {
  const {
    projects,
    setProjects,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedProject,
    setSelectedProject,
    loading,
    setLoading,
    error,
    setError,
    handleSelectProject,
    handleDeselectProject
  } = useProjectsState();

  const {
    fetchProjects,
    addProject,
    updateProject,
    deleteProject
  } = useProjectsAPI(setProjects, setLoading, setError);

  const {
    filteredProjects,
    projectStats
  } = useProjectsFilters(projects, searchTerm, statusFilter);

  const {
    getProjectById,
    getProjectsByStatus,
    validateProject,
    calculateProjectProgress,
    duplicateProject
  } = useProjectsUtils(projects);

  // Charger les projets au montage du composant
  useEffect(() => {
    fetchProjects();
  }, []);

  // Wrapper pour dupliquer un projet avec accès à addProject
  const duplicateProjectWithAdd = async (project: Project) => {
    return duplicateProject(project, addProject);
  };

  return {
    // État
    projects,
    filteredProjects,
    searchTerm,
    statusFilter,
    selectedProject,
    projectStats,
    loading,
    error,

    // Actions de base
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByStatus,
    fetchProjects,

    // Actions de filtrage
    setSearchTerm,
    setStatusFilter,

    // Actions de sélection
    handleSelectProject,
    handleDeselectProject,

    // Utilitaires
    calculateProjectProgress,
    validateProject,
    duplicateProject: duplicateProjectWithAdd
  };
};
