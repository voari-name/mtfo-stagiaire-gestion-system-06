
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Mail, Calendar, BookOpen, Star, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Intern } from "@/contexts/DataContext";

interface InternCardProps {
  intern: Intern;
  onEdit: (intern: Intern) => void;
  onDelete: (id: number) => void;
}

const InternCard = ({ intern, onEdit, onDelete }: InternCardProps) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 animate-fade-in">
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
            <Button variant="outline" onClick={() => onEdit(intern)} className="hover:bg-blue-50 hover:text-blue-700 transition-colors">
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
                    onClick={() => onDelete(intern.id)}
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
};

export default InternCard;
