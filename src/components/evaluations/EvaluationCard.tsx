import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EvaluationType } from "@/types/dataTypes";
import { FileText, Edit3, Trash2, ArrowLeft } from "lucide-react";

interface EvaluationCardProps {
  evaluation: EvaluationType;
  onEdit: (evaluation: EvaluationType) => void;
  onDelete: (id: string) => void;
  onGeneratePdf: (id: string) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const EvaluationCard = ({ evaluation, onEdit, onDelete, onGeneratePdf, onCancel, showCancelButton = false }: EvaluationCardProps) => {
  const getGradeLabel = (grade: number) => {
    if (grade >= 16) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (grade >= 14) return { label: 'Très bien', color: 'bg-blue-100 text-blue-800' };
    if (grade >= 12) return { label: 'Bien', color: 'bg-yellow-100 text-yellow-800' };
    if (grade >= 10) return { label: 'Passable', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Insuffisant', color: 'bg-red-100 text-red-800' };
  };

  const gradeInfo = getGradeLabel(evaluation.grade);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div className="p-6 flex-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {evaluation.firstName.charAt(0)}{evaluation.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-800">{evaluation.firstName} {evaluation.lastName}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Du {new Date(evaluation.startDate).toLocaleDateString('fr-FR')} au {new Date(evaluation.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Note d'évaluation</p>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-800">{evaluation.grade}/20</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${gradeInfo.color}`}>
                    {gradeInfo.label}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Commentaire</p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{evaluation.comment || "Aucun commentaire"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex flex-col justify-center space-y-3 lg:w-56">
            <Button 
              onClick={() => onGeneratePdf(evaluation.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FileText className="mr-2 h-4 w-4" />
              Télécharger PDF
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onEdit(evaluation)}
              className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer l'évaluation de {evaluation.firstName} {evaluation.lastName} ?
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(evaluation.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {showCancelButton && onCancel && (
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="w-full border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationCard;
