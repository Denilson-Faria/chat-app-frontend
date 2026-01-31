
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import GlobalChat from './pages/GlobalChat';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext'; 

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}


function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    return <Navigate to="/chat" replace />;
  }
  
  return children;
}

function App() {

  React.useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') ?? 'true');
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, []);

  return (
    <AuthProvider> 
      <Router>
        <Routes>
         
          <Route
            path="/"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
          
          
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <SocketProvider>
                  <GlobalChat />
                </SocketProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
