import React, { useState, useEffect } from 'react';
import { Moon, Sun, Lock, Users, LogOut, Wifi, WifiOff, Menu } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useAuthStore } from '../../stores/authStore';
import { useChatStore } from '../../stores/chatStore';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../UI/Avatar';
import AvatarModal from '../UI/AvatarModal';
import api from '../../services/api';

const ChatHeader = ({ onMenuClick }) => {
  const { darkMode, toggleTheme } = useThemeStore();
  const { avatar, setAvatar } = useAuthStore();
  const { activeChat } = useChatStore();
  const { socket, connected } = useSocket();
  const { logout } = useAuth();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('users_count', (count) => {
      setOnlineUsers(count);
    });

    socket.on('user_typing', (data) => {
      if (data.chatType === activeChat && data.userId !== socket.userId) {
        setTypingUsers(prev => {
          if (!prev.includes(data.username)) {
            return [...prev, data.username];
          }
          return prev;
        });

        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u !== data.username));
        }, 3000);
      }
    });

    socket.on('user_stop_typing', (data) => {
      setTypingUsers(prev => prev.filter(u => u !== data.username));
    });

    return () => {
      socket.off('users_count');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [socket, activeChat]);

  const handleSaveAvatar = async (newAvatar) => {
    try {

      const response = await api.put('/users/profile', {
        avatar: newAvatar
      });


      setAvatar(newAvatar);

      if (socket) {
        socket.emit('update_avatar', { avatar: newAvatar });
      }

    } catch (error) {
      alert('Erro ao salvar avatar. Tente novamente.');
    }
  };

  const chatInfo = activeChat === 'group' 
    ? { name: 'Grupo Geral', icon: Users, color: 'blue' }
    : { name: 'Chat Privado', icon: Lock, color: 'green' };

  const ChatIcon = chatInfo.icon;

  return (
    <>
      <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between gap-3">
          {/* Left side - Menu + Chat Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Menu Button (mobile only) - PREMIUM */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Abrir menu"
            >
              <Menu size={20} className="text-gray-700 dark:text-gray-300" />
            </button>

            {/* Icon Container - PREMIUM */}
            <div className="relative flex-shrink-0">
              <div className={`absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse ${
                chatInfo.color === 'blue' 
                  ? 'bg-blue-500' 
                  : 'bg-green-500'
              }`}></div>
              <div className={`relative p-2 sm:p-2.5 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-6 ${
                chatInfo.color === 'blue'
                  ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-blue-500/50'
                  : 'bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 shadow-green-500/50'
              }`}>
                <ChatIcon size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
            </div>

            {/* Chat Info Text - PREMIUM */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent truncate">
                  {chatInfo.name}
                </h2>
                
                {/* Connection Status Badge - PREMIUM */}
                <div className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  connected
                    ? 'bg-green-100/80 dark:bg-green-900/30'
                    : 'bg-red-100/80 dark:bg-red-900/30 animate-pulse'
                }`}>
                  {connected ? (
                    <Wifi size={12} className="sm:w-3.5 sm:h-3.5 text-green-600 dark:text-green-400" />
                  ) : (
                    <WifiOff size={12} className="sm:w-3.5 sm:h-3.5 text-red-600 dark:text-red-400" />
                  )}
                  <span className={`text-[10px] sm:text-xs font-semibold ${
                    connected 
                      ? 'text-green-700 dark:text-green-400' 
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {connected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Status Text - PREMIUM */}
              <div className="text-xs sm:text-sm hidden sm:block">
                {typingUsers.length > 0 ? (
                  <div className="flex items-center gap-1.5 animate-in slide-in-from-left duration-300">
                    <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {typingUsers[0]}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">está digitando</span>
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                ) : activeChat === 'group' && onlineUsers > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {onlineUsers} {onlineUsers === 1 ? 'pessoa' : 'pessoas'} online
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Lock size={12} className="sm:w-3.5 sm:h-3.5" />
                    Conversa privada
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions - PREMIUM */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle - PREMIUM */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 backdrop-blur-sm shadow-lg hover:shadow-xl"
              title={darkMode ? 'Tema Claro' : 'Tema Escuro'}
              aria-label="Alternar tema"
            >
              {darkMode ? (
                <Sun size={18} className="sm:w-5 sm:h-5 text-yellow-500 animate-spin" style={{ animationDuration: '20s' }} />
              ) : (
                <Moon size={18} className="sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </button>

            {/* Logout Button - PREMIUM */}
            <button
              onClick={logout}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 bg-red-100/80 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-red-500/50"
              title="Sair"
              aria-label="Fazer logout"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Avatar Settings - PREMIUM */}
            <button
              onClick={() => setShowAvatarModal(true)}
              className="relative group transition-all duration-300 hover:scale-110 active:scale-95"
              title="Trocar Avatar"
              aria-label="Abrir configurações de avatar"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-75 blur transition-all duration-500 animate-pulse"></div>
              <div className="relative">
                <Avatar src={avatar} size="sm" online={connected} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={avatar}
        onSave={handleSaveAvatar}
      />
    </>
  );
};

export default ChatHeader;
