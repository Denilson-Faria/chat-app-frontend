import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, X, Smile, Sticker, Paperclip } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useSocket } from '../../context/SocketContext';
import AudioRecorder from './AudioRecorder';
import EmojiPicker from './EmojiPicker';
import StickerPicker from './StickerPicker';

const MAX_CHARS = 5000;
const TYPING_TIMEOUT = 2000;
const MAX_INPUT_HEIGHT = 120;
const WARNING_THRESHOLD = 0.9;

const ChatInput = ({ onMediaPreview }) => {
  const [inputText, setInputText] = useState('');
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const { replyingTo, clearReplyingTo, activeChat } = useChatStore();
  const { socket, connected } = useSocket();
  
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const charCount = inputText.length;
  const showCharCount = charCount > MAX_CHARS * WARNING_THRESHOLD;
  const isOverLimit = charCount >= MAX_CHARS;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, MAX_INPUT_HEIGHT)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (!socket || !connected) return;

    if (inputText.length > 0 && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', { chatType: activeChat });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket.emit('stop_typing', { chatType: activeChat });
      }
    }, TYPING_TIMEOUT);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [inputText, socket, connected, activeChat, isTyping]);

  const handleSend = useCallback(() => {
    if (!inputText.trim() || !socket || !connected) return;

    if (isTyping) {
      setIsTyping(false);
      socket.emit('stop_typing', { chatType: activeChat });
    }

    socket.emit('send_message', {
      text: inputText,
      type: 'text',
      chatType: activeChat,
      replyTo: replyingTo
    });

    setInputText('');
    clearReplyingTo();
    inputRef.current?.focus();
  }, [inputText, socket, connected, isTyping, activeChat, replyingTo, clearReplyingTo]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleSendAudio = useCallback(async (audioBlob, duration) => {
    if (!socket || !connected) return;

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64Audio = reader.result;
      const minutes = Math.floor(duration / 60);
      const seconds = (duration % 60).toString().padStart(2, '0');
      
      socket.emit('send_message', {
        text: `Áudio (${minutes}:${seconds})`,
        type: 'audio',
        audioData: base64Audio,
        duration,
        chatType: activeChat,
        replyTo: replyingTo
      });

      clearReplyingTo();
      setShowAudioRecorder(false);
    };
  }, [socket, connected, activeChat, replyingTo, clearReplyingTo]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      
      let messageType = 'file';
      if (file.type.startsWith('image/')) {
        messageType = 'image';
      } else if (file.type.startsWith('video/')) {
        messageType = 'video';
      }

      onMediaPreview?.({
        preview: base64Data,
        type: messageType,
        fileName: file.name
      });
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  }, [onMediaPreview]);

  const handleEmojiSelect = useCallback((emoji) => {
    const cursorPosition = inputRef.current?.selectionStart || inputText.length;
    const textBefore = inputText.substring(0, cursorPosition);
    const textAfter = inputText.substring(cursorPosition);
    
    setInputText(textBefore + emoji + textAfter);
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      inputRef.current?.focus();
      const newPosition = cursorPosition + emoji.length;
      inputRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [inputText]);

  const handleStickerSelect = useCallback((sticker) => {
    if (!socket || !connected) return;

    socket.emit('send_message', {
      text: '',
      type: 'sticker',
      stickerUrl: sticker.stickerUrl || sticker.url,
      chatType: activeChat,
      replyTo: replyingTo
    });

    clearReplyingTo();
    setShowStickerPicker(false);
  }, [socket, connected, activeChat, replyingTo, clearReplyingTo]);

  const togglePicker = useCallback((picker) => {
    if (picker === 'emoji') {
      setShowEmojiPicker(prev => !prev);
      setShowStickerPicker(false);
    } else {
      setShowStickerPicker(prev => !prev);
      setShowEmojiPicker(false);
    }
  }, []);

  return (
    <div className="relative bg-gradient-to-b from-white/95 to-white/80 dark:from-gray-950/95 dark:to-gray-950/80 backdrop-blur-2xl border-t border-gray-200/60 dark:border-gray-800/60 p-3 sm:p-4 lg:p-5">
      {replyingTo && (
        <div className="mb-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border-l-4 border-blue-500 dark:border-blue-400 rounded-2xl flex justify-between items-start gap-3 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5 animate-in slide-in-from-bottom-2 duration-300 backdrop-blur-xl">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
              Respondendo a {replyingTo.sender === 'user' ? 'você' : replyingTo.senderName || 'contato'}
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 truncate line-clamp-2">
              {replyingTo.text || 'Mídia'}
            </p>
          </div>
          <button
            onClick={clearReplyingTo}
            className="flex-shrink-0 p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
            aria-label="Cancelar resposta"
          >
            <X size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {showAudioRecorder ? (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <AudioRecorder
            onSendAudio={handleSendAudio}
            onCancel={() => setShowAudioRecorder(false)}
          />
        </div>
      ) : (
        <div className="flex items-end gap-2 sm:gap-2.5">
          <div className="relative flex-shrink-0">
            <button
              onClick={() => togglePicker('emoji')}
              disabled={!connected}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
                showEmojiPicker
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white scale-105 shadow-blue-500/40'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-750 hover:scale-105'
              }`}
              title="Emojis"
              aria-label="Abrir seletor de emojis"
            >
              <Smile size={20} className="sm:w-5 sm:h-5" />
            </button>

            {showEmojiPicker && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <EmojiPicker
                  onSelectEmoji={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => togglePicker('sticker')}
              disabled={!connected}
              className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
                showStickerPicker
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white scale-105 shadow-purple-500/40'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-gray-700 dark:hover:to-gray-750 hover:scale-105'
              }`}
              title="Figurinhas"
              aria-label="Abrir seletor de figurinhas"
            >
              <Sticker size={20} className="sm:w-5 sm:h-5" />
            </button>

            {showStickerPicker && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <StickerPicker
                  onSelectSticker={handleStickerSelect}
                  onClose={() => setShowStickerPicker(false)}
                />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!connected}
            className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-750 hover:scale-105 shadow-md hover:shadow-lg"
            title="Anexar arquivo"
            aria-label="Anexar arquivo"
          >
            <Paperclip size={20} className="sm:w-5 sm:h-5" />
          </button>

          <div className="flex-1 relative group">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={connected ? "Digite uma mensagem..." : "Desconectado..."}
              disabled={!connected}
              rows={1}
              maxLength={MAX_CHARS}
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 dark:border-gray-700/60 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
              style={{ minHeight: '48px', maxHeight: `${MAX_INPUT_HEIGHT}px` }}
              aria-label="Campo de mensagem"
            />
            {showCharCount && (
              <div className="absolute bottom-2 right-3 text-xs font-semibold animate-in fade-in zoom-in-95 duration-200">
                <span className={`px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm ${
                  isOverLimit
                    ? 'bg-red-500/20 text-red-600 dark:text-red-400 ring-1 ring-red-500/30' 
                    : 'bg-orange-500/20 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/30'
                }`}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            )}
          </div>

          {inputText.trim() ? (
            <button
              onClick={handleSend}
              disabled={!connected || isOverLimit}
              className="flex-shrink-0 p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-105 active:scale-95 relative overflow-hidden group"
              title="Enviar mensagem"
              aria-label="Enviar mensagem"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <Send size={20} className="sm:w-5 sm:h-5 relative z-10" />
            </button>
          ) : (
            <button
              onClick={() => setShowAudioRecorder(true)}
              disabled={!connected}
              className="flex-shrink-0 p-2.5 sm:p-3 bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 hover:from-red-600 hover:via-rose-700 hover:to-pink-700 text-white rounded-xl sm:rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-500/40 hover:shadow-xl hover:shadow-red-600/50 hover:scale-105 active:scale-95 relative overflow-hidden group"
              title="Gravar áudio"
              aria-label="Gravar áudio"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <Mic size={20} className="sm:w-5 sm:h-5 relative z-10 animate-pulse" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInput;