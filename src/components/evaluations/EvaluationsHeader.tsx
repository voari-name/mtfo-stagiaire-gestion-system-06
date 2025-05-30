
import { Input } from "@/components/ui/input";
import { CreateEvaluationDialog } from "@/components/evaluations/CreateEvaluationDialog";
import { EvaluationType } from "@/types/evaluations";
import { useSettings } from "@/contexts/SettingsContext";

interface EvaluationsHeaderProps {
  onEvaluationCreated: (evaluation: EvaluationType) => void;
}

const EvaluationsHeader = ({ onEvaluationCreated }: EvaluationsHeaderProps) => {
  const { translations } = useSettings();

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">{translations["Évaluations"] || "Évaluations"}</h2>
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder={translations["Rechercher une évaluation..."] || "Rechercher une évaluation..."}
          className="max-w-xs transition-all duration-300 focus:scale-105"
        />
        <CreateEvaluationDialog onEvaluationCreated={onEvaluationCreated} />
      </div>
    </div>
  );
};

export default EvaluationsHeader;
