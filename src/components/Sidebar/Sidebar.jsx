import React, { useState, useEffect, useRef } from 'react';
import { Users, Lock, MessageCircle, X, UserCircle } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useSocket } from '../../context/SocketContext';
import PrivateChatModal from './PrivateChatModal';

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const { activeChat, setActiveChat, messages } = useChatStore();
  const { socket, connected } = useSocket();
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return parseInt(localStorage.getItem('sidebarWidth') || '320');
  });
  const [isResizing, setIsResizing] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const sidebarRef = useRef(null);

  const conversations = [
    { 
      id: 'group', 
      name: 'Grupo Geral', 
      icon: Users, 
      description: 'Conversa em grupo',
      color: 'blue'
    },
    { 
      id: 'private', 
      name: 'Chat Privado', 
      icon: Lock, 
      description: 'Conversa privada',
      color: 'green'
    }
  ];


  useEffect(() => {
    if (!socket || !connected) return;

    const handleUserOnline = (data) => {
      setOnlineUsers(prev => {
        const exists = prev.find(u => u.userId === data.userId);
        if (exists) return prev;
        return [...prev, data];
      });
    };

    const handleUserOffline = (data) => {
      setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
    };

    const handleUsersCount = (count) => {
    };

    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('users_count', handleUsersCount);

    socket.emit('get_online_users');

    return () => {
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
      socket.off('users_count', handleUsersCount);
    };
  }, [socket, connected]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowPrivateModal(true);
  };

  const handleConfirmPrivateChat = () => {
 
    setActiveChat('private');
    setShowPrivateModal(false);
    onClose();
  };

  const getUnreadCount = (chatId) => {
    return messages.filter(
      msg => msg.chatType === chatId && !msg.read && msg.sender !== 'user'
    ).length;
  };

  const getLastMessage = (chatId) => {
    const chatMessages = messages.filter(msg => msg.chatType === chatId);
    if (chatMessages.length === 0) return null;
    
    const lastMsg = chatMessages[chatMessages.length - 1];
    
    if (lastMsg.type === 'sticker') return '🎨 Figurinha';
    if (lastMsg.type === 'audio') return '🎤 Áudio';
    if (lastMsg.type === 'image') return '📷 Imagem';
    if (lastMsg.type === 'video') return '🎥 Vídeo';
    return lastMsg.text || '';
  };

  const getLastMessageTime = (chatId) => {
    const chatMessages = messages.filter(msg => msg.chatType === chatId);
    if (chatMessages.length === 0) return '';
    
    const lastMsg = chatMessages[chatMessages.length - 1];
    const date = new Date(lastMsg.timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= 250 && newWidth <= 500) {
        setSidebarWidth(newWidth);
        localStorage.setItem('sidebarWidth', newWidth.toString());
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl 
          border-r border-gray-200/50 dark:border-gray-800/50 
          flex flex-col shadow-2xl transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ 
          width: window.innerWidth >= 1024 ? `${sidebarWidth}px` : '320px',
          minWidth: '250px', 
          maxWidth: window.innerWidth >= 1024 ? '500px' : '90vw'
        }}
      >
        {/* Header - PREMIUM */}
        <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/20 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/10 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/50 transform hover:scale-110 transition-all duration-300">
                  <MessageCircle size={22} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Conversas
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {onlineUsers.length} {onlineUsers.length === 1 ? 'usuário' : 'usuários'} online
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Fechar menu"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(148 163 184) transparent'
          }}
        >
          {/* Conversations List */}
          {conversations.map((conv, index) => {
            const Icon = conv.icon;
            const unreadCount = getUnreadCount(conv.id);
            const isActive = activeChat === conv.id;
            const lastMessage = getLastMessage(conv.id);
            const lastTime = getLastMessageTime(conv.id);

            return (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveChat(conv.id);
                  onClose();
                }}
                className={`w-full p-3 sm:p-4 flex items-center gap-3 border-b border-gray-100/50 dark:border-gray-900/50 transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 via-blue-50/80 to-purple-50/60 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-purple-900/20 border-l-4 border-l-blue-500 shadow-lg shadow-blue-500/10'
                    : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-900/30 dark:hover:to-gray-800/30 hover:shadow-md hover:scale-[1.02]'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-all duration-300 ${
                    conv.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                  }`}></div>
                  <div className={`relative p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                    conv.color === 'blue'
                      ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800'
                      : 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800'
                  }`}>
                    <Icon size={24} className={`transition-transform duration-300 group-hover:rotate-12 ${
                      conv.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                    }`} />
                  </div>
                </div>

                <div className="flex-1 text-left min-w-0 relative z-10">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                      {conv.name}
                    </h3>
                    {lastTime && (
                      <span className={`text-xs ml-2 flex-shrink-0 font-medium ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
                      }`}>
                        {lastTime}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs sm:text-sm truncate ${
                      isActive ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {lastMessage || conv.description}
                    </p>
                    {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-bold shadow-lg animate-pulse min-w-[24px] text-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
                )}
              </button>
            );
          })}

          {/* Online Users Section */}
          {onlineUsers.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 mt-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Usuários Online ({onlineUsers.length})
                </h3>
              </div>
              
              {onlineUsers.map((user, index) => (
                <button
                  key={user.userId}
                  onClick={() => handleUserClick(user)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all duration-200 border-b border-gray-100 dark:border-gray-900 group"
                >
                  <div className="relative flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500/50 group-hover:ring-green-500 transition-all"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ring-2 ring-green-500/50">
                        <UserCircle size={24} className="text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></div>
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                      {user.username}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Online agora
                    </p>
                  </div>

                  <MessageCircle size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={startResizing}
          className={`hidden lg:block absolute top-0 right-0 w-1.5 h-full cursor-col-resize transition-all duration-300 group ${
            isResizing 
              ? 'bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-lg' 
              : 'bg-transparent hover:bg-gradient-to-b hover:from-blue-400 hover:via-purple-400 hover:to-pink-400'
          }`}
        >
          <div className="absolute inset-y-0 -right-2 w-4"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 rounded-full bg-white shadow-lg"></div>
            <div className="w-1 h-1 rounded-full bg-white shadow-lg"></div>
            <div className="w-1 h-1 rounded-full bg-white shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Private Chat Modal */}
      {showPrivateModal && selectedUser && (
        <PrivateChatModal
          user={selectedUser}
          onConfirm={handleConfirmPrivateChat}
          onCancel={() => setShowPrivateModal(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
