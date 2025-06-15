
import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from "react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import type { Intern, Project, EvaluationType, Task, ProjectIntern } from "@/types/dataTypes";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Re-export types for backward compatibility
export type { Intern, Task, ProjectIntern, Project, EvaluationType };

interface DataContextType {
  interns: Intern[];
  addIntern: (intern: Omit<Intern, 'id'>) => Promise<void>;
  updateIntern: (intern: Intern) => Promise<void>;
  deleteIntern: (id: string) => Promise<void>;
  getCompletedInterns: () => Intern[];
  
  projects: Project[];
  addProject: (project: Omit<TablesInsert<'projects'>, 'id' | 'created_at' | 'updated_at'>) => Promise<Tables<'projects'> | undefined>;
  updateProject: (id: string, updates: Partial<TablesUpdate<'projects'>>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addProjectIntern: (projectIntern: TablesInsert<'project_interns'>) => Promise<void>;
  
  evaluations: EvaluationType[];
  addEvaluation: (evaluation: Omit<EvaluationType, 'id'>) => void;
  updateEvaluation: (id: string, evaluation: Partial<EvaluationType>) => void;
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
          tasks: (project.tasks as unknown as Task[]) || [],
          interns: projectInternsData,
        };
      });
      setProjectsWithInterns(enrichedProjects);
    }
  }, [supabaseData.projects, supabaseData.interns, supabaseData.projectInterns]);

  const mappedInterns = useMemo(() => {
    console.log("📊 DataContext: Mapping interns from Supabase:", supabaseData.interns.length, "interns");
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

  const addIntern = async (newIntern: Omit<Intern, 'id'>) => {
    console.log("💾 DataContext: Adding intern to Supabase database:", newIntern);
    // email is not part of interns table, so we omit it.
    const { firstName, lastName, startDate, endDate, email, ...rest } = newIntern;
    const internData: TablesInsert<'interns'> = {
      ...rest,
      first_name: firstName,
      last_name: lastName,
      start_date: startDate,
      end_date: endDate,
      gender: rest.gender || 'Masculin',
    };
    await supabaseData.addIntern(internData);
    console.log("✅ DataContext: Intern successfully added to database");
  };
  
  const updateIntern = async (updatedIntern: Intern) => {
    console.log("💾 DataContext: Updating intern in Supabase database:", updatedIntern);
    const { id, firstName, lastName, startDate, endDate, ...rest } = updatedIntern;
    const updates: Partial<TablesUpdate<'interns'>> = {
      ...rest,
      first_name: firstName,
      last_name: lastName,
      start_date: startDate,
      end_date: endDate,
    };
    await supabaseData.updateIntern(id, updates);
    console.log("✅ DataContext: Intern successfully updated in database");
  };

  const addEvaluation = (evaluation: Omit<EvaluationType, 'id'>) => {
    console.log("💾 DataContext: Adding evaluation to Supabase database:", evaluation);
    const { firstName, lastName, comment, grade } = evaluation;
    const evaluationData: Omit<Tables<'evaluations'>, 'id' | 'created_at' | 'updated_at' | 'user_id'> & { user_id: string | null } = {
      first_name: firstName,
      last_name: lastName,
      comments: comment,
      grade: grade,
      user_id: null, // Or get current user id
    };
    supabaseData.addEvaluation(evaluationData);
    console.log("✅ DataContext: Evaluation successfully added to database");
  };

  const updateEvaluation = (id: string, evaluation: Partial<EvaluationType>) => {
    console.log("💾 DataContext: Updating evaluation in Supabase database:", id, evaluation);
    const { firstName, lastName, comment, startDate, endDate, ...rest } = evaluation;
    const updates: Partial<TablesUpdate<'evaluations'>> = { ...rest };
    if (firstName) updates.first_name = firstName;
    if (lastName) updates.last_name = lastName;
    if (comment) updates.comments = comment;
    supabaseData.updateEvaluation(id, updates);
    console.log("✅ DataContext: Evaluation successfully updated in database");
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
    addProjectIntern: supabaseData.addProjectIntern,
    
    evaluations: mappedEvaluations,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation: supabaseData.deleteEvaluation,
  };

  // Log when data is loaded from database
  useEffect(() => {
    if (!supabaseData.loading) {
      console.log("🎯 DataContext: Data successfully loaded from Supabase:");
      console.log("  - Interns:", mappedInterns.length);
      console.log("  - Projects:", projectsWithInterns.length);
      console.log("  - Evaluations:", mappedEvaluations.length);
    }
  }, [supabaseData.loading, mappedInterns.length, projectsWithInterns.length, mappedEvaluations.length]);

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
