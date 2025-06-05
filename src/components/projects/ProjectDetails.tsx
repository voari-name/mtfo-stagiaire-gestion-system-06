
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CheckCircle, Clock, ArrowLeft, Edit, Trash2 } from "lucide-react";
import type { Project } from "@/types/dataTypes";

interface ProjectDetailsProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ 
  project, 
  onEdit, 
  onDelete 
}) => {
  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header avec boutons d'action */}
      <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold mb-2">{project.title}</CardTitle>
              <p className="text-blue-100">
                {project.description || "Description du projet"}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={onEdit}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button 
                onClick={onDelete}
                variant="destructive"
                className="bg-red-500/80 hover:bg-red-600"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Informations du projet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Date de début</p>
                <p className="font-semibold">{new Date(project.startDate).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-red-600" />
              <div>
                <p className="text-sm text-gray-500">Date de fin</p>
                <p className="font-semibold">{new Date(project.endDate).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Progression</p>
                <p className="font-semibold">{progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des stagiaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Stagiaires assignés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.interns.map((intern) => (
              <div key={intern.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold mr-3">
                    {intern.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium">{intern.name}</h4>
                    <div className="flex items-center mt-1">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" 
                          style={{ width: `${intern.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{intern.completion}% complété</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    intern.status === 'fin' ? 'border-green-500 text-green-700 bg-green-50' : 
                    intern.status === 'en cours' ? 'border-blue-500 text-blue-700 bg-blue-50' : 
                    'border-amber-500 text-amber-700 bg-amber-50'
                  }
                >
                  {intern.status === 'fin' ? 'Terminé' : 
                   intern.status === 'en cours' ? 'En cours' : 'À commencer'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gestion des tâches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Tâches du projet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-3 ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="font-medium">{task.name}</span>
                </div>
                <Badge variant={
                  task.status === 'completed' ? 'default' : 
                  task.status === 'in-progress' ? 'secondary' : 'outline'
                }>
                  {task.status === 'completed' ? 'Terminé' : 
                   task.status === 'in-progress' ? 'En cours' : 'À faire'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;
