
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

export interface SettingsState {
  darkMode: boolean;
  standbyMode: boolean;
  brightness: number[];
  language: string;
}
