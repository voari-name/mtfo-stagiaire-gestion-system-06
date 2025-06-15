
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useEvaluations } from "@/hooks/useEvaluations";
import { useDataContext } from "@/contexts/DataContext";
import { EvaluationType } from "@/types/dataTypes";
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
    const newEvaluation: Omit<EvaluationType, 'id'> = {
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
      <div className="space-y-8 animate-fade-in min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <EvaluationsHeader />

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200">
          <CompletedInternsSection
            completedInterns={completedInterns}
            evaluations={evaluations}
            onCreateEvaluation={handleCreateEvaluationFromIntern}
          />
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-200">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full mr-4"></div>
              {translations["Évaluations complétées"] || "Évaluations complétées"}
            </h3>
            <p className="text-gray-600">Consultez et gérez toutes les évaluations terminées</p>
          </div>
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
