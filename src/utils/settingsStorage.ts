
import { SettingsState } from '@/types/settings';

export const loadSettingsFromStorage = (): Partial<SettingsState> => {
  const savedSettings = localStorage.getItem('appSettings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return {};
};

export const saveSettingsToStorage = (settings: SettingsState) => {
  localStorage.setItem('appSettings', JSON.stringify(settings));
};
