
import { EvaluationType } from "@/types/evaluations";
import EvaluationCard from "@/components/evaluations/EvaluationCard";
import EditEvaluationDialog from "@/components/evaluations/EditEvaluationDialog";

interface EvaluationDetailsViewProps {
  evaluation: EvaluationType;
  currentEvaluation: EvaluationType | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  onEdit: (evaluation: EvaluationType) => void;
  onDelete: (id: number) => void;
  onGeneratePdf: (id: number) => void;
  onBack: () => void;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EvaluationDetailsView = ({
  evaluation,
  currentEvaluation,
  isEditDialogOpen,
  setIsEditDialogOpen,
  onEdit,
  onDelete,
  onGeneratePdf,
  onBack,
  onSave,
  onInputChange
}: EvaluationDetailsViewProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <EvaluationCard
        evaluation={evaluation}
        onEdit={onEdit}
        onDelete={onDelete}
        onGeneratePdf={onGeneratePdf}
        onCancel={onBack}
        showCancelButton={true}
      />

      <EditEvaluationDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        evaluation={currentEvaluation}
        onSave={onSave}
        onInputChange={onInputChange}
      />
    </div>
  );
};

export default EvaluationDetailsView;
