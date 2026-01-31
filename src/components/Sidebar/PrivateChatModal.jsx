import React from 'react';
import { MessageCircle, X, UserCircle } from 'lucide-react';

const PrivateChatModal = ({ user, onConfirm, onCancel }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Abrir Chat Privado
            </h3>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            {/* User Avatar */}
            <div className="relative mb-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-blue-500/30">
                  <UserCircle size={40} className="text-white" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
            </div>

            {/* User Info */}
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {user.username}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Online agora
            </p>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-300">
              Deseja abrir um chat privado com <strong>{user.username}</strong>?
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/50 flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Abrir Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChatModal;
