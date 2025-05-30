
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Input } from "@/components/ui/input";
import EvaluationCard from "@/components/evaluations/EvaluationCard";
import EditEvaluationDialog from "@/components/evaluations/EditEvaluationDialog";
import { CreateEvaluationDialog } from "@/components/evaluations/CreateEvaluationDialog";
import { useEvaluations } from "@/hooks/useEvaluations";
import { useDataContext } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvaluationType } from "@/types/evaluations";
import { useSettings } from "@/contexts/SettingsContext";

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
      grade: 0, // Note non pré-remplie
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

  // Si une évaluation est sélectionnée, afficher ses détails
  if (selectedEvaluation) {
    return (
      <MainLayout title={translations["Détails de l'évaluation"] || "Détails de l'évaluation"} currentPage="evaluations" username="RAHAJANIAINA Olivier">
        <div className="space-y-6 animate-fade-in">
          <EvaluationCard
            evaluation={selectedEvaluation}
            onEdit={handleEditEvaluation}
            onDelete={handleDeleteEvaluation}
            onGeneratePdf={handleGeneratePdf}
            onCancel={handleBackToList}
            showCancelButton={true}
          />
        </div>

        <EditEvaluationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          evaluation={currentEvaluation}
          onSave={handleSaveEvaluation}
          onInputChange={handleInputChange}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout title={translations["Évaluations des stagiaires"] || "Évaluations des stagiaires"} currentPage="evaluations" username="RAHAJANIAINA Olivier">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{translations["Évaluations"] || "Évaluations"}</h2>
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder={translations["Rechercher une évaluation..."] || "Rechercher une évaluation..."}
              className="max-w-xs transition-all duration-300 focus:scale-105"
            />
            <CreateEvaluationDialog onEvaluationCreated={addEvaluation} />
          </div>
        </div>

        {/* Section pour les stagiaires terminés sans évaluation */}
        {completedInterns.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">{translations["Stagiaires terminés en attente d'évaluation"] || "Stagiaires terminés en attente d'évaluation"}</h3>
            <div className="grid grid-cols-1 gap-4">
              {completedInterns
                .filter(intern => !evaluations.some(evalItem => 
                  evalItem.firstName === intern.firstName && evalItem.lastName === intern.lastName
                ))
                .map((intern) => (
                  <Card key={intern.id} className="overflow-hidden border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{intern.lastName} {intern.firstName}</h4>
                          <p className="text-sm text-gray-600">{intern.title}</p>
                          <p className="text-xs text-gray-500">
                            Du {new Date(intern.startDate).toLocaleDateString('fr-FR')} au {new Date(intern.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Button onClick={() => handleCreateEvaluationFromIntern(intern)}>
                          {translations["Créer l'évaluation"] || "Créer l'évaluation"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Section des évaluations existantes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">{translations["Évaluations complétées"] || "Évaluations complétées"}</h3>
          <div className="grid grid-cols-1 gap-6">
            {evaluations.map((evaluation, index) => (
              <Card key={evaluation.id} className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-800 flex items-center justify-center text-white text-lg font-bold">
                          {evaluation.firstName.charAt(0)}{evaluation.lastName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{evaluation.lastName} {evaluation.firstName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Du {new Date(evaluation.startDate).toLocaleDateString('fr-FR')} au {new Date(evaluation.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{translations["Note"] || "Note"}</p>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">{evaluation.grade}/20</span>
                            <span className="ml-2 px-2 py-1 rounded bg-gray-100 text-xs">
                              {evaluation.grade >= 16 ? 'Excellent' : 
                               evaluation.grade >= 14 ? 'Très bien' : 
                               evaluation.grade >= 12 ? 'Bien' : 
                               evaluation.grade >= 10 ? 'Passable' : 'Insuffisant'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{translations["Commentaire"] || "Commentaire"}</p>
                          <p className="font-medium">{evaluation.comment}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 flex flex-col justify-center space-y-3 md:w-48">
                      <Button onClick={() => handleOpenEvaluation(evaluation)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        {translations["Ouvrir"] || "Ouvrir"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {evaluations.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">{translations["Aucune évaluation pour le moment"] || "Aucune évaluation pour le moment"}</p>
            </div>
          )}
        </div>
      </div>

      <EditEvaluationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        evaluation={currentEvaluation}
        onSave={handleSaveEvaluation}
        onInputChange={handleInputChange}
      />
    </MainLayout>
  );
};

export default Evaluations;
