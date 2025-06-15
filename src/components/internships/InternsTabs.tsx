
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/contexts/SettingsContext";
import InternCard from "./InternCard";
import type { Intern } from "@/types/dataTypes";

interface InternsTabsProps {
  filteredInterns: Intern[];
  searchTerm: string;
  onEditIntern: (intern: Intern) => void;
  onDeleteIntern: (id: string) => void;
}

const InternsTabs = ({ filteredInterns, searchTerm, onEditIntern, onDeleteIntern }: InternsTabsProps) => {
  const { translations } = useSettings();

  const renderEmptyState = (message: string) => (
    <div className="text-center py-12">
      <div className="bg-gray-50 rounded-lg p-8">
        <p className="text-gray-500 text-lg">{message}</p>
      </div>
    </div>
  );

  const renderInternList = (interns: Intern[], emptyMessage: string) => (
    <div className="space-y-6">
      {interns.length > 0 ? (
        interns.map(intern => (
          <InternCard
            key={intern.id}
            intern={intern}
            onEdit={onEditIntern}
            onDelete={onDeleteIntern}
          />
        ))
      ) : (
        renderEmptyState(emptyMessage)
      )}
    </div>
  );

  return (
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
      
      <TabsContent value="all">
        {renderInternList(
          filteredInterns,
          searchTerm 
            ? translations["Aucun stagiaire trouvé pour cette recherche"] || "Aucun stagiaire trouvé pour cette recherche"
            : translations["Aucun stagiaire pour le moment"] || "Aucun stagiaire pour le moment"
        )}
      </TabsContent>
      
      <TabsContent value="debut">
        {renderInternList(
          filteredInterns.filter(intern => intern.status === 'début'),
          translations["Aucun stage au début pour le moment"] || "Aucun stage au début pour le moment"
        )}
      </TabsContent>
      
      <TabsContent value="ongoing">
        {renderInternList(
          filteredInterns.filter(intern => intern.status === 'en cours'),
          translations["Aucun stage en cours pour le moment"] || "Aucun stage en cours pour le moment"
        )}
      </TabsContent>
      
      <TabsContent value="completed">
        {renderInternList(
          filteredInterns.filter(intern => intern.status === 'fin'),
          "Aucun stage terminé pour le moment"
        )}
      </TabsContent>
    </Tabs>
  );
};

export default InternsTabs;
