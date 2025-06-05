
import { useEffect } from 'react';

export const useThemeEffects = (darkMode: boolean, brightness: number[], standbyMode: boolean) => {
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
};
