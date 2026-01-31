import React, { useRef, useEffect, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import { useSocket } from '../../context/SocketContext';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageItem from '../Message/MessageItem';
import MediaPreview from './MediaPreview';
import api from '../../services/api';

const ChatLayout = ({ onMenuClick }) => {
  const { messages, activeChat, setReplyingTo, markAsRead, addMessage, setMessages, markChatAsRead, replyingTo, clearReplyingTo } = useChatStore();
  const { avatar, user } = useAuthStore();
  const { socket, connected } = useSocket();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasLoadedHistory = useRef(false);
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);

  const filteredMessages = messages.filter(msg => msg.chatType === activeChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  useEffect(() => {
    if (!socket || !connected || !user) return;

    const currentUserId = user?.id || user?._id;

    markChatAsRead(activeChat);

    socket.emit('mark_chat_as_read', {
      chatType: activeChat,
      userId: currentUserId
    });
  }, [activeChat, socket, connected, user, markChatAsRead]);

  useEffect(() => {
    const loadHistory = async () => {
      if (hasLoadedHistory.current) return;
      
      setLoading(true);
      hasLoadedHistory.current = true;

      try {
        const response = await api.get(`/chat/messages/${activeChat}`);
        
        
        const historyMessages = response.data.messages || [];

        if (historyMessages.length > 0) {
          const currentUserId = user?.id || user?._id;
          
          const formattedMessages = historyMessages.map(msg => ({
            ...msg,
            sender: msg.senderId === currentUserId ? 'user' : 'contact',
            senderAvatar: msg.senderAvatar || null
          }));

          setMessages(formattedMessages);
         
        } else {
         
        }
      } catch (error) {
        console.error('❌ Erro ao carregar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    if (connected && user) {
      loadHistory();
    }
  }, [activeChat, connected, setMessages, user]);

  useEffect(() => {
    if (!socket || !connected || !user) return;

    const handleReceiveMessage = (message) => {
      
      
      const currentUserId = user?.id || user?._id;
      
      const formattedMessage = {
        ...message,
        sender: message.senderId === currentUserId ? 'user' : 'contact',
        senderAvatar: message.senderAvatar
      };
      
      addMessage(formattedMessage);
    };

    const handleMessageRead = (data) => {
      markAsRead(data.messageId);
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_read', handleMessageRead);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_read', handleMessageRead);
    };
  }, [socket, connected, addMessage, markAsRead, user]);

  useEffect(() => {
    hasLoadedHistory.current = false;
  }, [activeChat]);

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleMarkRead = (messageId) => {
    if (!socket) return;

    markAsRead(messageId);
    
    socket.emit('mark_as_read', {
      messageId,
      chatType: activeChat
    });
  };

  const handleMediaPreview = (previewData) => {
    setMediaPreview(previewData);
  };

  const handleSendMedia = (caption) => {
    if (!mediaPreview || !socket || !connected) return;

    const emoji = mediaPreview.type === 'image' ? '📷' : '🎥';

    socket.emit('send_message', {
      text: caption || `${emoji} ${mediaPreview.fileName}`,
      type: mediaPreview.type,
      mediaData: mediaPreview.preview,
      chatType: activeChat,
      replyTo: replyingTo
    });

    clearReplyingTo();
    setMediaPreview(null);
  };

  const handleCancelMedia = () => {
    setMediaPreview(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20 transition-colors duration-500 relative">
      {mediaPreview && (
        <MediaPreview
          preview={mediaPreview.preview}
          fileType={mediaPreview.type}
          fileName={mediaPreview.fileName}
          onSend={handleSendMedia}
          onCancel={handleCancelMedia}
        />
      )}

      <ChatHeader onMenuClick={onMenuClick} />

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(148 163 184) transparent'
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 animate-ping"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-40 animate-pulse"></div>
                <div className="relative w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
              <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Carregando mensagens...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aguarde um momento
              </p>
            </div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-in fade-in zoom-in duration-700">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-10 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl sm:text-6xl filter drop-shadow-lg">💬</span>
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Nenhuma mensagem ainda
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Envie uma mensagem para começar a conversa
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg, index) => {
              const messageAvatar = msg.senderAvatar || 
                'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
              
              return (
                <div 
                  key={msg.id}
                  className="animate-in slide-in-from-bottom-4 fade-in duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MessageItem
                    message={msg}
                    isOwn={msg.sender === 'user'}
                    avatar={messageAvatar}
                    onReply={handleReply}
                    onMarkRead={handleMarkRead}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onMediaPreview={handleMediaPreview} />
    </div>
  );
};

export default ChatLayout;