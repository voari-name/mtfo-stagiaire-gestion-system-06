
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

// Import the notification trigger function
const triggerNotification = (notification: { title: string; message: string; type: 'success' | 'info' | 'warning' }) => {
  const event = new CustomEvent('customNotification', { detail: notification });
  window.dispatchEvent(event);
};

export const useInternships = () => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const { toast } = useToast();

  const addIntern = (newIntern: Intern) => {
    setInterns(prev => [...prev, newIntern]);
    toast({
      title: "Stagiaire ajouté",
      description: `${newIntern.firstName} ${newIntern.lastName} a été ajouté avec succès.`,
    });
    
    // Trigger notification
    triggerNotification({
      title: "Nouveau stagiaire",
      message: `${newIntern.firstName} ${newIntern.lastName} a été ajouté au système`,
      type: 'success'
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
    
    // Trigger notification
    triggerNotification({
      title: "Stagiaire modifié",
      message: `Informations de ${updatedIntern.firstName} ${updatedIntern.lastName} mises à jour`,
      type: 'info'
    });
  };

  const deleteIntern = (id: number) => {
    const intern = interns.find(i => i.id === id);
    setInterns(prev => prev.filter(intern => intern.id !== id));
    toast({
      title: "Stagiaire supprimé",
      description: "Le stagiaire a été supprimé avec succès.",
      variant: "destructive"
    });
    
    // Trigger notification
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

  return {
    interns,
    addIntern,
    updateIntern,
    deleteIntern,
    getCompletedInterns
  };
};
