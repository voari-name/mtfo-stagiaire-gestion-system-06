
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Users, FolderKanban, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();

  const handleGenerateReport = (type: string) => {
    toast({
      title: "Rapport généré",
      description: `Le rapport ${type} a été généré avec succès.`,
    });
  };

  const reportTypes = [
    {
      title: "Rapport des Stagiaires",
      description: "Liste complète des stagiaires avec leurs informations",
      icon: Users,
      type: "stagiaires"
    },
    {
      title: "Rapport des Projets",
      description: "Aperçu de tous les projets en cours et terminés",
      icon: FolderKanban,
      type: "projets"
    },
    {
      title: "Rapport des Évaluations",
      description: "Synthèse des évaluations et notes attribuées",
      icon: BarChart3,
      type: "evaluations"
    }
  ];

  return (
    <MainLayout title="Gestion des Rapports" currentPage="reports" username="RAHAJANIAINA Olivier">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Rapports</h2>
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
                      onClick={() => handleGenerateReport(report.type)}
                      className="flex-1"
                      variant="outline"
                    >
                      <FileText size={16} className="mr-2" />
                      PDF
                    </Button>
                    <Button 
                      onClick={() => handleGenerateReport(report.type)}
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
            <CardTitle>Rapports Personnalisés</CardTitle>
            <CardDescription>
              Générez des rapports personnalisés selon vos critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <FileText size={16} className="mr-2" />
              Créer un rapport personnalisé
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;
