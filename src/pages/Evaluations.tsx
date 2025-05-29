
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
  const completedInterns = getCompletedInterns();

  const handleCreateEvaluationFromIntern = (intern: any) => {
    const newEvaluation: EvaluationType = {
      id: Date.now(),
      firstName: intern.firstName,
      lastName: intern.lastName,
      startDate: intern.startDate,
      endDate: intern.endDate,
      grade: 16,
      comment: "Excellent travail"
    };
    addEvaluation(newEvaluation);
  };

  return (
    <MainLayout title="Évaluations des stagiaires" currentPage="evaluations" username="RAHAJANIAINA Olivier">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Évaluations</h2>
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Rechercher une évaluation..."
              className="max-w-xs transition-all duration-300 focus:scale-105"
            />
            <CreateEvaluationDialog onEvaluationCreated={addEvaluation} />
          </div>
        </div>

        {/* Section pour les stagiaires terminés sans évaluation */}
        {completedInterns.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Stagiaires terminés en attente d'évaluation</h3>
            <div className="grid grid-cols-1 gap-4">
              {completedInterns
                .filter(intern => !evaluations.some(eval => 
                  eval.firstName === intern.firstName && eval.lastName === intern.lastName
                ))
                .map((intern) => (
                  <Card key={intern.id} className="overflow-hidden border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{intern.firstName} {intern.lastName}</h4>
                          <p className="text-sm text-gray-600">{intern.title}</p>
                          <p className="text-xs text-gray-500">
                            Du {new Date(intern.startDate).toLocaleDateString('fr-FR')} au {new Date(intern.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Button onClick={() => handleCreateEvaluationFromIntern(intern)}>
                          Créer l'évaluation
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
          <h3 className="text-lg font-semibold text-gray-700">Évaluations complétées</h3>
          <div className="grid grid-cols-1 gap-6">
            {evaluations.map((evaluation, index) => (
              <div key={evaluation.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <EvaluationCard
                  evaluation={evaluation}
                  onEdit={handleEditEvaluation}
                  onDelete={handleDeleteEvaluation}
                  onGeneratePdf={handleGeneratePdf}
                />
              </div>
            ))}
          </div>
          
          {evaluations.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Aucune évaluation pour le moment</p>
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
