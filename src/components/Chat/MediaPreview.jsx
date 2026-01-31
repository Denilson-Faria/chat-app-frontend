import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const MediaPreview = ({ preview, fileType, fileName, onSend, onCancel }) => {
  const [caption, setCaption] = useState('');

  const handleSend = () => {
    onSend(caption);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Preview - {fileType === 'image' ? 'Imagem' : 'Vídeo'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          {fileType === 'image' ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-[60vh] object-contain rounded-2xl shadow-2xl"
            />
          ) : (
            <video
              src={preview}
              controls
              className="w-full h-auto max-h-[60vh] rounded-2xl shadow-2xl"
            />
          )}
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
            {fileName}
          </p>
        </div>
      </div>

      {/* Caption Input */}
      <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus-within:border-blue-500 transition-colors">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Adicione uma legenda (opcional)..."
                className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none"
                rows={2}
                autoFocus
              />
            </div>
            
            <button
              onClick={handleSend}
              className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
            >
              <Send size={20} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Pressione Enter para enviar • Shift + Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
};

export default MediaPreview;
