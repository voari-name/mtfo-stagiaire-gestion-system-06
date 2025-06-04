
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

interface InternsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

const InternsHeader = ({ searchTerm, onSearchChange, onAddClick }: InternsHeaderProps) => {
  const { translations } = useSettings();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {translations["Stagiaires"] || "Stagiaires"}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={translations["Rechercher un stagiaire..."] || "Rechercher un stagiaire..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-2 focus:border-blue-500 transition-colors"
          />
        </div>
        
        {/* Add Intern Button */}
        <Button 
          onClick={onAddClick}
          className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Ouvrir formulaire
        </Button>
      </div>
    </div>
  );
};

export default InternsHeader;
