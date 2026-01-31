import { useState } from "react";
import { useChatStore } from "../../stores/chatStore";

export default function SearchMessages() {
  const [isOpen, setIsOpen] = useState(false);
  const searchMessages = useChatStore((s) => s.searchMessages);
  const searchQuery = useChatStore((s) => s.searchQuery);
  const searchResults = useChatStore((s) => s.searchResults);

  function handleSearch(e) {
    const query = e.target.value;
    searchMessages(query);
  }

  function formatTime(date) {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="relative">
      {/* Botão de busca */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 rounded-lg transition-colors"
        title="Buscar mensagens"
      >
        🔍
      </button>

      {/* Painel de busca */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-zinc-700">
            <h3 className="text-sm font-semibold text-zinc-100">
              Buscar Mensagens
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                searchMessages("");
              }}
              className="text-zinc-400 hover:text-zinc-200"
            >
              ✕
            </button>
          </div>

          {/* Input de busca */}
          <div className="p-3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Digite para buscar..."
              className="w-full bg-zinc-700 text-zinc-100 rounded-lg px-3 py-2 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/50"
              autoFocus
            />
          </div>

          {/* Resultados */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery && searchResults.length === 0 && (
              <div className="p-4 text-center text-zinc-400 text-sm">
                Nenhuma mensagem encontrada
              </div>
            )}

            {searchResults.map((msg) => (
              <div
                key={msg.id}
                className="p-3 hover:bg-zinc-700/50 cursor-pointer transition-colors border-b border-zinc-700/50 last:border-0"
              >
                <div className="flex items-start gap-2">
                  <img
                    src={msg.avatar || `https://ui-avatars.com/api/?name=${msg.user}`}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-zinc-100">
                        {msg.user}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer com contador */}
          {searchQuery && (
            <div className="p-2 text-center text-xs text-zinc-500 border-t border-zinc-700">
              {searchResults.length} {searchResults.length === 1 ? "resultado" : "resultados"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
