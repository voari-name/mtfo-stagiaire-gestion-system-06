
import { useToast } from "@/hooks/use-toast";
import { EvaluationType } from "@/types/evaluations";
import { generateEvaluationPDF } from "@/utils/evaluationPdfGenerator";
import { useDataContext } from "@/contexts/DataContext";
import { useState } from "react";

export const useEvaluations = () => {
  const { evaluations, addEvaluation: addEvaluationToContext, updateEvaluation, deleteEvaluation } = useDataContext();
  const [currentEvaluation, setCurrentEvaluation] = useState<EvaluationType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const addEvaluation = (newEvaluation: EvaluationType) => {
    addEvaluationToContext(newEvaluation);
  };

  const handleEditEvaluation = (evaluation: EvaluationType) => {
    setCurrentEvaluation({ ...evaluation });
    setIsEditDialogOpen(true);
  };

  const handleSaveEvaluation = () => {
    if (currentEvaluation) {
      updateEvaluation(currentEvaluation);
      setIsEditDialogOpen(false);
      toast({
        title: "Évaluation mise à jour",
        description: `L'évaluation de ${currentEvaluation.firstName} ${currentEvaluation.lastName} a été modifiée.`,
      });
    }
  };

  const handleDeleteEvaluation = (id: number) => {
    deleteEvaluation(id);
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
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la génération du certificat.",
          variant: "destructive",
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
