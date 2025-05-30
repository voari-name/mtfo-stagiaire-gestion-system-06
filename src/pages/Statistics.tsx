
import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataContext } from "@/contexts/DataContext";
import { Users, FolderKanban, BarChart3, TrendingUp } from "lucide-react";

const Statistics = () => {
  const { interns, projects, evaluations } = useDataContext();

  const stats = [
    {
      title: "Total Stagiaires",
      value: interns.length,
      description: "Nombre total de stagiaires",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Projets Actifs",
      value: projects.filter(p => p.interns.some(i => i.status === "en cours")).length,
      description: "Projets en cours",
      icon: FolderKanban,
      color: "text-green-600"
    },
    {
      title: "Évaluations",
      value: evaluations.length,
      description: "Évaluations complétées",
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      title: "Moyenne Générale",
      value: evaluations.length > 0 ? 
        Math.round(evaluations.reduce((sum, evaluation) => sum + evaluation.grade, 0) / evaluations.length * 10) / 10 
        : 0,
      description: "Note moyenne des évaluations",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  const statusDistribution = {
    debut: interns.filter(i => i.status === "début").length,
    enCours: interns.filter(i => i.status === "en cours").length,
    fin: interns.filter(i => i.status === "fin").length
  };

  return (
    <MainLayout title="Statistiques" currentPage="statistics" username="RAHAJANIAINA Olivier">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Statistiques</h2>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title} className="hover-scale transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <IconComponent size={20} className={stat.color} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Répartition des statuts */}
        <Card className="animate-fade-in" style={{animationDelay: '0.5s'}}>
          <CardHeader>
            <CardTitle>Répartition des Stagiaires par Statut</CardTitle>
            <CardDescription>
              Visualisation de l'état d'avancement des stagiaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Début</span>
                <span className="text-sm text-muted-foreground">{statusDistribution.debut} stagiaires</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${interns.length > 0 ? (statusDistribution.debut / interns.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">En cours</span>
                <span className="text-sm text-muted-foreground">{statusDistribution.enCours} stagiaires</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${interns.length > 0 ? (statusDistribution.enCours / interns.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Terminé</span>
                <span className="text-sm text-muted-foreground">{statusDistribution.fin} stagiaires</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${interns.length > 0 ? (statusDistribution.fin / interns.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Statistics;
