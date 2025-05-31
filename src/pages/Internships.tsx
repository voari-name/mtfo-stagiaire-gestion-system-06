import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User, Calendar, Mail, BookOpen, Star, UserCircle } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PhotoUpload from "@/components/PhotoUpload";

const Internships = () => {
  const { interns, addIntern, updateIntern, deleteIntern } = useDataContext();
  const { translations } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
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
  const [editingIntern, setEditingIntern] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter interns based on search term
  const filteredInterns = interns.filter(intern =>
    intern.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingIntern({ ...editingIntern, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditingIntern({ ...editingIntern, [name]: value });
  };

  const handlePhotoChange = (photoUrl: string) => {
    setFormData({ ...formData, photo: photoUrl });
  };

  const handleEditPhotoChange = (photoUrl: string) => {
    setEditingIntern({ ...editingIntern, photo: photoUrl });
  };

  const handleAddIntern = () => {
    const newIntern = {
      id: Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      title: formData.title,
      email: formData.email,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      gender: formData.gender,
      photo: formData.photo
    };
    
    addIntern(newIntern);
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
    
    setIsDialogOpen(false);
  };

  const handleEditIntern = (intern) => {
    setEditingIntern({ ...intern });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    updateIntern(editingIntern);
    setIsEditDialogOpen(false);
  };

  const renderInternCard = (intern) => (
    <Card key={intern.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 animate-fade-in">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 flex-1 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                {intern.photo ? (
                  <AvatarImage src={intern.photo} alt={`${intern.firstName} ${intern.lastName}`} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl font-bold">
                    {intern.firstName.charAt(0)}{intern.lastName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-bold text-xl text-gray-800">{intern.lastName} {intern.firstName}</h3>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {intern.email}
                </p>
                {intern.gender && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <UserCircle className="w-4 h-4 mr-2" />
                    {intern.gender}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 flex items-center mb-2">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Intitulé du stage
                </p>
                <p className="font-semibold text-gray-800">{intern.title}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Période
                </p>
                <p className="font-semibold text-gray-800">
                  {new Date(intern.startDate).toLocaleDateString('fr-FR')} au {new Date(intern.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                <p className="text-sm text-gray-500 flex items-center mb-2">
                  <Star className="w-4 h-4 mr-2" />
                  Statut
                </p>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center ${
                  intern.status === 'en cours' ? 'bg-blue-100 text-blue-800' :
                  intern.status === 'fin' ? 'bg-green-100 text-green-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {intern.status === 'en cours' ? 'En cours' : 
                   intern.status === 'fin' ? 'Terminé' : 'Début'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 flex flex-col justify-center space-y-3 md:w-48">
            {intern.status === 'fin' && (
              <div className="text-sm text-green-600 font-medium mb-2 bg-green-50 p-3 rounded-lg">
                ✓ Certificat disponible dans les évaluations
              </div>
            )}
            <Button variant="outline" onClick={() => handleEditIntern(intern)} className="hover:bg-blue-50 hover:text-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              Modifier
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera définitivement le stagiaire {intern.lastName} {intern.firstName}.
                    Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteIntern(intern.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout title={translations["Gestion des stages"] || "Gestion des stages"} currentPage="internships">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{translations["Stagiaires"] || "Stagiaires"}</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={translations["Rechercher un stagiaire..."] || "Rechercher un stagiaire..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Add Intern Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                  Ouvrir formulaire
                </Button>
              </DialogTrigger>
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="hover:bg-gray-100">
                    {translations["Annuler"] || "Annuler"}
                  </Button>
                  <Button onClick={handleAddIntern} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    {translations["Enregistrer"] || "Enregistrer"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-blue-50 to-indigo-50 animate-scale-in">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {translations["Modifier le stagiaire"] || "Modifier le stagiaire"}
              </DialogTitle>
            </DialogHeader>
            {editingIntern && (
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
            )}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="hover:bg-gray-100">
                {translations["Annuler"] || "Annuler"}
              </Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {translations["Enregistrer"] || "Enregistrer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {translations["Tous"] || "Tous"}
            </TabsTrigger>
            <TabsTrigger value="debut" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {translations["Début"] || "Début"}
            </TabsTrigger>
            <TabsTrigger value="ongoing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              {translations["En cours"] || "En cours"}
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Terminés
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {filteredInterns.length > 0 ? (
              filteredInterns.map(renderInternCard)
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? translations["Aucun stagiaire trouvé pour cette recherche"] || "Aucun stagiaire trouvé pour cette recherche" : translations["Aucun stagiaire pour le moment"] || "Aucun stagiaire pour le moment"}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="debut" className="space-y-6">
            {filteredInterns.filter(intern => intern.status === 'début').length > 0 ? (
              filteredInterns.filter(intern => intern.status === 'début').map(renderInternCard)
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-gray-500 text-lg">{translations["Aucun stage au début pour le moment"] || "Aucun stage au début pour le moment"}</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ongoing" className="space-y-6">
            {filteredInterns.filter(intern => intern.status === 'en cours').length > 0 ? (
              filteredInterns.filter(intern => intern.status === 'en cours').map(renderInternCard)
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-gray-500 text-lg">{translations["Aucun stage en cours pour le moment"] || "Aucun stage en cours pour le moment"}</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {filteredInterns.filter(intern => intern.status === 'fin').length > 0 ? (
              filteredInterns.filter(intern => intern.status === 'fin').map(renderInternCard)
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-gray-500 text-lg">Aucun stage terminé pour le moment</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Internships;
