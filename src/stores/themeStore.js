
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  darkMode: (() => {
    try {
      return JSON.parse(localStorage.getItem('darkMode') ?? 'true');
    } catch {
      return true;
    }
  })(),

  toggleTheme: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      
      try {
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
        
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
          document.body.style.backgroundColor = '#000000';
        } else {
          document.documentElement.classList.remove('dark');
          document.body.style.backgroundColor = '#ffffff';
        }
      } catch (error) {
      }
      
      return { darkMode: newDarkMode };
    });
  },

  setDarkMode: (value) => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(value));
      
      if (value) {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#000000';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#ffffff';
      }
      
      set({ darkMode: value });
    } catch (error) {
    }
  },
}));
