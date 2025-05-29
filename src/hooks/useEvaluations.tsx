
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EvaluationType } from "@/types/evaluations";
import { generateEvaluationPDF } from "@/utils/evaluationPdfGenerator";

// Import the notification trigger function
const triggerNotification = (notification: { title: string; message: string; type: 'success' | 'info' | 'warning' }) => {
  const event = new CustomEvent('customNotification', { detail: notification });
  window.dispatchEvent(event);
};

export const useEvaluations = () => {
  const [evaluations, setEvaluations] = useState<EvaluationType[]>([]);
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const addEvaluation = (newEvaluation: EvaluationType) => {
    setEvaluations([...evaluations, newEvaluation]);
    
    // Trigger notification
    triggerNotification({
      title: "Évaluation créée",
      message: `Évaluation de ${newEvaluation.firstName} ${newEvaluation.lastName} ajoutée`,
      type: 'success'
    });
  };

  const handleEditEvaluation = (evaluation: EvaluationType) => {
    setCurrentEvaluation({ ...evaluation });
    setIsEditDialogOpen(true);
  };

  const handleSaveEvaluation = () => {
    if (currentEvaluation) {
      setEvaluations(evaluations.map(item => 
        item.id === currentEvaluation.id ? currentEvaluation : item
      ));
      
      setIsEditDialogOpen(false);
      toast({
        title: "Évaluation mise à jour",
        description: `L'évaluation de ${currentEvaluation.firstName} ${currentEvaluation.lastName} a été modifiée.`,
      });
      
      // Trigger notification
      triggerNotification({
        title: "Évaluation modifiée",
        message: `Évaluation de ${currentEvaluation.firstName} ${currentEvaluation.lastName} mise à jour`,
        type: 'info'
      });
    }
  };

  const handleDeleteEvaluation = (id: number) => {
    const evaluation = evaluations.find(e => e.id === id);
    setEvaluations(evaluations.filter(item => item.id !== id));
    toast({
      title: "Évaluation supprimée",
      description: "L'évaluation a été supprimée avec succès.",
      variant: "destructive"
    });
    
    // Trigger notification
    if (evaluation) {
      triggerNotification({
        title: "Évaluation supprimée",
        message: `Évaluation de ${evaluation.firstName} ${evaluation.lastName} supprimée`,
        type: 'warning'
      });
    }
  };

  const handleGeneratePdf = async (id: number) => {
    const evaluation = evaluations.find(e => e.id === id);
    if (evaluation) {
      try {
        console.log('Génération du PDF pour:', evaluation);
        await generateEvaluationPDF(evaluation);
        toast({
          title: "Certificat généré avec succès",
          description: `Le certificat d'évaluation pour ${evaluation.firstName} ${evaluation.lastName} a été téléchargé.`,
        });
        
        // Trigger notification for PDF generation
        triggerNotification({
          title: "PDF téléchargé",
          message: `Certificat de ${evaluation.firstName} ${evaluation.lastName} généré avec succès`,
          type: 'success'
        });
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la génération du certificat.",
          variant: "destructive",
        });
        
        // Trigger error notification
        triggerNotification({
          title: "Erreur PDF",
          message: "Échec de génération du certificat",
          type: 'warning'
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentEvaluation) {
      setCurrentEvaluation({
        ...currentEvaluation,
        [name]: name === "grade" ? parseInt(value, 10) || 0 : value
      });
    }
  };

  return {
    evaluations,
    currentEvaluation,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEditEvaluation,
    handleSaveEvaluation,
    handleDeleteEvaluation,
    handleGeneratePdf,
    handleInputChange,
    addEvaluation
  };
};
