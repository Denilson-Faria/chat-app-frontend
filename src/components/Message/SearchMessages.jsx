
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchMessages = ({ messages, onSelectMessage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      const filtered = messages.filter(msg =>
        msg.text.toLowerCase().includes(term.toLowerCase()) && msg.type === 'text'
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const handleSelectResult = (message) => {
    onSelectMessage(message);
    setIsOpen(false);
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="relative">
      {/* Search Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="Buscar mensagens"
        >
          <Search size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Search Input */}
      {isOpen && (
        <div className="absolute top-0 right-0 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar mensagens..."
                autoFocus
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                  setResults([]);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {results.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelectResult(msg)}
                  className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 transition"
                >
                  <p className="text-sm text-gray-900 dark:text-white truncate">
                    {msg.text}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {msg.timestamp}
                  </p>
                </button>
              ))}
            </div>
          )}

          {searchTerm && results.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              Nenhuma mensagem encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchMessages;
