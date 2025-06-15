import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EvaluationType } from "@/types/dataTypes";
import { useSettings } from "@/contexts/SettingsContext";

interface EvaluationsListProps {
  evaluations: EvaluationType[];
  onOpenEvaluation: (evaluation: EvaluationType) => void;
}

const EvaluationsList = ({ evaluations, onOpenEvaluation }: EvaluationsListProps) => {
  const { translations } = useSettings();

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {translations["Aucune évaluation pour le moment"] || "Aucune évaluation pour le moment"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {evaluations.map((evaluation, index) => (
        <Card 
          key={evaluation.id} 
          className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in" 
          style={{animationDelay: `${index * 0.1}s`}}
        >
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
                <Button onClick={() => onOpenEvaluation(evaluation)}>
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
  );
};

export default EvaluationsList;
