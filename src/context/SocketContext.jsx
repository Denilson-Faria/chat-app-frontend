import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket deve ser usado dentro de SocketProvider');
  }
  return context;
};

let globalSocket = null;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const isConnecting = useRef(false);

  useEffect(() => {
    if (isConnecting.current || globalSocket) {
      if (globalSocket) {
        setSocket(globalSocket);
        setConnected(globalSocket.connected);
      }
      return;
    }

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      setError('Usuário não autenticado');
      return;
    }

    isConnecting.current = true;

    const newSocket = io('http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 5,
      timeout: 20000,
      forceNew: false,
      multiplex: true,
      withCredentials: true
    });

    const handleConnect = () => {
      setConnected(true);
      setError(null);
    };

    const handleRegistered = (userData) => {
    };

    const handleDisconnect = (reason) => {
      setConnected(false);
      
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    };

    const handleConnectError = (err) => {
      
      if (err.message.includes('Autenticação') || 
          err.message.includes('Token') || 
          err.message.includes('Conta bloqueada')) {
        setError(err.message);
        setConnected(false);
        
     
        if (err.message.includes('Token inválido') || 
            err.message.includes('Conta bloqueada')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } else {
        setError('Erro de conexão com o servidor');
      }
      
      setConnected(false);
    };

    const handleError = (errorData) => {
      
    
      const errorMessage = typeof errorData === 'object' 
        ? errorData.message || JSON.stringify(errorData)
        : errorData;
      
      setError(errorMessage);
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('registered', handleRegistered);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('error', handleError);

 
    newSocket.on('reconnect', (attemptNumber) => {
      setConnected(true);
      setError(null);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
    });

    newSocket.on('reconnect_failed', () => {
      setError('Não foi possível reconectar ao servidor');
    });

    globalSocket = newSocket;
    setSocket(newSocket);

    return () => {
      if (globalSocket) {
        globalSocket.off('connect', handleConnect);
        globalSocket.off('registered', handleRegistered);
        globalSocket.off('disconnect', handleDisconnect);
        globalSocket.off('connect_error', handleConnectError);
        globalSocket.off('error', handleError);
        globalSocket.off('reconnect');
        globalSocket.off('reconnect_attempt');
        globalSocket.off('reconnect_failed');
        globalSocket.disconnect();
        globalSocket = null;
      }
      isConnecting.current = false;
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, error }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
