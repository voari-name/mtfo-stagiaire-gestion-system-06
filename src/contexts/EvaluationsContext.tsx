import React, { createContext, useContext, ReactNode, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { triggerNotification } from "@/utils/notifications";
import type { EvaluationType } from "@/types/dataTypes";

interface EvaluationsContextType {
  evaluations: EvaluationType[];
  addEvaluation: (evaluation: EvaluationType) => void;
  updateEvaluation: (evaluation: EvaluationType) => void;
  deleteEvaluation: (id: string) => void;
}

const EvaluationsContext = createContext<EvaluationsContextType | undefined>(undefined);

export const EvaluationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [evaluations, setEvaluations] = useState<EvaluationType[]>([]);
  const { toast } = useToast();

  const addEvaluation = (newEvaluation: EvaluationType) => {
    setEvaluations(prev => [...prev, newEvaluation]);
    
    triggerNotification({
      title: "Évaluation créée",
      message: `Évaluation de ${newEvaluation.firstName} ${newEvaluation.lastName} ajoutée`,
      type: 'success'
    });
  };

  const updateEvaluation = (updatedEvaluation: EvaluationType) => {
    setEvaluations(prev => prev.map(evaluation => 
      evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
    ));
    
    toast({
      title: "Évaluation mise à jour",
      description: `L'évaluation de ${updatedEvaluation.firstName} ${updatedEvaluation.lastName} a été modifiée.`,
    });
    
    triggerNotification({
      title: "Évaluation modifiée",
      message: `Évaluation de ${updatedEvaluation.firstName} ${updatedEvaluation.lastName} mise à jour`,
      type: 'info'
    });
  };

  const deleteEvaluation = (id: string) => {
    const evaluation = evaluations.find(e => e.id === id);
    setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
    toast({
      title: "Évaluation supprimée",
      description: "L'évaluation a été supprimée avec succès.",
      variant: "destructive"
    });
    
    if (evaluation) {
      triggerNotification({
        title: "Évaluation supprimée",
        message: `Évaluation de ${evaluation.firstName} ${evaluation.lastName} supprimée`,
        type: 'warning'
      });
    }
  };

  const value: EvaluationsContextType = {
    evaluations,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation
  };

  return (
    <EvaluationsContext.Provider value={value}>
      {children}
    </EvaluationsContext.Provider>
  );
};

export const useEvaluationsContext = () => {
  const context = useContext(EvaluationsContext);
  if (context === undefined) {
    throw new Error('useEvaluationsContext must be used within an EvaluationsProvider');
  }
  return context;
};
