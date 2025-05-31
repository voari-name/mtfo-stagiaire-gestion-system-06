
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useDataContext } from "@/contexts/DataContext";
import { useSettings } from "@/contexts/SettingsContext";
import { generatePDFReport, generateCSVReport } from "@/utils/reportGenerator";
import { FileText, Download, Calendar, Users, FolderKanban, BarChart3 } from "lucide-react";

const CustomReport = () => {
  const { toast } = useToast();
  const { interns, projects, evaluations } = useDataContext();
  const { translations } = useSettings();
  
  const [reportConfig, setReportConfig] = useState({
    title: "",
    dateRange: {
      start: "",
      end: ""
    },
    includeInterns: false,
    includeProjects: false,
    includeEvaluations: false,
    format: "PDF" as "PDF" | "CSV"
  });

  const handleConfigChange = (key: string, value: any) => {
    setReportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (field: string, value: string) => {
    setReportConfig(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const generateCustomReport = () => {
    if (!reportConfig.title) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un titre pour le rapport.",
        variant: "destructive"
      });
      return;
    }

    if (!reportConfig.includeInterns && !reportConfig.includeProjects && !reportConfig.includeEvaluations) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un type de données à inclure.",
        variant: "destructive"
      });
      return;
    }

    try {
      const data = {
        interns: reportConfig.includeInterns ? interns : undefined,
        projects: reportConfig.includeProjects ? projects : undefined,
        evaluations: reportConfig.includeEvaluations ? evaluations : undefined
      };

      if (reportConfig.format === "PDF") {
        generatePDFReport("personnalisé", data);
      } else {
        generateCSVReport("personnalisé", data);
      }

      toast({
        title: "Rapport généré",
        description: `Le rapport personnalisé "${reportConfig.title}" a été téléchargé avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du rapport.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout title="Rapport Personnalisé" currentPage="reports">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {translations["Créer un rapport personnalisé"] || "Créer un rapport personnalisé"}
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Configuration du rapport
            </CardTitle>
            <CardDescription>
              Personnalisez votre rapport en sélectionnant les données à inclure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du rapport</Label>
              <Input
                id="title"
                placeholder="Saisissez le titre du rapport"
                value={reportConfig.title}
                onChange={(e) => handleConfigChange("title", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={reportConfig.dateRange.start}
                  onChange={(e) => handleDateRangeChange("start", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={reportConfig.dateRange.end}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Données à inclure</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="interns"
                    checked={reportConfig.includeInterns}
                    onCheckedChange={(checked) => handleConfigChange("includeInterns", checked)}
                  />
                  <Label htmlFor="interns" className="flex items-center gap-2">
                    <Users size={16} />
                    Stagiaires ({interns.length})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="projects"
                    checked={reportConfig.includeProjects}
                    onCheckedChange={(checked) => handleConfigChange("includeProjects", checked)}
                  />
                  <Label htmlFor="projects" className="flex items-center gap-2">
                    <FolderKanban size={16} />
                    Projets ({projects.length})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evaluations"
                    checked={reportConfig.includeEvaluations}
                    onCheckedChange={(checked) => handleConfigChange("includeEvaluations", checked)}
                  />
                  <Label htmlFor="evaluations" className="flex items-center gap-2">
                    <BarChart3 size={16} />
                    Évaluations ({evaluations.length})
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Format du rapport</Label>
              <Select 
                value={reportConfig.format} 
                onValueChange={(value) => handleConfigChange("format", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="CSV">
                    <div className="flex items-center gap-2">
                      <Download size={16} />
                      CSV
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => window.history.back()}>
                Annuler
              </Button>
              <Button onClick={generateCustomReport} className="bg-blue-600 hover:bg-blue-700">
                <FileText size={16} className="mr-2" />
                Générer le rapport
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CustomReport;
