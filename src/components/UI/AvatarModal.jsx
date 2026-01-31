
import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import Avatar from './Avatar';

const AvatarModal = ({ isOpen, onClose, currentAvatar, onSave }) => {
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url) => {
    setUrlInput(url);
    if (url.trim()) {
      setPreviewUrl(url);
    }
  };

  const handleSave = () => {
    onSave(previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black rounded-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Personalizar Avatar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            <Avatar src={previewUrl} size="xl" />
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              <LinkIcon size={16} className="inline mr-2" />
              URL da Imagem
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://exemplo.com/avatar.jpg"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">
                ou
              </span>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 
                       bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                       transition font-medium"
            >
              <Upload size={20} />
              Fazer Upload de Arquivo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900
                     transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                     transition font-medium"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
