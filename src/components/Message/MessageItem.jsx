import React, { useState, useRef } from 'react';
import { Check, CheckCheck, Reply, Play, Pause, Download } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Avatar from '../UI/Avatar';

const MessageItem = ({ message, isOwn, avatar, onReply, onMarkRead }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const audioRef = useRef(null);

  const handlePlayAudio = () => {
    if (message.audioData) {
      if (!audioRef.current) {
        audioRef.current = new Audio(message.audioData);
        audioRef.current.onended = () => setIsPlaying(false);
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleReply = () => {
    onReply(message);
  };

  const handleClick = () => {
    if (!message.read && !isOwn) {
      onMarkRead(message.id);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const getStickerUrl = () => {
    if (!message.stickerUrl) return null;

    if (message.stickerUrl.startsWith("http")) {
      return message.stickerUrl;
    }

    return `${API_URL}${message.stickerUrl}`;
  };


  const handleDownload = (e) => {
    e.stopPropagation();
    if (message.mediaData) {
      const link = document.createElement('a');
      link.href = message.mediaData;
      link.download = `${message.type}_${Date.now()}.${message.type === 'image' ? 'jpg' : 'mp4'}`;
      link.click();
    }
  };

  const displayAvatar = message.senderAvatar || avatar;

  return (
    <div
      onClick={handleClick}
      className={`flex gap-2 sm:gap-3 mb-3 sm:mb-4 animate-in slide-in-from-bottom-2 fade-in duration-300 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >

      <div className="flex-shrink-0 transition-transform duration-300 hover:scale-110">
        <Avatar src={displayAvatar} size="sm" />
      </div>


      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>

        {message.replyTo && (
          <div
            className={`mb-2 p-2 sm:p-2.5 rounded-xl text-xs sm:text-sm border-l-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${isOwn
                ? 'bg-gradient-to-r from-blue-100/80 to-blue-50/60 dark:from-blue-900/40 dark:to-blue-900/20 border-blue-500 shadow-blue-500/20'
                : 'bg-gradient-to-r from-gray-100/80 to-gray-50/60 dark:from-gray-800/80 dark:to-gray-800/60 border-gray-400 dark:border-gray-600 shadow-gray-500/20'
              }`}
          >
            <p className={`font-bold mb-1 text-xs ${isOwn
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-400'
              }`}>
              {message.replyTo.sender === 'user' ? 'Você' : 'Contato'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 truncate">
              {message.replyTo.type === 'sticker' ? '🎨 Figurinha' :
                message.replyTo.type === 'image' ? '📷 Imagem' :
                  message.replyTo.type === 'video' ? '🎥 Vídeo' :
                    message.replyTo.text}
            </p>
          </div>
        )}


        <div
          className={`relative group ${message.type === 'sticker' || message.type === 'image' || message.type === 'video'
              ? 'bg-transparent'
              : `rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${isOwn
                ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white rounded-tr-md shadow-blue-500/50'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-md border border-gray-200/50 dark:border-gray-700/50 shadow-gray-500/20'
              }`
            }`}
        >

          {message.type === 'image' && message.mediaData && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={message.mediaData}
                alt="Imagem enviada"
                className={`relative max-w-[280px] sm:max-w-[320px] max-h-[400px] object-contain rounded-2xl shadow-2xl transition-all duration-300 cursor-pointer hover:brightness-90 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onClick={() => setLightboxOpen(true)}
              />
              {!imageLoaded && (
                <div className="w-[280px] h-[200px] bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              )}
              {message.text && message.text !== `📷 ${message.text.split('📷 ')[1]}` && (
                <p className={`mt-2 px-3 py-2 rounded-xl text-sm whitespace-pre-wrap break-words ${isOwn
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                  {message.text.replace(/^📷\s*.+\.(png|jpg|jpeg|gif|webp)/i, '').trim()}
                </p>
              )}
              <button
                onClick={handleDownload}
                className={`absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-lg hover:scale-110 ${isOwn
                    ? 'bg-blue-500/80 text-white hover:bg-blue-600'
                    : 'bg-gray-800/80 text-white hover:bg-gray-900'
                  }`}
                title="Baixar imagem"
              >
                <Download size={16} />
              </button>
            </div>
          )}


          {message.type === 'image' && message.mediaData && (
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              slides={[{ src: message.mediaData }]}
              styles={{
                container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' }
              }}
            />
          )}


          {message.type === 'video' && message.mediaData && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <video
                src={message.mediaData}
                controls
                className="relative max-w-[280px] sm:max-w-[320px] max-h-[400px] rounded-2xl shadow-2xl"
              />
              {message.text && message.text !== `🎥 ${message.text.split('🎥 ')[1]}` && (
                <p className={`mt-2 px-3 py-2 rounded-xl text-sm whitespace-pre-wrap break-words ${isOwn
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                  {message.text.replace(/^🎥\s*.+\.(mp4|mov|avi|webm)/i, '').trim()}
                </p>
              )}
              <button
                onClick={handleDownload}
                className={`absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md shadow-lg hover:scale-110 ${isOwn
                    ? 'bg-purple-500/80 text-white hover:bg-purple-600'
                    : 'bg-gray-800/80 text-white hover:bg-gray-900'
                  }`}
                title="Baixar vídeo"
              >
                <Download size={16} />
              </button>
            </div>
          )}


          {message.type === 'sticker' && (
            <div className="relative group">
              {message.stickerUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={getStickerUrl()}
                    alt="Sticker"
                    className="relative w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-2xl hover:scale-110 transition-all duration-300 cursor-pointer shadow-2xl"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160"%3E%3Crect fill="%23ddd" width="160" height="160"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="48"%3E🎨%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center text-6xl sm:text-8xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl">
                  {message.text || '🎨'}
                </div>
              )}
            </div>
          )}


          {message.type === 'audio' && (
            <button
              onClick={handlePlayAudio}
              className="flex items-center gap-3 min-w-[200px] sm:min-w-[240px] group-hover:scale-105 transition-transform duration-300"
            >
              <div className={`p-2 sm:p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isOwn
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-600/50'
                  : 'bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 shadow-gray-500/50'
                }`}>
                {isPlaying ? (
                  <Pause size={16} className={`${isOwn ? 'text-white' : 'text-gray-700 dark:text-gray-300'} transition-transform animate-pulse`} />
                ) : (
                  <Play size={16} className={isOwn ? 'text-white' : 'text-gray-700 dark:text-gray-300'} />
                )}
              </div>
              <div className="flex-1">
                <div className={`h-1.5 rounded-full relative overflow-hidden ${isOwn
                    ? 'bg-blue-400/30'
                    : 'bg-gray-400/50 dark:bg-gray-600/50'
                  }`}>
                  {isPlaying && (
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-blue-400 dark:to-blue-500 rounded-full animate-pulse shadow-lg"></div>
                  )}
                </div>
              </div>
              <span className={`text-xs font-mono font-semibold ${isOwn ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                }`}>
                {Math.floor((message.duration || 0) / 60)}:{((message.duration || 0) % 60).toString().padStart(2, '0')}
              </span>
            </button>
          )}

          {/* Text Message - PREMIUM */}
          {message.type === 'text' && (
            <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
              {message.text}
            </p>
          )}

          {/* Shimmer effect on own messages */}
          {isOwn && message.type === 'text' && (
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </div>
          )}

          {/* Reply Button - PREMIUM */}
          <button
            onClick={handleReply}
            className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm hover:scale-110 active:scale-95 ${isOwn
                ? '-left-10 sm:-left-12 bg-white/90 dark:bg-gray-800/90 text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-800 shadow-blue-500/50'
                : '-right-10 sm:-right-12 bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 shadow-gray-500/50'
              }`}
            title="Responder"
            aria-label="Responder mensagem"
          >
            <Reply size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Message Info - PREMIUM */}
        <div className={`flex items-center gap-1.5 mt-1.5 px-1 text-xs sm:text-sm transition-all duration-300`}>
          <span className={`font-medium ${isOwn
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-gray-500 dark:text-gray-400'
            }`}>
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && (
            <span className="transition-all duration-300 hover:scale-125">
              {message.read ? (
                <CheckCheck size={14} className="text-blue-500 dark:text-blue-400 drop-shadow-lg" />
              ) : (
                <Check size={14} className="text-gray-400 dark:text-gray-500" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
