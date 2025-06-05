
import React, { createContext, useContext, ReactNode } from 'react';
import { SettingsContextType } from '@/types/settings';
import { getTranslations } from '@/utils/translations';
import { useThemeEffects } from '@/hooks/useThemeEffects';
import { useSettingsState } from '@/hooks/useSettingsState';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const {
    darkMode,
    standbyMode,
    brightness,
    language,
    setDarkMode,
    setStandbyMode,
    setBrightness,
    setLanguage
  } = useSettingsState();

  useThemeEffects(darkMode, brightness, standbyMode);

  const currentTranslations = getTranslations(language);

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
