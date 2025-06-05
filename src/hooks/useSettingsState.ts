
import { useState, useEffect } from 'react';
import { SettingsState } from '@/types/settings';
import { loadSettingsFromStorage, saveSettingsToStorage } from '@/utils/settingsStorage';

export const useSettingsState = () => {
  const [darkMode, setDarkModeState] = useState(false);
  const [standbyMode, setStandbyModeState] = useState(false);
  const [brightness, setBrightnessState] = useState([50]);
  const [language, setLanguageState] = useState('fr');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = loadSettingsFromStorage();
    setDarkModeState(savedSettings.darkMode || false);
    setStandbyModeState(savedSettings.standbyMode || false);
    setBrightnessState(savedSettings.brightness || [50]);
    setLanguageState(savedSettings.language || 'fr');
  }, []);

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

  const saveSettings = (settings: SettingsState) => {
    saveSettingsToStorage(settings);
  };

  return {
    darkMode,
    standbyMode,
    brightness,
    language,
    setDarkMode,
    setStandbyMode,
    setBrightness,
    setLanguage
  };
};
