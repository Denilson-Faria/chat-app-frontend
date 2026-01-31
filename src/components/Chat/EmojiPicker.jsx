import React, { useState, useRef, useEffect } from 'react';
import { Smile, Search, Clock, Heart, Coffee, Lightbulb, Flag, Activity } from 'lucide-react';

const EmojiPicker = ({ onSelectEmoji, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentEmojis, setRecentEmojis] = useState([]);
  const [showSkinTones, setShowSkinTones] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const pickerRef = useRef(null);

  const skinTones = [
    { tone: '', label: 'Padrão', color: '#FFDD67' },
    { tone: '🏻', label: 'Claro', color: '#FFE1BD' },
    { tone: '🏼', label: 'Médio-claro', color: '#F7D7C4' },
    { tone: '🏽', label: 'Médio', color: '#D4A57A' },
    { tone: '🏾', label: 'Médio-escuro', color: '#9E7A5A' },
    { tone: '🏿', label: 'Escuro', color: '#5D4037' }
  ];

  const categories = [
    { id: 'recent', icon: Clock, label: 'Recentes' },
    { id: 'smileys', icon: Smile, label: 'Rostos' },
    { id: 'gestures', icon: Activity, label: 'Gestos' },
    { id: 'animals', icon: Heart, label: 'Animais' },
    { id: 'food', icon: Coffee, label: 'Comida' },
    { id: 'activities', icon: Lightbulb, label: 'Atividades' },
    { id: 'objects', icon: Lightbulb, label: 'Objetos' },
    { id: 'symbols', icon: Flag, label: 'Símbolos' },
    { id: 'flags', icon: Flag, label: 'Bandeiras' }
  ];

  const emojiData = {
    smileys: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇',
      '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝',
      '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄',
      '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
      '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟',
      '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢',
      '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬',
      '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'
    ],
    gestures: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
      '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏',
      '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶',
      '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'
    ],
    animals: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷',
      '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆',
      '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
      '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐',
      '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓',
      '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎'
    ],
    food: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑',
      '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽',
      '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚',
      '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕',
      '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲',
      '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢',
      '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿',
      '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋'
    ],
    activities: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸',
      '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋',
      '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸',
      '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴',
      '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰',
      '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🪗', '🎸', '🪕'
    ],
    objects: [
      '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿',
      '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺',
      '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋',
      '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙',
      '💰', '💳', '🧾', '💎', '⚖️', '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️',
      '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️'
    ],
    symbols: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️',
      '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
      '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎',
      '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚',
      '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲',
      '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯'
    ],
    flags: [
      '🏳️', '🏴', '🏁', '🚩', '🏳️‍🌈', '🏳️‍⚧️', '🇧🇷', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪',
      '🇫🇷', '🇮🇹', '🇪🇸', '🇵🇹', '🇷🇺', '🇨🇳', '🇯🇵', '🇰🇷', '🇮🇳', '🇲🇽', '🇦🇷', '🇨🇱',
      '🇨🇴', '🇵🇪', '🇻🇪', '🇪🇨', '🇧🇴', '🇺🇾', '🇵🇾', '🇸🇪', '🇳🇴', '🇩🇰', '🇫🇮', '🇮🇸'
    ]
  };

  const emojisWithSkinTone = ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰'];

  useEffect(() => {
    const stored = localStorage.getItem('recentEmojis');
    if (stored) {
      setRecentEmojis(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleEmojiClick = (emoji) => {
    if (emojisWithSkinTone.includes(emoji)) {
      setSelectedEmoji(emoji);
      setShowSkinTones(true);
    } else {
      selectEmoji(emoji);
    }
  };

  const handleSkinToneSelect = (tone) => {
    const emojiWithTone = selectedEmoji + tone;
    selectEmoji(emojiWithTone);
    setShowSkinTones(false);
    setSelectedEmoji(null);
  };

  const selectEmoji = (emoji) => {
    onSelectEmoji(emoji);
    
    const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 40);
    setRecentEmojis(updated);
    localStorage.setItem('recentEmojis', JSON.stringify(updated));
  };

  const getCurrentEmojis = () => {
    if (activeCategory === 'recent') {
      return recentEmojis;
    }
    
    const emojis = emojiData[activeCategory] || [];
    
    if (searchTerm) {
      return emojis.filter(() => true);
    }
    
    return emojis;
  };

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-[350px] h-[420px] flex flex-col overflow-hidden"
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar emoji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex gap-1 px-2 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 p-2 rounded-lg transition ${
                activeCategory === cat.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
              title={cat.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {showSkinTones ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl mb-4">{selectedEmoji}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Escolha o tom de pele</div>
            <div className="flex gap-2">
              {skinTones.map((skin) => (
                <button
                  key={skin.tone}
                  onClick={() => handleSkinToneSelect(skin.tone)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition"
                  style={{ backgroundColor: skin.color }}
                  title={skin.label}
                />
              ))}
            </div>
            <button
              onClick={() => {
                setShowSkinTones(false);
                setSelectedEmoji(null);
              }}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1">
            {getCurrentEmojis().map((emoji, index) => (
              <button
                key={`${emoji}-${index}`}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;
