import React, { useState } from 'react';
import {
  X,
  Plus,
  MessageSquare,
  Search,
  Trash2,
  Edit2,
  Check,
  Sparkles,
} from 'lucide-react';
import { Conversation } from '../types.ts';

interface ChatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

export const ChatsDrawer: React.FC<ChatsDrawerProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(search.toLowerCase()))
  );

  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (id: string, e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Backdrop with smooth blur and fade */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Smooth sliding drawer from the LEFT */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white/95 backdrop-blur-2xl border-r border-stone-200/90 shadow-[0_20px_60px_rgba(0,0,0,0.18)] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#d89f68] to-[#f4d0a5] flex items-center justify-center text-white shadow-sm font-bold text-sm">
              ✨
            </div>
            <div>
              <div className="font-bold text-sm text-stone-900 tracking-tight">
                My Chats
              </div>
              <div className="text-[11px] text-stone-500">History & Conversations</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs shadow-md shadow-red-500/25 transition-all cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Start New Chat</span>
          </button>
        </div>

        {/* Search Chats Input */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-100/90 text-stone-800 placeholder:text-stone-400 rounded-xl border border-stone-200 focus:border-[#d89f68] outline-none transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 select-none">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4 text-stone-400 text-xs">
              No conversations found. Start a new chat!
            </div>
          ) : (
            filtered.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const isEditing = editingId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    if (!isEditing) {
                      onSelectConversation(conv.id);
                      onClose();
                    }
                  }}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-stone-100 to-white text-stone-900 font-semibold shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:bg-stone-100/70 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-red-500' : 'text-stone-400'
                      }`}
                    />
                    {isEditing ? (
                      <div
                        className="flex items-center gap-1 flex-1 mr-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(conv.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className="bg-white text-stone-900 text-xs px-2 py-1 rounded-lg w-full border border-red-400 outline-none"
                        />
                        <button
                          onClick={(e) => saveRename(conv.id, e)}
                          className="p-1 hover:text-emerald-600 text-stone-500"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                          className="p-1 hover:text-red-600 text-stone-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="truncate flex-1">
                        {conv.title || 'New Conversation'}
                      </span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                      <button
                        onClick={(e) => startRename(conv, e)}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
                        title="Rename"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="p-1 rounded text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer brand info */}
        <div className="p-3 border-t border-stone-200/80 bg-stone-50/70 text-center">
          <div className="text-[11px] font-semibold text-stone-600">Aks AI Assistant</div>
          <div className="text-[10px] text-stone-400">Powered by Gemini 3.8 Flash</div>
        </div>
      </aside>
    </>
  );
};
