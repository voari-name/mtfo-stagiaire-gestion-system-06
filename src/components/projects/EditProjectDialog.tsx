
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, FileText, Edit2, Sparkles } from "lucide-react";
import type { Project } from "@/types/dataTypes";

interface EditProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onProjectChange: (project: Project) => void;
}

const EditProjectDialog = ({ 
  project, 
  open, 
  onOpenChange, 
  onSave, 
  onProjectChange 
}: EditProjectDialogProps) => {
  if (!project) return null;

  const handleInputChange = (field: keyof Project, value: string) => {
    onProjectChange({
      ...project,
      [field]: value
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 animate-scale-in border-2 border-blue-200 shadow-2xl">
        <DialogHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-10 rounded-t-lg"></div>
          <div className="relative z-10 text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
                <Edit2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ✏️ Modifier le projet ✏️
            </DialogTitle>
            <p className="text-gray-600 mt-2">Mettre à jour les informations du projet</p>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* Project Title */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              Titre du projet
            </Label>
            <Input
              id="title"
              value={project.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
              placeholder="Entrez le titre du projet"
            />
          </div>
          
          {/* Dates */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200 shadow-lg">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">Période du projet</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Date de début
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={project.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="border-2 border-green-200 focus:border-green-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Date de fin
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={project.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="border-2 border-red-200 focus:border-red-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-lg">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
              Description
            </Label>
            <Textarea
              id="description"
              value={project.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="border-2 border-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/90 rounded-xl resize-none"
              placeholder="Décrivez les objectifs et les détails du projet..."
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t-2 border-blue-200 bg-white/50 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto hover:bg-gray-100 border-2 border-gray-300 rounded-xl px-8 h-12 transition-all duration-300 font-semibold"
          >
            Annuler
          </Button>
          <Button 
            onClick={onSave}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg rounded-xl px-8 h-12 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
