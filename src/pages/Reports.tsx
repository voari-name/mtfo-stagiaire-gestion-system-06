
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Users, FolderKanban, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDataContext } from "@/contexts/DataContext";
import { useSettings } from "@/contexts/SettingsContext";
import { generatePDFReport, generateCSVReport } from "@/utils/reportGenerator";

const Reports = () => {
  const { toast } = useToast();
  const { interns, projects, evaluations } = useDataContext();
  const { translations } = useSettings();

  const handleGeneratePDFReport = (type: string) => {
    try {
      const data = {
        interns: type === 'stagiaires' ? interns : undefined,
        projects: type === 'projets' ? projects : undefined,
        evaluations: type === 'evaluations' ? evaluations : undefined
      };
      
      generatePDFReport(type, data);
      
      toast({
        title: translations["Rapport généré"] || "Rapport généré",
        description: `Le rapport ${type} PDF a été téléchargé avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du rapport PDF.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateCSVReport = (type: string) => {
    try {
      const data = {
        interns: type === 'stagiaires' ? interns : undefined,
        projects: type === 'projets' ? projects : undefined,
        evaluations: type === 'evaluations' ? evaluations : undefined
      };
      
      generateCSVReport(type, data);
      
      toast({
        title: translations["Rapport généré"] || "Rapport généré",
        description: `Le rapport ${type} CSV a été téléchargé avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du rapport CSV.",
        variant: "destructive"
      });
    }
  };

  const reportTypes = [
    {
      title: translations["Rapport des Stagiaires"] || "Rapport des Stagiaires",
      description: translations["Liste complète des stagiaires avec leurs informations"] || "Liste complète des stagiaires avec leurs informations",
      icon: Users,
      type: "stagiaires"
    },
    {
      title: translations["Rapport des Projets"] || "Rapport des Projets",
      description: translations["Aperçu de tous les projets en cours et terminés"] || "Aperçu de tous les projets en cours et terminés",
      icon: FolderKanban,
      type: "projets"
    },
    {
      title: translations["Rapport des Évaluations"] || "Rapport des Évaluations",
      description: translations["Synthèse des évaluations et notes attribuées"] || "Synthèse des évaluations et notes attribuées",
      icon: BarChart3,
      type: "evaluations"
    }
  ];

  return (
    <MainLayout title={translations["Gestion des Rapports"] || "Gestion des Rapports"} currentPage="reports" username="RAHAJANIAINA Olivier">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{translations["Rapports"] || "Rapports"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTypes.map((report, index) => {
            const IconComponent = report.icon;
            return (
              <Card key={report.type} className="hover-scale transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent size={20} className="text-blue-600" />
                    {report.title}
                  </CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleGeneratePDFReport(report.type)}
                      className="flex-1"
                      variant="outline"
                    >
                      <FileText size={16} className="mr-2" />
                      PDF
                    </Button>
                    <Button 
                      onClick={() => handleGenerateCSVReport(report.type)}
                      className="flex-1"
                      variant="outline"
                    >
                      <Download size={16} className="mr-2" />
                      CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="animate-fade-in" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle>{translations["Rapports Personnalisés"] || "Rapports Personnalisés"}</CardTitle>
            <CardDescription>
              {translations["Générez des rapports personnalisés selon vos critères"] || "Générez des rapports personnalisés selon vos critères"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <FileText size={16} className="mr-2" />
              {translations["Créer un rapport personnalisé"] || "Créer un rapport personnalisé"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;
