
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [avatar, setAvatar] = useState(() => {
    const saved = localStorage.getItem('userAvatar');
    return saved || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('userAvatar', avatar);
  }, [avatar]);

  const login = (userData, token) => {
    setUser(userData);
    
 
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userAvatar');
    

    setUser(null);
    
    window.location.href = '/';
  };

  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
  };

  return (
    <AuthContext.Provider value={{ user, avatar, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
