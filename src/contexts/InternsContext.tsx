import React, { createContext, useContext, ReactNode, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { triggerNotification } from "@/utils/notifications";
import type { Intern } from "@/types/dataTypes";

interface InternsContextType {
  interns: Intern[];
  addIntern: (intern: Intern) => void;
  updateIntern: (intern: Intern) => void;
  deleteIntern: (id: string) => void;
  getCompletedInterns: () => Intern[];
}

const InternsContext = createContext<InternsContextType | undefined>(undefined);

export const InternsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const { toast } = useToast();

  const addIntern = (newIntern: Intern) => {
    // Ensure the intern has all required fields including photo
    const internWithDefaults = {
      ...newIntern,
      photo: newIntern.photo || "",
      gender: newIntern.gender || "Masculin"
    };
    
    setInterns(prev => [...prev, internWithDefaults]);
    toast({
      title: "Stagiaire ajouté",
      description: `${newIntern.firstName} ${newIntern.lastName} a été ajouté avec succès.`,
    });
    
    triggerNotification({
      title: "Nouveau stagiaire",
      message: `${newIntern.firstName} ${newIntern.lastName} a été ajouté au système`,
      type: 'success'
    });
  };

  const updateIntern = (updatedIntern: Intern) => {
    // Ensure the intern has all required fields including photo
    const internWithDefaults = {
      ...updatedIntern,
      photo: updatedIntern.photo || "",
      gender: updatedIntern.gender || "Masculin"
    };
    
    setInterns(prev => prev.map(intern => 
      intern.id === updatedIntern.id ? internWithDefaults : intern
    ));
    toast({
      title: "Stagiaire modifié",
      description: `${updatedIntern.firstName} ${updatedIntern.lastName} a été modifié avec succès.`,
    });
    
    triggerNotification({
      title: "Stagiaire modifié",
      message: `Informations de ${updatedIntern.firstName} ${updatedIntern.lastName} mises à jour`,
      type: 'info'
    });
  };

  const deleteIntern = (id: string) => {
    const intern = interns.find(i => i.id === id);
    setInterns(prev => prev.filter(intern => intern.id !== id));
    toast({
      title: "Stagiaire supprimé",
      description: "Le stagiaire a été supprimé avec succès.",
      variant: "destructive"
    });
    
    if (intern) {
      triggerNotification({
        title: "Stagiaire supprimé",
        message: `${intern.firstName} ${intern.lastName} a été retiré du système`,
        type: 'warning'
      });
    }
  };

  const getCompletedInterns = () => {
    return interns.filter(intern => intern.status === "fin");
  };

  const value: InternsContextType = {
    interns,
    addIntern,
    updateIntern,
    deleteIntern,
    getCompletedInterns
  };

  return (
    <InternsContext.Provider value={value}>
      {children}
    </InternsContext.Provider>
  );
};

export const useInternsContext = () => {
  const context = useContext(InternsContext);
  if (context === undefined) {
    throw new Error('useInternsContext must be used within an InternsProvider');
  }
  return context;
};
