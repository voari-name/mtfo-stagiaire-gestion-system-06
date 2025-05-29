
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Intern {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  startDate: string;
  endDate: string;
  status: "début" | "en cours" | "fin";
}

export const useInternships = () => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const { toast } = useToast();

  const addIntern = (newIntern: Intern) => {
    setInterns(prev => [...prev, newIntern]);
    toast({
      title: "Stagiaire ajouté",
      description: `${newIntern.firstName} ${newIntern.lastName} a été ajouté avec succès.`,
    });
  };

  const updateIntern = (updatedIntern: Intern) => {
    setInterns(prev => prev.map(intern => 
      intern.id === updatedIntern.id ? updatedIntern : intern
    ));
    toast({
      title: "Stagiaire modifié",
      description: `${updatedIntern.firstName} ${updatedIntern.lastName} a été modifié avec succès.`,
    });
  };

  const deleteIntern = (id: number) => {
    setInterns(prev => prev.filter(intern => intern.id !== id));
    toast({
      title: "Stagiaire supprimé",
      description: "Le stagiaire a été supprimé avec succès.",
      variant: "destructive"
    });
  };

  const getCompletedInterns = () => {
    return interns.filter(intern => intern.status === "fin");
  };

  return {
    interns,
    addIntern,
    updateIntern,
    deleteIntern,
    getCompletedInterns
  };
};
