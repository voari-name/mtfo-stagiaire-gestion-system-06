import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";

const Internships = () => {
  const { interns, addIntern, updateIntern } = useDataContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    startDate: "",
    endDate: "",
    status: "début" as "début" | "en cours" | "fin"
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

  const handleAddIntern = () => {
    const newIntern = {
      id: Date.now(),
      ...formData
    };
    
    addIntern(newIntern);
    setFormData({
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      startDate: "",
      endDate: "",
      status: "début"
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
    <Card key={intern.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-800 flex items-center justify-center text-white text-lg font-bold">
                {intern.firstName.charAt(0)}{intern.lastName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{intern.firstName} {intern.lastName}</h3>
                <p className="text-sm text-muted-foreground">{intern.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Intitulé du stage</p>
                <p className="font-medium">{intern.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Période</p>
                <p className="font-medium">
                  {new Date(intern.startDate).toLocaleDateString('fr-FR')} au {new Date(intern.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
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
              <div className="text-sm text-green-600 font-medium mb-2">
                ✓ Certificat disponible dans les évaluations
              </div>
            )}
            <Button variant="outline" onClick={() => handleEditIntern(intern)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              Modifier
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout title="Gestion des stages" currentPage="internships">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-2xl font-bold">Stagiaires</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un stagiaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Add Intern Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                  Ajouter un stagiaire
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau stagiaire</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Intitulé du stage</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Date de début</Label>
                      <Input 
                        id="startDate" 
                        name="startDate" 
                        type="date" 
                        value={formData.startDate} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Date de fin</Label>
                      <Input 
                        id="endDate" 
                        name="endDate" 
                        type="date" 
                        value={formData.endDate} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="début">Début</SelectItem>
                        <SelectItem value="en cours">En cours</SelectItem>
                        <SelectItem value="fin">Fin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddIntern}>Enregistrer</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Modifier le stagiaire</DialogTitle>
            </DialogHeader>
            {editingIntern && (
              <div className="grid gap-4 py-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">Prénom</Label>
                    <Input 
                      id="editFirstName" 
                      name="firstName" 
                      value={editingIntern.firstName} 
                      onChange={handleEditInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Nom</Label>
                    <Input 
                      id="editLastName" 
                      name="lastName" 
                      value={editingIntern.lastName} 
                      onChange={handleEditInputChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTitle">Intitulé du stage</Label>
                  <Input 
                    id="editTitle" 
                    name="title" 
                    value={editingIntern.title} 
                    onChange={handleEditInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input 
                    id="editEmail" 
                    name="email" 
                    type="email" 
                    value={editingIntern.email} 
                    onChange={handleEditInputChange} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editStartDate">Date de début</Label>
                    <Input 
                      id="editStartDate" 
                      name="startDate" 
                      type="date" 
                      value={editingIntern.startDate} 
                      onChange={handleEditInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editEndDate">Date de fin</Label>
                    <Input 
                      id="editEndDate" 
                      name="endDate" 
                      type="date" 
                      value={editingIntern.endDate} 
                      onChange={handleEditInputChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Statut</Label>
                  <Select 
                    value={editingIntern.status} 
                    onValueChange={(value) => handleEditSelectChange("status", value)}
                  >
                    <SelectTrigger id="editStatus">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="début">Début</SelectItem>
                      <SelectItem value="en cours">En cours</SelectItem>
                      <SelectItem value="fin">Fin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleSaveEdit}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="ongoing">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {filteredInterns.length > 0 ? (
              filteredInterns.map(renderInternCard)
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {searchTerm ? "Aucun stagiaire trouvé pour cette recherche" : "Aucun stagiaire pour le moment"}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ongoing" className="space-y-6">
            {filteredInterns.filter(intern => intern.status === 'en cours').length > 0 ? (
              filteredInterns.filter(intern => intern.status === 'en cours').map(renderInternCard)
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Aucun stage en cours pour le moment</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-6">
            {filteredInterns.filter(intern => intern.status === 'fin').length > 0 ? (
              filteredInterns.filter(intern => intern.status === 'fin').map(renderInternCard)
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Aucun stage terminé pour le moment</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Internships;
