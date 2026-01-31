
import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  messages: [],
  activeChat: 'group',
  replyingTo: null,
  typingUsers: [],
  onlineUsers: 0,
  conversations: [
    { id: 'group', name: 'Grupo Geral', type: 'group', unread: 0 },
    { id: 'private', name: 'Chat Privado', type: 'private', unread: 0 }
  ],

  addMessage: (message) => {
    set((state) => {
      const exists = state.messages.some(m => m.id === message.id);
      if (exists) {
        return state;
      }
      return {
        messages: [...state.messages, message]
      };
    });
  },

  setMessages: (messages) => set({ messages }),

  setActiveChat: (chatId) => {
    set({ activeChat: chatId });
    
    const { markChatAsRead } = get();
    markChatAsRead(chatId);
  },

  setReplyingTo: (message) => set({ replyingTo: message }),

  clearReplyingTo: () => set({ replyingTo: null }),

  markAsRead: (messageId) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    }));
  },

  markChatAsRead: (chatId) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.chatType === chatId && msg.sender !== 'user'
          ? { ...msg, read: true }
          : msg
      )
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      messages: state.messages.map((msg) => ({ ...msg, read: true }))
    }));
  },

  getMessagesByChat: () => {
    const { messages, activeChat } = get();
    return messages.filter((msg) => msg.chatType === activeChat);
  },

  
  setTypingUsers: (users) => set({ typingUsers: users }),

  addTypingUser: (username) => {
    set((state) => ({
      typingUsers: state.typingUsers.includes(username)
        ? state.typingUsers
        : [...state.typingUsers, username]
    }));
  },

  removeTypingUser: (username) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter(u => u !== username)
    }));
  },

  setOnlineUsers: (count) => set({ onlineUsers: count }),
}));
