
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Calendar, Mail, BookOpen, Star, UserCircle, Sparkles, GraduationCap, Edit } from "lucide-react";
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
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 animate-scale-in border-2 border-amber-200 shadow-2xl">
        <DialogHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 opacity-10 rounded-t-lg"></div>
          <div className="relative z-10 text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full shadow-lg">
                <Edit className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              ✏️ {translations["Modifier le stagiaire"] || "Modifier le stagiaire"} ✏️
            </DialogTitle>
            <p className="text-gray-600 mt-2">Mettre à jour les informations de {editingIntern.firstName} {editingIntern.lastName}</p>
          </div>
        </DialogHeader>
        
        <div className="grid gap-8 py-6 animate-fade-in max-h-[70vh] overflow-y-auto" style={{animationDelay: '0.1s'}}>
          {/* Photo Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg">
            <PhotoUpload 
              value={editingIntern.photo}
              onChange={handleEditPhotoChange}
              firstName={editingIntern.firstName}
              lastName={editingIntern.lastName}
            />
          </div>
          
          {/* Personal Info Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Informations personnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="editLastName" className="text-sm font-semibold text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-amber-600" />
                  {translations["Nom"] || "Nom"}
                </Label>
                <Input 
                  id="editLastName" 
                  name="lastName" 
                  value={editingIntern.lastName} 
                  onChange={handleEditInputChange}
                  className="border-2 border-amber-200 focus:border-amber-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="editFirstName" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-orange-600" />
                  {translations["Prénom"] || "Prénom"}
                </Label>
                <Input 
                  id="editFirstName" 
                  name="firstName" 
                  value={editingIntern.firstName} 
                  onChange={handleEditInputChange}
                  className="border-2 border-orange-200 focus:border-orange-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Label htmlFor="editGender" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                <UserCircle className="w-4 h-4 mr-2 text-red-600" />
                Sexe
              </Label>
              <Select 
                value={editingIntern.gender || "Masculin"} 
                onValueChange={(value) => handleEditSelectChange("gender", value)}
              >
                <SelectTrigger id="editGender" className="border-2 border-red-200 focus:border-red-500 transition-all duration-300 bg-white/90 rounded-xl h-12">
                  <SelectValue placeholder="Sélectionnez le sexe" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-red-200 rounded-xl">
                  <SelectItem value="Masculin">👨 Masculin</SelectItem>
                  <SelectItem value="Féminin">👩 Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact & Stage Info Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-red-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg mr-3">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Contact & Stage</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="editEmail" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  Email
                </Label>
                <Input 
                  id="editEmail" 
                  name="email" 
                  type="email" 
                  value={editingIntern.email} 
                  onChange={handleEditInputChange}
                  className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="editTitle" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                  {translations["Intitulé du stage"] || "Intitulé du stage"}
                </Label>
                <Input 
                  id="editTitle" 
                  name="title" 
                  value={editingIntern.title} 
                  onChange={handleEditInputChange}
                  className="border-2 border-green-200 focus:border-green-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
            </div>
          </div>

          {/* Dates & Status Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Période & Statut</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="editStartDate" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  {translations["Date de début"] || "Date de début"}
                </Label>
                <Input 
                  id="editStartDate" 
                  name="startDate" 
                  type="date" 
                  value={editingIntern.startDate} 
                  onChange={handleEditInputChange}
                  className="border-2 border-green-200 focus:border-green-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="editEndDate" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-red-600" />
                  {translations["Date de fin"] || "Date de fin"}
                </Label>
                <Input 
                  id="editEndDate" 
                  name="endDate" 
                  type="date" 
                  value={editingIntern.endDate} 
                  onChange={handleEditInputChange}
                  className="border-2 border-red-200 focus:border-red-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="editStatus" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                <Star className="w-4 h-4 mr-2 text-yellow-600" />
                {translations["Statut"] || "Statut"}
              </Label>
              <Select 
                value={editingIntern.status} 
                onValueChange={(value) => handleEditSelectChange("status", value)}
              >
                <SelectTrigger id="editStatus" className="border-2 border-yellow-200 focus:border-yellow-500 transition-all duration-300 bg-white/90 rounded-xl h-12">
                  <SelectValue placeholder={translations["Sélectionnez un statut"] || "Sélectionnez un statut"} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-yellow-200 rounded-xl">
                  <SelectItem value="début">🚀 {translations["Début"] || "Début"}</SelectItem>
                  <SelectItem value="en cours">⚡ {translations["En cours"] || "En cours"}</SelectItem>
                  <SelectItem value="fin">🎉 Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-6 border-t border-amber-200 bg-white/50 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="hover:bg-gray-100 border-2 border-gray-300 rounded-xl px-8 h-12 transition-all duration-300"
          >
            {translations["Annuler"] || "Annuler"}
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white shadow-lg rounded-xl px-8 h-12 transition-all duration-300 transform hover:scale-105"
          >
            <Edit className="w-4 h-4 mr-2" />
            {translations["Enregistrer"] || "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternEditForm;
