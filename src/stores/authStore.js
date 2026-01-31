
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  
  avatar: (() => {
    try {
      return localStorage.getItem('userAvatar') || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    } catch {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    }
  })(),
  
  isAuthenticated: (() => {
    try {
      return localStorage.getItem('user') !== null;
    } catch {
      return false;
    }
  })(),

  setUser: (user) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (error) {
    }
  },

  setAvatar: (avatar) => {
    try {
      localStorage.setItem('userAvatar', avatar);
      set({ avatar });
    } catch (error) {
    }
  },

  logout: () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('userAvatar');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
    }
  },
}));
