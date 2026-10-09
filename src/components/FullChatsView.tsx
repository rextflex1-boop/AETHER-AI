import React, { useState } from 'react';
import {
  ArrowLeft,
  SlidersHorizontal,
  ListChecks,
  Search,
  MessageSquare,
  Trash2,
  Plus,
  Check,
  Pin,
  X,
  MoreVertical,
  Edit3,
} from 'lucide-react';
import { Conversation } from '../types.ts';
import { formatTimeAgo } from '../utils/timeAgo.ts';

interface FullChatsViewProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onDeleteMultipleConversations: (ids: string[]) => void;
  onRenameConversation?: (id: string, newTitle: string) => void;
  onTogglePin?: (id: string) => void;
  onBack: () => void;
}

export const FullChatsView: React.FC<FullChatsViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onDeleteMultipleConversations,
  onRenameConversation,
  onTogglePin,
  onBack,
}) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'pinned'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingConv, setRenamingConv] = useState<Conversation | null>(null);
  const [newTitleInput, setNewTitleInput] = useState('');

  // Filter conversations
  const filtered = conversations.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterMode === 'pinned') return !!c.isPinned;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((c) => c.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} conversation(s)?`)) {
      onDeleteMultipleConversations(selectedIds);
      setSelectedIds([]);
      setIsSelectMode(false);
    }
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (renamingConv && newTitleInput.trim() && onRenameConversation) {
      onRenameConversation(renamingConv.id, newTitleInput.trim());
    }
    setRenamingConv(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#fcfbf9] overflow-hidden select-none">
      {/* Top Bar matching Screenshots 5, 6, 7 */}
      <header className="shrink-0 h-14 border-b border-[#ece7dc] px-4 flex items-center justify-between bg-[#fcfbf9]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (isSelectMode) {
                setIsSelectMode(false);
                setSelectedIds([]);
              } else {
                onBack();
              }
            }}
            className="p-1.5 -ml-1.5 rounded-xl text-[#3d382f] hover:bg-[#efe9dd] transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-lg font-serif font-semibold text-[#1e1c18]">
            Chats
          </h1>
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-1.5 relative">
          {isSelectMode ? (
            <>
              {/* Select all toggle */}
              <button
                type="button"
                onClick={handleSelectAll}
                className="p-2 rounded-xl text-[#4a4437] hover:bg-[#efe9dd] transition-colors cursor-pointer text-xs font-medium"
                title="Select All"
              >
                {selectedIds.length === filtered.length && filtered.length > 0
                  ? 'Deselect all'
                  : 'Select all'}
              </button>

              {/* Trash icon to delete selected (Screenshot 5) */}
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  selectedIds.length > 0
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-[#bbb5a7] cursor-not-allowed'
                }`}
                title="Delete Selected"
              >
                <Trash2 className="w-5 h-5 stroke-[1.8]" />
              </button>
            </>
          ) : (
            <>
              {/* Filter Button (Sliders) - Screenshot 6 & 7 */}
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="p-2 rounded-xl text-[#4a4437] hover:bg-[#efe9dd] transition-colors cursor-pointer"
                title="Filter chats"
              >
                <SlidersHorizontal className="w-4.5 h-4.5 stroke-[1.8]" />
              </button>

              {/* Multi-select toggle button (Screenshot 7 right icon) */}
              <button
                type="button"
                onClick={() => setIsSelectMode(true)}
                className="p-2 rounded-xl text-[#4a4437] hover:bg-[#efe9dd] transition-colors cursor-pointer"
                title="Manage & Select chats"
              >
                <ListChecks className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* Filter Dropdown (Matching Screenshot 6) */}
              {isFilterDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsFilterDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-40 w-44 bg-white rounded-2xl border border-[#ece7dc] shadow-xl py-1.5 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setFilterMode('all');
                        setIsFilterDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#2d2922] hover:bg-[#f6f2e9] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#787163]" />
                        <span>All</span>
                      </div>
                      {filterMode === 'all' && (
                        <Check className="w-3.5 h-3.5 text-stone-900" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFilterMode('pinned');
                        setIsFilterDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#2d2922] hover:bg-[#f6f2e9] cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-[#787163]" />
                        <span>Pinned</span>
                      </div>
                      {filterMode === 'pinned' && (
                        <Check className="w-3.5 h-3.5 text-stone-900" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/* Search Input Bar (Matching Screenshots 5, 6, 7) */}
      <div className="px-4 py-2.5 shrink-0">
        <div className="relative">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-3 text-[#999282]" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white text-[#2d2922] placeholder:text-[#999282] rounded-xl border border-[#e5dfd2] focus:border-[#c5bca8] outline-none transition-all shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-[#999282] hover:text-[#2d2922]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chats List Area with 3-Dots Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-20 px-4 text-[#9c9484] text-xs">
            {search
              ? 'No matching conversations found.'
              : 'No conversations yet. Tap + New chat below to start talking with Ask AI!'}
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = selectedIds.includes(conv.id);
            const isMenuOpen = activeMenuId === conv.id;

            return (
              <div
                key={conv.id}
                className="relative"
              >
                <div
                  onClick={() => {
                    if (isSelectMode) {
                      toggleSelect(conv.id);
                    } else {
                      onSelectConversation(conv.id);
                      onBack();
                    }
                  }}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ece5d8]'
                      : 'hover:bg-[#f3ede1] active:bg-[#ece5d8]'
                  }`}
                >
                  {/* Checkbox in select mode (Screenshot 5) */}
                  {isSelectMode ? (
                    <div className="mt-0.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#1e1b18] border-[#1e1b18] text-white'
                            : 'border-[#a8a192] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  ) : (
                    <MessageSquare className="w-4.5 h-4.5 text-[#736c5e] shrink-0 mt-0.5 stroke-[1.8]" />
                  )}

                  {/* Title and timestamp */}
                  <div className="flex-1 min-w-0">
                    <div className="font-normal text-sm sm:text-[15px] text-[#1e1c18] truncate leading-tight">
                      {conv.title || 'Untitled'}
                    </div>
                    <div className="text-xs text-[#878070] mt-1">
                      {formatTimeAgo(conv.updatedAt)}
                    </div>
                  </div>

                  {conv.isPinned && (
                    <Pin className="w-3.5 h-3.5 text-[#878070] shrink-0 mt-1" />
                  )}

                  {/* 3-DOTS BUTTON ON RIGHT (Screenshot request) */}
                  {!isSelectMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : conv.id);
                      }}
                      className="p-1.5 rounded-lg text-[#8c8576] hover:text-[#1c1914] hover:bg-[#ddd6c7]/60 transition-colors cursor-pointer shrink-0"
                      title="Options"
                    >
                      <MoreVertical className="w-4 h-4 stroke-[2]" />
                    </button>
                  )}
                </div>

                {/* ANIMATED DROPDOWN MENU */}
                {isMenuOpen && !isSelectMode && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                      }}
                    />
                    <div className="absolute right-3 top-12 z-50 w-44 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#e5dfd2] shadow-[0_12px_32px_rgba(0,0,0,0.14)] py-1.5 animate-fade-in origin-top-right text-left">
                      {onTogglePin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin(conv.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#2e2a22] hover:bg-[#f6f2e8] transition-colors cursor-pointer"
                        >
                          <Pin className="w-3.5 h-3.5 text-[#736c5f]" />
                          <span>{conv.isPinned ? 'Unpin' : 'Pin to top'}</span>
                        </button>
                      )}

                      {onRenameConversation && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            setRenamingConv(conv);
                            setNewTitleInput(conv.title);
                          }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#2e2a22] hover:bg-[#f6f2e8] transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#736c5f]" />
                          <span>Rename</span>
                        </button>
                      )}

                      <div className="my-1 border-t border-[#f0ece2]" />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          if (window.confirm('Delete this conversation?')) {
                            onDeleteConversation(conv.id);
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Delete chat</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom-Right "+ New chat" Button (Matching Screenshots 6 & 7) */}
      {!isSelectMode && (
        <div className="p-4 flex justify-end shrink-0 z-20">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onBack();
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1e1b18] hover:bg-black active:scale-95 text-white text-sm font-medium shadow-xl transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5 stroke-[2]" />
            <span>New chat</span>
          </button>
        </div>
      )}

      {/* RENAME MODAL */}
      {renamingConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#e5dfd2]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece2]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4.5 h-4.5 text-[#d89f68]" />
                <h3 className="font-bold text-base text-[#1e1c18]">Rename Chat</h3>
              </div>
              <button
                onClick={() => setRenamingConv(null)}
                className="p-1 rounded-xl text-[#857f72] hover:text-[#1e1c18] hover:bg-[#ede9df]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRename} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#666052] mb-1.5">
                  Chat Title
                </label>
                <input
                  type="text"
                  value={newTitleInput}
                  onChange={(e) => setNewTitleInput(e.target.value)}
                  autoFocus
                  placeholder="Enter new title..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#fbf9f4] text-[#1e1c18] border border-[#e0d9ca] focus:border-[#d89f68] focus:ring-2 focus:ring-[#d89f68]/20 rounded-2xl outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setRenamingConv(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#666052] hover:bg-[#f0ece2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitleInput.trim()}
                  className="px-5 py-2 rounded-xl bg-[#1e1b18] hover:bg-black text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
