
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useEvaluations } from "@/hooks/useEvaluations";
import { useDataContext } from "@/contexts/DataContext";
import { EvaluationType } from "@/types/evaluations";
import { useSettings } from "@/contexts/SettingsContext";
import EvaluationsHeader from "@/components/evaluations/EvaluationsHeader";
import CompletedInternsSection from "@/components/evaluations/CompletedInternsSection";
import EvaluationsList from "@/components/evaluations/EvaluationsList";
import EvaluationDetailsView from "@/components/evaluations/EvaluationDetailsView";

const Evaluations = () => {
  const {
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
  } = useEvaluations();

  const { getCompletedInterns } = useDataContext();
  const { translations } = useSettings();
  const completedInterns = getCompletedInterns();
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationType | null>(null);

  const handleCreateEvaluationFromIntern = (intern: any) => {
    const newEvaluation: EvaluationType = {
      id: Date.now(),
      firstName: intern.firstName,
      lastName: intern.lastName,
      startDate: intern.startDate,
      endDate: intern.endDate,
      grade: 0,
      comment: ""
    };
    addEvaluation(newEvaluation);
  };

  const handleOpenEvaluation = (evaluation: EvaluationType) => {
    setSelectedEvaluation(evaluation);
  };

  const handleBackToList = () => {
    setSelectedEvaluation(null);
  };

  // If an evaluation is selected, show its details
  if (selectedEvaluation) {
    return (
      <MainLayout 
        title={translations["Détails de l'évaluation"] || "Détails de l'évaluation"} 
        currentPage="evaluations" 
        username="RAHAJANIAINA Olivier"
      >
        <EvaluationDetailsView
          evaluation={selectedEvaluation}
          currentEvaluation={currentEvaluation}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          onEdit={handleEditEvaluation}
          onDelete={handleDeleteEvaluation}
          onGeneratePdf={handleGeneratePdf}
          onBack={handleBackToList}
          onSave={handleSaveEvaluation}
          onInputChange={handleInputChange}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={translations["Évaluations des stagiaires"] || "Évaluations des stagiaires"} 
      currentPage="evaluations" 
      username="RAHAJANIAINA Olivier"
    >
      <div className="space-y-6 animate-fade-in">
        <EvaluationsHeader onEvaluationCreated={addEvaluation} />

        <CompletedInternsSection
          completedInterns={completedInterns}
          evaluations={evaluations}
          onCreateEvaluation={handleCreateEvaluationFromIntern}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            {translations["Évaluations complétées"] || "Évaluations complétées"}
          </h3>
          <EvaluationsList
            evaluations={evaluations}
            onOpenEvaluation={handleOpenEvaluation}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Evaluations;
