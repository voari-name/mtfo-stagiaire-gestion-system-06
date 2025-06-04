
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Calendar, Mail, BookOpen, Star, UserCircle, Sparkles, GraduationCap } from "lucide-react";
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
      <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 animate-scale-in border-2 border-purple-200 shadow-2xl">
        <DialogHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 opacity-10 rounded-t-lg"></div>
          <div className="relative z-10 text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              ✨ {translations["Ajouter un nouveau stagiaire"] || "Ajouter un nouveau stagiaire"} ✨
            </DialogTitle>
            <p className="text-gray-600 mt-2">Créer un profil complet pour votre nouveau talent</p>
          </div>
        </DialogHeader>
        
        <div className="grid gap-8 py-6 animate-fade-in max-h-[70vh] overflow-y-auto" style={{animationDelay: '0.1s'}}>
          {/* Photo Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-lg">
            <PhotoUpload 
              value={formData.photo}
              onChange={handlePhotoChange}
              firstName={formData.firstName}
              lastName={formData.lastName}
            />
          </div>
          
          {/* Personal Info Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Informations personnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-600" />
                  {translations["Nom"] || "Nom"}
                </Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  className="border-2 border-purple-200 focus:border-purple-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                  placeholder="Entrez le nom de famille"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                  {translations["Prénom"] || "Prénom"}
                </Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  className="border-2 border-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                  placeholder="Entrez le prénom"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Label htmlFor="gender" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                <UserCircle className="w-4 h-4 mr-2 text-cyan-600" />
                Sexe
              </Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger id="gender" className="border-2 border-cyan-200 focus:border-cyan-500 transition-all duration-300 bg-white/90 rounded-xl h-12">
                  <SelectValue placeholder="Sélectionnez le sexe" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-cyan-200 rounded-xl">
                  <SelectItem value="Masculin">👨 Masculin</SelectItem>
                  <SelectItem value="Féminin">👩 Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact & Stage Info Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cyan-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mr-3">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Contact & Stage</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <Mail className="w-4 h-4 mr-2 text-red-500" />
                  Email
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  className="border-2 border-red-200 focus:border-red-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                  placeholder="exemple@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                  {translations["Intitulé du stage"] || "Intitulé du stage"}
                </Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange}
                  className="border-2 border-green-200 focus:border-green-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                  placeholder="Titre du stage ou spécialisation"
                />
              </div>
            </div>
          </div>

          {/* Dates & Status Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Période & Statut</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  {translations["Date de début"] || "Date de début"}
                </Label>
                <Input 
                  id="startDate" 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate} 
                  onChange={handleInputChange}
                  className="border-2 border-green-200 focus:border-green-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-red-600" />
                  {translations["Date de fin"] || "Date de fin"}
                </Label>
                <Input 
                  id="endDate" 
                  name="endDate" 
                  type="date" 
                  value={formData.endDate} 
                  onChange={handleInputChange}
                  className="border-2 border-red-200 focus:border-red-500 transition-all duration-300 bg-white/90 rounded-xl h-12"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                <Star className="w-4 h-4 mr-2 text-yellow-600" />
                {translations["Statut"] || "Statut"}
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status" className="border-2 border-yellow-200 focus:border-yellow-500 transition-all duration-300 bg-white/90 rounded-xl h-12">
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
        
        <div className="flex justify-end space-x-4 pt-6 border-t border-purple-200 bg-white/50 rounded-b-lg">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="hover:bg-gray-100 border-2 border-gray-300 rounded-xl px-8 h-12 transition-all duration-300"
          >
            {translations["Annuler"] || "Annuler"}
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white shadow-lg rounded-xl px-8 h-12 transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {translations["Enregistrer"] || "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternForm;
