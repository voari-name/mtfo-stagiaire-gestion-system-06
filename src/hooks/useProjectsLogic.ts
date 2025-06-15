
import { useEffect } from 'react';
import type { Project } from '@/types/dataTypes';
import { useProjectsState } from './projects/useProjectsState';
import { useProjectsFilters } from './projects/useProjectsFilters';
import { useProjectsUtils } from './projects/useProjectsUtils';
import { useDataContext } from '@/contexts/DataContext';

export const useProjectsLogic = () => {
  const {
    projects: projectsFromContext,
    addProject: addProjectFromContext,
    updateProject: updateProjectFromContext,
    deleteProject: deleteProjectFromContext,
    loading: contextLoading
  } = useDataContext();

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
    handleSelectProject,
    handleDeselectProject
  } = useProjectsState();

  useEffect(() => {
    setProjects(projectsFromContext);
  }, [projectsFromContext, setProjects]);

  useEffect(() => {
    setLoading(contextLoading);
  }, [contextLoading, setLoading]);

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

  // Wrapper for dupliquer un projet avec accès à addProject
  const duplicateProjectWithAdd = async (project: Project) => {
    // This needs to be adapted for Supabase, `addProject` signature is different.
    // For now, we reuse the old logic which might not fully work.
    return duplicateProject(project, addProjectFromContext as any);
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
    addProject: addProjectFromContext,
    updateProject: updateProjectFromContext,
    deleteProject: deleteProjectFromContext,
    getProjectById,
    getProjectsByStatus,
    
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
