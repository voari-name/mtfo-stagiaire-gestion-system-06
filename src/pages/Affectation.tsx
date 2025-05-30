
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataContext } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { UserCheck, Users, FolderKanban } from "lucide-react";

const Affectation = () => {
  const { interns, projects } = useDataContext();
  const { toast } = useToast();
  const [selectedIntern, setSelectedIntern] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");

  const handleAffectation = () => {
    if (selectedIntern && selectedProject) {
      const intern = interns.find(i => i.id.toString() === selectedIntern);
      const project = projects.find(p => p.id.toString() === selectedProject);
      
      toast({
        title: "Affectation réussie",
        description: `${intern?.firstName} ${intern?.lastName} a été affecté(e) au projet "${project?.title}".`,
      });
      
      setSelectedIntern("");
      setSelectedProject("");
    }
  };

  return (
    <MainLayout title="Gestion des Affectations" currentPage="affectation" username="RAHAJANIAINA Olivier">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Affectation</h2>
        </div>

        {/* Nouvelle affectation */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck size={20} className="text-blue-600" />
              Nouvelle Affectation
            </CardTitle>
            <CardDescription>
              Affecter un stagiaire à un projet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stagiaire</label>
                <Select value={selectedIntern} onValueChange={setSelectedIntern}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un stagiaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {interns.map((intern) => (
                      <SelectItem key={intern.id} value={intern.id.toString()}>
                        {intern.firstName} {intern.lastName} - {intern.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Projet</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleAffectation}
              disabled={!selectedIntern || !selectedProject}
              className="w-full"
            >
              <UserCheck size={16} className="mr-2" />
              Confirmer l'affectation
            </Button>
          </CardContent>
        </Card>

        {/* Affectations existantes */}
        <Card className="animate-fade-in" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} className="text-green-600" />
              Affectations Actuelles
            </CardTitle>
            <CardDescription>
              Liste des affectations en cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FolderKanban size={16} className="text-blue-600" />
                    <h4 className="font-semibold">{project.title}</h4>
                  </div>
                  <div className="ml-6">
                    {project.interns.length > 0 ? (
                      <div className="space-y-1">
                        {project.interns.map((intern) => (
                          <div key={intern.id} className="text-sm text-gray-600">
                            • {intern.name} ({intern.status})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Aucun stagiaire affecté</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Affectation;
