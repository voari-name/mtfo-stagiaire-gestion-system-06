
import { useState } from "react";
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

interface InternFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intern: Intern) => void;
}

const InternForm = ({ isOpen, onClose, onSubmit }: InternFormProps) => {
  const { translations } = useSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    title: "",
    email: "",
    startDate: "",
    endDate: "",
    status: "début" as "début" | "en cours" | "fin",
    gender: "Masculin" as "Masculin" | "Féminin",
    photo: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (photoUrl: string) => {
    setFormData({ ...formData, photo: photoUrl });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Erreur",
        description: "Le prénom est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.lastName.trim()) {
      toast({
        title: "Erreur", 
        description: "Le nom est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.email.trim()) {
      toast({
        title: "Erreur",
        description: "L'email est obligatoire", 
        variant: "destructive"
      });
      return false;
    }
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "L'intitulé du stage est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.startDate) {
      toast({
        title: "Erreur",
        description: "La date de début est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.endDate) {
      toast({
        title: "Erreur",
        description: "La date de fin est obligatoire",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newIntern = {
      id: Date.now(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      title: formData.title.trim(),
      email: formData.email.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      gender: formData.gender,
      photo: formData.photo
    };
    
    onSubmit(newIntern);
    setFormData({
      lastName: "",
      firstName: "",
      title: "",
      email: "",
      startDate: "",
      endDate: "",
      status: "début",
      gender: "Masculin",
      photo: ""
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {translations["Ajouter un nouveau stagiaire"] || "Ajouter un nouveau stagiaire"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <PhotoUpload 
            value={formData.photo}
            onChange={handlePhotoChange}
            firstName={formData.firstName}
            lastName={formData.lastName}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                {translations["Nom"] || "Nom"}
              </Label>
              <Input 
                id="lastName" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleInputChange}
                className="border-2 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" />
                {translations["Prénom"] || "Prénom"}
              </Label>
              <Input 
                id="firstName" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange}
                className="border-2 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="gender" className="text-sm font-semibold text-gray-700 flex items-center">
              <UserCircle className="w-4 h-4 mr-2" />
              Sexe
            </Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger id="gender" className="border-2 focus:border-blue-500 transition-colors bg-white">
                <SelectValue placeholder="Sélectionnez le sexe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculin">Masculin</SelectItem>
                <SelectItem value="Féminin">Féminin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              {translations["Intitulé du stage"] || "Intitulé du stage"}
            </Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleInputChange}
              className="border-2 focus:border-blue-500 transition-colors bg-white"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleInputChange}
              className="border-2 focus:border-blue-500 transition-colors bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {translations["Date de début"] || "Date de début"}
              </Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="date" 
                value={formData.startDate} 
                onChange={handleInputChange}
                className="border-2 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {translations["Date de fin"] || "Date de fin"}
              </Label>
              <Input 
                id="endDate" 
                name="endDate" 
                type="date" 
                value={formData.endDate} 
                onChange={handleInputChange}
                className="border-2 focus:border-blue-500 transition-colors bg-white"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="status" className="text-sm font-semibold text-gray-700 flex items-center">
              <Star className="w-4 h-4 mr-2" />
              {translations["Statut"] || "Statut"}
            </Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status" className="border-2 focus:border-blue-500 transition-colors bg-white">
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
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            {translations["Enregistrer"] || "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternForm;
