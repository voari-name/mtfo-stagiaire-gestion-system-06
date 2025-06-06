
import { useState } from 'react';
import type { Project } from '@/types/dataTypes';

export const useProjectsState = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleDeselectProject = () => {
    setSelectedProject(null);
  };

  return {
    // State
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

    // Actions
    handleSelectProject,
    handleDeselectProject
  };
};
