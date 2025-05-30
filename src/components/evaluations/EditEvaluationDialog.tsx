
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EvaluationType } from "@/types/evaluations";

interface EditEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: EvaluationType | null;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditEvaluationDialog = ({ 
  open, 
  onOpenChange, 
  evaluation, 
  onSave, 
  onInputChange 
}: EditEvaluationDialogProps) => {
  if (!evaluation) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Modifier l'évaluation</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'évaluation de {evaluation.firstName} {evaluation.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">Prénom</Label>
              <Input 
                id="firstName" 
                name="firstName" 
                value={evaluation.firstName} 
                onChange={onInputChange} 
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Nom</Label>
              <Input 
                id="lastName" 
                name="lastName" 
                value={evaluation.lastName} 
                onChange={onInputChange} 
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Date de début</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="date" 
                value={evaluation.startDate} 
                onChange={onInputChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">Date de fin</Label>
              <Input 
                id="endDate" 
                name="endDate" 
                type="date" 
                value={evaluation.endDate} 
                onChange={onInputChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade" className="text-sm font-medium text-gray-700">Note (sur 20)</Label>
            <Input 
              id="grade" 
              name="grade" 
              type="number" 
              min="0" 
              max="20" 
              step="0.5"
              value={evaluation.grade}
              onChange={onInputChange}
              className="text-lg font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez une note entre 0 et 20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium text-gray-700">Commentaire</Label>
            <Input 
              id="comment" 
              name="comment" 
              value={evaluation.comment} 
              onChange={onInputChange}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              placeholder="Ajoutez un commentaire sur l'évaluation"
            />
          </div>
        </div>
        <DialogFooter className="gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 transition-colors duration-200 hover:bg-gray-50"
          >
            Annuler
          </Button>
          <Button 
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEvaluationDialog;
