
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SettingsContextType {
  darkMode: boolean;
  standbyMode: boolean;
  brightness: number[];
  language: string;
  setDarkMode: (value: boolean) => void;
  setStandbyMode: (value: boolean) => void;
  setBrightness: (value: number[]) => void;
  setLanguage: (value: string) => void;
  translations: { [key: string]: string };
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations = {
  fr: {
    'Mon profil': 'Mon profil',
    'Gestion des Stagiaires': 'Gestion des Stagiaires',
    'Évaluations': 'Évaluations',
    'Gestion des Projets': 'Gestion des Projets',
    'Affectation': 'Affectation',
    'Rapports': 'Rapports',
    'Statistiques': 'Statistiques',
    'Paramètres': 'Paramètres',
    'Déconnexion': 'Déconnexion',
    'Photo de profil': 'Photo de profil',
    'Informations personnelles': 'Informations personnelles',
    'Préférences d\'affichage': 'Préférences d\'affichage',
    'Mode sombre': 'Mode sombre',
    'Mode veille': 'Mode veille',
    'Luminosité': 'Luminosité',
    'Langue de l\'application': 'Langue de l\'application',
    'Tableau de bord': 'Tableau de bord',
    'Rechercher': 'Rechercher',
    'Rechercher une évaluation...': 'Rechercher une évaluation...',
    'Ajouter un stagiaire': 'Ajouter un stagiaire',
    'Statut': 'Statut',
    'Actions': 'Actions',
    'Modifier': 'Modifier',
    'Supprimer': 'Supprimer',
    'Télécharger PDF': 'Télécharger PDF',
    'Évaluations des stagiaires': 'Évaluations des stagiaires',
    'Détails de l\'évaluation': 'Détails de l\'évaluation',
    'Stagiaires terminés en attente d\'évaluation': 'Stagiaires terminés en attente d\'évaluation',
    'Créer l\'évaluation': 'Créer l\'évaluation',
    'Évaluations complétées': 'Évaluations complétées'
  },
  en: {
    'Mon profil': 'My Profile',
    'Gestion des Stagiaires': 'Intern Management',
    'Évaluations': 'Evaluations',
    'Gestion des Projets': 'Project Management',
    'Affectation': 'Assignment',
    'Rapports': 'Reports',
    'Statistiques': 'Statistics',
    'Paramètres': 'Settings',
    'Déconnexion': 'Logout',
    'Photo de profil': 'Profile Photo',
    'Informations personnelles': 'Personal Information',
    'Préférences d\'affichage': 'Display Preferences',
    'Mode sombre': 'Dark Mode',
    'Mode veille': 'Standby Mode',
    'Luminosité': 'Brightness',
    'Langue de l\'application': 'Application Language',
    'Tableau de bord': 'Dashboard',
    'Rechercher': 'Search',
    'Rechercher une évaluation...': 'Search for an evaluation...',
    'Ajouter un stagiaire': 'Add Intern',
    'Statut': 'Status',
    'Actions': 'Actions',
    'Modifier': 'Edit',
    'Supprimer': 'Delete',
    'Télécharger PDF': 'Download PDF',
    'Évaluations des stagiaires': 'Student Evaluations',
    'Détails de l\'évaluation': 'Evaluation Details',
    'Stagiaires terminés en attente d\'évaluation': 'Completed Interns Awaiting Evaluation',
    'Créer l\'évaluation': 'Create Evaluation',
    'Évaluations complétées': 'Completed Evaluations'
  },
  mg: {
    'Mon profil': 'Ny mombamomba ahy',
    'Gestion des Stagiaires': 'Fitantanana ny mpianatra',
    'Évaluations': 'Fanombanana',
    'Gestion des Projets': 'Fitantanana tetikasa',
    'Affectation': 'Fanendrena',
    'Rapports': 'Tatitra',
    'Statistiques': 'Antontan-isa',
    'Paramètres': 'Fandrindrana',
    'Déconnexion': 'Hivoaka',
    'Photo de profil': 'Sarin\'ny mombamomba',
    'Informations personnelles': 'Fampahalalana manokana',
    'Préférences d\'affichage': 'Safidy fampisehoana',
    'Mode sombre': 'Maizina',
    'Mode veille': 'Fiandrasana',
    'Luminosité': 'Fahazavana',
    'Langue de l\'application': 'Fitenin\'ny rindranasa',
    'Tableau de bord': 'Sehatr\'asa',
    'Rechercher': 'Tadiavo',
    'Rechercher une évaluation...': 'Tadiavo fanombanana...',
    'Ajouter un stagiaire': 'Manampy mpianatra',
    'Statut': 'Toe-javatra',
    'Actions': 'Asa',
    'Modifier': 'Ovay',
    'Supprimer': 'Fafao',
    'Télécharger PDF': 'Alao PDF',
    'Évaluations des stagiaires': 'Fanombanana ny mpianatra',
    'Détails de l\'évaluation': 'Antsipirihan\'ny fanombanana',
    'Stagiaires terminés en attente d\'évaluation': 'Mpianatra vita miandry fanombanana',
    'Créer l\'évaluation': 'Mamorona fanombanana',
    'Évaluations complétées': 'Fanombanana vita'
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkModeState] = useState(false);
  const [standbyMode, setStandbyModeState] = useState(false);
  const [brightness, setBrightnessState] = useState([50]);
  const [language, setLanguageState] = useState('fr');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setDarkModeState(parsed.darkMode || false);
      setStandbyModeState(parsed.standbyMode || false);
      setBrightnessState(parsed.brightness || [50]);
      setLanguageState(parsed.language || 'fr');
    }
  }, []);

  // Apply enhanced dark mode with blue theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      // Enhanced blue color scheme for dark mode
      document.documentElement.style.setProperty('--primary', '217 91% 65%'); // Bright blue
      document.documentElement.style.setProperty('--secondary', '45 93% 58%'); // Golden yellow
      document.documentElement.style.setProperty('--accent', '217 91% 65%'); // Blue accent
      document.documentElement.style.setProperty('--background', '222 84% 5%'); // Very dark blue
      document.documentElement.style.setProperty('--card', '217 32% 12%'); // Dark blue-gray
      document.documentElement.style.setProperty('--sidebar-background', '217 32% 8%'); // Darker blue for sidebar
      document.documentElement.style.setProperty('--sidebar-primary', '217 91% 65%'); // Blue for active items
    } else {
      document.documentElement.classList.remove('dark');
      // Reset to light mode defaults
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--accent');
      document.documentElement.style.removeProperty('--background');
      document.documentElement.style.removeProperty('--card');
      document.documentElement.style.removeProperty('--sidebar-background');
      document.documentElement.style.removeProperty('--sidebar-primary');
    }
  }, [darkMode]);

  // Apply brightness
  useEffect(() => {
    document.documentElement.style.filter = `brightness(${brightness[0]}%)`;
  }, [brightness]);

  // Apply standby mode (reduce brightness when active)
  useEffect(() => {
    if (standbyMode) {
      document.documentElement.style.opacity = '0.7';
    } else {
      document.documentElement.style.opacity = '1';
    }
  }, [standbyMode]);

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    saveSettings({ darkMode: value, standbyMode, brightness, language });
  };

  const setStandbyMode = (value: boolean) => {
    setStandbyModeState(value);
    saveSettings({ darkMode, standbyMode: value, brightness, language });
  };

  const setBrightness = (value: number[]) => {
    setBrightnessState(value);
    saveSettings({ darkMode, standbyMode, brightness: value, language });
  };

  const setLanguage = (value: string) => {
    setLanguageState(value);
    saveSettings({ darkMode, standbyMode, brightness, language: value });
  };

  const saveSettings = (settings: any) => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  };

  const currentTranslations = translations[language as keyof typeof translations] || translations.fr;

  return (
    <SettingsContext.Provider value={{
      darkMode,
      standbyMode,
      brightness,
      language,
      setDarkMode,
      setStandbyMode,
      setBrightness,
      setLanguage,
      translations: currentTranslations
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
