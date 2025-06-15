
import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from "react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import type { Intern, Project, EvaluationType, Task, ProjectIntern } from "@/types/dataTypes";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Re-export types for backward compatibility
export type { Intern, Task, ProjectIntern, Project, EvaluationType };

interface DataContextType {
  interns: Intern[];
  addIntern: (intern: Omit<TablesInsert<'interns'>, 'id' | 'created_at' | 'updated_at'> & { email: string }) => Promise<void>;
  updateIntern: (intern: Intern) => Promise<void>;
  deleteIntern: (id: string) => Promise<void>;
  getCompletedInterns: () => Intern[];
  
  projects: Project[];
  addProject: (project: Omit<TablesInsert<'projects'>, 'id' | 'created_at' | 'updated_at'>) => Promise<Tables<'projects'> | undefined>;
  updateProject: (id: string, updates: Partial<TablesUpdate<'projects'>>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  evaluations: EvaluationType[];
  addEvaluation: (evaluation: any) => void;
  updateEvaluation: (evaluation: any) => void;
  deleteEvaluation: (id: string) => void;

  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const supabaseData = useSupabaseData();
  const [projectsWithInterns, setProjectsWithInterns] = useState<Project[]>([]);

  useEffect(() => {
    const { projects, interns, projectInterns } = supabaseData;
    if (projects.length && interns.length && projectInterns) {
      const enrichedProjects = projects.map(project => {
        const relatedInternIds = projectInterns
          .filter(pi => pi.project_id === project.id)
          .map(pi => pi.intern_id);
        
        const projectInternsData = interns
          .filter(intern => relatedInternIds.includes(intern.id))
          .map(intern => ({
            id: intern.id,
            name: `${intern.first_name} ${intern.last_name}`,
            status: (intern.status as any) || 'début',
            completion: intern.status === "fin" ? 100 : intern.status === "en cours" ? 50 : 0
          }));

        return {
          ...project,
          id: project.id,
          title: project.title,
          description: project.description || undefined,
          startDate: project.start_date,
          endDate: project.end_date,
          tasks: (project.tasks as Task[]) || [],
          interns: projectInternsData,
        };
      });
      setProjectsWithInterns(enrichedProjects);
    }
  }, [supabaseData.projects, supabaseData.interns, supabaseData.projectInterns]);

  const mappedInterns = useMemo(() => {
    return supabaseData.interns.map(intern => ({
      ...intern,
      id: intern.id,
      firstName: intern.first_name,
      lastName: intern.last_name,
      startDate: intern.start_date,
      endDate: intern.end_date,
      status: (intern.status as any) || 'début',
      gender: (intern.gender as any) || 'Masculin',
      email: '' // Placeholder, as email is not in the interns table.
    }));
  }, [supabaseData.interns]);

  const mappedEvaluations = useMemo(() => {
    // This mapping is lossy as DB schema and UI type differ significantly
    return supabaseData.evaluations.map(e => ({
      id: e.id,
      firstName: e.first_name,
      lastName: e.last_name,
      grade: e.grade,
      comment: e.comments || '',
      startDate: '', // Not in DB
      endDate: '' // Not in DB
    }))
  }, [supabaseData.evaluations]);

  const addIntern = async (newIntern: Omit<TablesInsert<'interns'>, 'id' | 'created_at' | 'updated_at'> & { email: string }) => {
    // email is not part of interns table, so we omit it.
    const { email, ...internData } = newIntern;
    await supabaseData.addIntern(internData);
  };
  
  const updateIntern = async (updatedIntern: Intern) => {
    const { id, firstName, lastName, startDate, endDate, ...rest } = updatedIntern;
    const updates: Partial<TablesUpdate<'interns'>> = {
      ...rest,
      first_name: firstName,
      last_name: lastName,
      start_date: startDate,
      end_date: endDate,
    };
    await supabaseData.updateIntern(id, updates);
  };

  const value: DataContextType = {
    loading: supabaseData.loading,
    interns: mappedInterns,
    addIntern,
    updateIntern,
    deleteIntern: supabaseData.deleteIntern,
    getCompletedInterns: () => mappedInterns.filter(i => i.status === 'fin'),
    
    projects: projectsWithInterns,
    addProject: supabaseData.addProject,
    updateProject: supabaseData.updateProject,
    deleteProject: supabaseData.deleteProject,
    
    evaluations: mappedEvaluations,
    addEvaluation: supabaseData.addEvaluation,
    updateEvaluation: supabaseData.updateEvaluation,
    deleteEvaluation: supabaseData.deleteEvaluation,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
