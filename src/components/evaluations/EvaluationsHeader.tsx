
import { Input } from "@/components/ui/input";
import { useSettings } from "@/contexts/SettingsContext";

const EvaluationsHeader = () => {
  const { translations } = useSettings();

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 shadow-xl mb-8">
      <div className="flex justify-between items-center">
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">
            ✨ {translations["Évaluations"] || "Évaluations"} ✨
          </h2>
          <p className="text-blue-100 text-lg">
            Gérez et suivez les évaluations des stagiaires
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder={translations["Rechercher une évaluation..."] || "Rechercher une évaluation..."}
              className="w-80 bg-white/90 backdrop-blur-sm border-0 rounded-xl h-12 text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 focus:scale-105 focus:bg-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsHeader;
