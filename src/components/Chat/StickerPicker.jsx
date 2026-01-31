import React, { useState, useRef, useEffect } from 'react';
import { Clock, Heart, Sparkles, Loader2 } from 'lucide-react';
import api from '../../services/api'; 

const StickerPicker = ({ onSelectSticker, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('ainnn');
  const [recentStickers, setRecentStickers] = useState([]);
  const [stickers, setStickers] = useState({});
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);

  const categories = [
    { id: 'recent', icon: Clock, label: 'Recentes' },
    { id: 'ainnn', icon: Heart, label: 'Ainnn' }
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentStickers') || '[]');
    setRecentStickers(stored);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const fetchPackFromBackend = async () => {
    try {
 
      const res = await api.get('/stickers');
      const urls = res.data;
      
      return urls.map(url => ({
        file_id: url, 
        url: `http://localhost:5000${url}`, 
        thumb: `http://localhost:5000${url}` 
      }));
    } catch (err) {
      return [];
    }
  };

  const loadStickers = async (categoryId) => {
    if (stickers[categoryId]) return;
    
    setLoading(true);
    const packStickers = await fetchPackFromBackend();
    setStickers(prev => ({ ...prev, [categoryId]: packStickers }));
    setLoading(false);
  };

  useEffect(() => {
    if (activeCategory !== 'recent') {
      loadStickers(activeCategory);
    }
  }, [activeCategory]);


  const handleStickerClick = (sticker) => {
   
    onSelectSticker({
      type: 'sticker',
      url: sticker.url,  
      stickerUrl: sticker.url, 
      text: ''
    });


    const updated = [
      sticker,
      ...recentStickers.filter(s => s.file_id !== sticker.file_id)
    ].slice(0, 20);

    setRecentStickers(updated);
    localStorage.setItem('recentStickers', JSON.stringify(updated));
  };

  const getCurrentStickers = () => {
    if (activeCategory === 'recent') return recentStickers;
    return stickers[activeCategory] || [];
  };

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800
      rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
      w-[380px] h-[480px] flex flex-col overflow-hidden z-50"
    >
      {/* HEADER */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          😎 Stickers
        </h3>
      </div>

      {/* CATEGORIAS */}
      <div className="flex gap-1 px-2 py-2 border-b border-gray-200 dark:border-gray-700">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-2 rounded-lg transition ${
                activeCategory === cat.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title={cat.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="animate-spin mb-2 text-blue-500" size={40} />
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando stickers...</p>
          </div>
        ) : getCurrentStickers().length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Sparkles size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {activeCategory === 'recent' 
                  ? 'Nenhum sticker recente' 
                  : 'Nenhuma figurinha disponível'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {getCurrentStickers().map(sticker => (
              <button
                key={sticker.file_id}
                onClick={() => handleStickerClick(sticker)}
                className="aspect-square bg-gray-100 dark:bg-gray-700
                rounded-xl hover:scale-105 active:scale-95 transition overflow-hidden"
              >
                <img
                  src={sticker.thumb}
                  alt="sticker"
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd"/%3E%3C/svg%3E';
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickerPicker;
