
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvaluationType } from "@/types/dataTypes";
import { useSettings } from "@/contexts/SettingsContext";

interface CompletedInternsSectionProps {
  completedInterns: any[];
  evaluations: EvaluationType[];
  onCreateEvaluation: (intern: any) => void;
}

const CompletedInternsSection = ({ 
  completedInterns, 
  evaluations, 
  onCreateEvaluation 
}: CompletedInternsSectionProps) => {
  const { translations } = useSettings();

  const internsWithoutEvaluation = completedInterns.filter(intern => 
    !evaluations.some(evalItem => 
      evalItem.firstName === intern.firstName && evalItem.lastName === intern.lastName
    )
  );

  if (internsWithoutEvaluation.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">
        {translations["Stagiaires terminés en attente d'évaluation"] || "Stagiaires terminés en attente d'évaluation"}
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {internsWithoutEvaluation.map((intern) => (
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
                <Button onClick={() => onCreateEvaluation(intern)}>
                  {translations["Créer l'évaluation"] || "Créer l'évaluation"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompletedInternsSection;
