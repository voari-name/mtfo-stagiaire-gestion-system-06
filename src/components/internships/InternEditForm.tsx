
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Calendar, Mail, BookOpen, Star, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import PhotoUpload from "@/components/PhotoUpload";
import type { Intern } from "@/contexts/DataContext";

interface InternEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intern: Intern) => void;
  intern: Intern | null;
}

const InternEditForm = ({ isOpen, onClose, onSubmit, intern }: InternEditFormProps) => {
  const { translations } = useSettings();
  const { toast } = useToast();
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);

  useEffect(() => {
    if (intern) {
      setEditingIntern({ ...intern });
    }
  }, [intern]);

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingIntern) {
      setEditingIntern({ ...editingIntern, [name]: value });
    }
  };

  const handleEditSelectChange = (name: string, value: string) => {
    if (editingIntern) {
      setEditingIntern({ ...editingIntern, [name]: value });
    }
  };

  const handleEditPhotoChange = (photoUrl: string) => {
    if (editingIntern) {
      setEditingIntern({ ...editingIntern, photo: photoUrl });
    }
  };

  const validateEditForm = () => {
    if (!editingIntern) return false;
    
    if (!editingIntern.firstName.trim()) {
      toast({
        title: "Erreur",
        description: "Le prénom est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    if (!editingIntern.lastName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom est obligatoire", 
        variant: "destructive"
      });
      return false;
    }
    if (!editingIntern.email.trim()) {
      toast({
        title: "Erreur",
        description: "L'email est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    if (!editingIntern.title.trim()) {
      toast({
        title: "Erreur", 
        description: "L'intitulé du stage est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSaveEdit = () => {
    if (!validateEditForm() || !editingIntern) return;
    
    const updatedIntern = {
      ...editingIntern,
      firstName: editingIntern.firstName.trim(),
      lastName: editingIntern.lastName.trim(),
      title: editingIntern.title.trim(),
      email: editingIntern.email.trim()
    };
    
    onSubmit(updatedIntern);
    onClose();
  };

  if (!editingIntern) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {translations["Modifier le stagiaire"] || "Modifier le stagiaire"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <PhotoUpload 
            value={editingIntern.photo}
            onChange={handleEditPhotoChange}
            firstName={editingIntern.firstName}
            lastName={editingIntern.lastName}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="editLastName" className="text-sm font-semibold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                {translations["Nom"] || "Nom"}
              </Label>
              <Input 
                id="editLastName" 
                name="lastName" 
                value={editingIntern.lastName} 
                onChange={handleEditInputChange}
                className="border-2 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="editFirstName" className="text-sm font-semibold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                {translations["Prénom"] || "Prénom"}
              </Label>
              <Input 
                id="editFirstName" 
                name="firstName" 
                value={editingIntern.firstName} 
                onChange={handleEditInputChange}
                className="border-2 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="editGender" className="text-sm font-semibold text-gray-700 flex items-center">
              <UserCircle className="w-4 h-4 mr-2" />
              Sexe
            </Label>
            <Select 
              value={editingIntern.gender || "Masculin"} 
              onValueChange={(value) => handleEditSelectChange("gender", value)}
            >
              <SelectTrigger id="editGender" className="border-2 focus:border-blue-500 transition-colors bg-white">
                <SelectValue placeholder="Sélectionnez le sexe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculin">Masculin</SelectItem>
                <SelectItem value="Féminin">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="editTitle" className="text-sm font-semibold text-gray-700 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              {translations["Intitulé du stage"] || "Intitulé du stage"}
            </Label>
            <Input 
              id="editTitle" 
              name="title" 
              value={editingIntern.title} 
              onChange={handleEditInputChange}
              className="border-2 focus:border-blue-500 transition-colors bg-white"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="editEmail" className="text-sm font-semibold text-gray-700 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Label>
            <Input 
              id="editEmail" 
              name="email" 
              type="email" 
              value={editingIntern.email} 
              onChange={handleEditInputChange}
              className="border-2 focus:border-blue-500 transition-colors bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="editStartDate" className="text-sm font-semibold text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {translations["Date de début"] || "Date de début"}
              </Label>
              <Input 
                id="editStartDate" 
                name="startDate" 
                type="date" 
                value={editingIntern.startDate} 
                onChange={handleEditInputChange}
                className="border-2 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="editEndDate" className="text-sm font-semibold text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {translations["Date de fin"] || "Date de fin"}
              </Label>
              <Input 
                id="editEndDate" 
                name="endDate" 
                type="date" 
                value={editingIntern.endDate} 
                onChange={handleEditInputChange}
                className="border-2 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="editStatus" className="text-sm font-semibold text-gray-700 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              {translations["Statut"] || "Statut"}
            </Label>
            <Select 
              value={editingIntern.status} 
              onValueChange={(value) => handleEditSelectChange("status", value)}
            >
              <SelectTrigger id="editStatus" className="border-2 focus:border-blue-500 transition-colors bg-white">
                <SelectValue placeholder={translations["Sélectionnez un statut"] || "Sélectionnez un statut"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="début">{translations["Début"] || "Début"}</SelectItem>
                <SelectItem value="en cours">{translations["En cours"] || "En cours"}</SelectItem>
                <SelectItem value="fin">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="hover:bg-gray-100">
            {translations["Annuler"] || "Annuler"}
          </Button>
          <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            {translations["Enregistrer"] || "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternEditForm;
