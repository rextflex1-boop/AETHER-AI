import React, { useState } from 'react';
import {
  MessageSquare,
  FolderKanban,
  Code2,
  Boxes,
  Plus,
  X,
  MoreVertical,
  Trash2,
  Edit3,
  Pin,
  Share2,
  Check,
  LogIn,
} from 'lucide-react';
import { Conversation, AppView } from '../types.ts';

interface ClaudeStyleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onNavigate: (view: AppView) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePin?: (id: string) => void;
  onShareChat?: (conversation: Conversation) => void;
  userEmail?: string;
}

export const ClaudeStyleDrawer: React.FC<ClaudeStyleDrawerProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onNavigate,
  onDeleteConversation,
  onRenameConversation,
  onTogglePin,
  onShareChat,
  userEmail = 'pubgxmobile2867@gmail.com',
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingConv, setRenamingConv] = useState<Conversation | null>(null);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const initials = userEmail.slice(0, 2).toUpperCase() || 'PU';

  const handleStartRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setRenamingConv(conv);
    setNewTitleInput(conv.title);
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (renamingConv && newTitleInput.trim()) {
      onRenameConversation(renamingConv.id, newTitleInput.trim());
    }
    setRenamingConv(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    onDeleteConversation(id);
    setDeleteConfirmId(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setActiveMenuId(null);
          onClose();
        }}
      />

      {/* Slide-out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#fbf9f4] border-r border-[#ece8df] shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: AETHER AI */}
        <div className="pt-6 pb-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold tracking-tight text-[#1e1c18]">
              AETHER AI
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <button
            onClick={() => {
              setActiveMenuId(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#857f72] hover:text-[#1e1c18] hover:bg-[#ede9df] transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation Links */}
        <div className="px-3 space-y-0.5">
          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              onNavigate('chats-list');
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-normal text-[#2d2922] hover:bg-[#f0ebe0] transition-colors text-left cursor-pointer"
          >
            <MessageSquare className="w-4.5 h-4.5 text-[#6c6659] stroke-[1.8]" />
            <span>Chats</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              onNavigate('projects');
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-normal text-[#2d2922] hover:bg-[#f0ebe0] transition-colors text-left cursor-pointer"
          >
            <FolderKanban className="w-4.5 h-4.5 text-[#6c6659] stroke-[1.8]" />
            <span>Projects</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              onNavigate('chat');
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-normal text-[#2d2922] hover:bg-[#f0ebe0] transition-colors text-left cursor-pointer"
          >
            <Code2 className="w-4.5 h-4.5 text-[#6c6659] stroke-[1.8]" />
            <span>Code</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              onNavigate('chat');
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-normal text-[#2d2922] hover:bg-[#f0ebe0] transition-colors text-left cursor-pointer"
          >
            <Boxes className="w-4.5 h-4.5 text-[#6c6659] stroke-[1.8]" />
            <span>Artifacts</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              onNavigate('auth');
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#2d2922] hover:bg-[#f0ebe0] transition-colors text-left cursor-pointer"
          >
            <LogIn className="w-4.5 h-4.5 text-[#b87a46] stroke-[1.8]" />
            <div className="flex items-center justify-between flex-1">
              <span>Account & Login</span>
              <span className="text-[10px] font-bold text-[#b87a46] px-1.5 py-0.5 rounded-md bg-[#f4ece1]">
                AETHER
              </span>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="my-3 mx-4 border-t border-[#ece7dc]" />

        {/* Recents Section */}
        <div className="px-5 pt-1 pb-1.5 text-xs font-semibold text-[#8b8474]">
          Recents
        </div>

        {/* Real User Conversations List with 3-Dots Action Button (As Requested in Screenshot) */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {conversations.length === 0 ? (
            <div className="px-3 py-6 text-xs text-[#9d9685] text-center">
              No recent chats yet
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const isMenuOpen = activeMenuId === conv.id;

              return (
                <div
                  key={conv.id}
                  className="relative group"
                >
                  <div
                    onClick={() => {
                      setActiveMenuId(null);
                      onSelectConversation(conv.id);
                      onNavigate('chat');
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl text-xs sm:text-[13px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#ece5d8] text-[#1c1914] font-medium shadow-xs'
                        : 'text-[#3d382f] hover:bg-[#f2ece1]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <MessageSquare className="w-4 h-4 text-[#787163] shrink-0 stroke-[1.8]" />
                      <span className="truncate flex-1">
                        {conv.title || 'Untitled'}
                      </span>
                      {conv.isPinned && (
                        <Pin className="w-3 h-3 text-[#b87a46] shrink-0" />
                      )}
                    </div>

                    {/* 3-DOTS BUTTON (Matching User's Hand-Drawn Annotation!) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : conv.id);
                      }}
                      className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                        isMenuOpen
                          ? 'bg-[#ddd6c7] text-[#1c1914]'
                          : 'text-[#8c8576] hover:text-[#1c1914] hover:bg-[#ddd6c7]/60'
                      }`}
                      title="Chat options"
                    >
                      <MoreVertical className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  </div>

                  {/* ANIMATED DROPDOWN MENU FOR THIS CHAT */}
                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                        }}
                      />
                      <div className="absolute right-2 top-11 z-50 w-48 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#e5dfd2] shadow-[0_12px_32px_rgba(0,0,0,0.14)] py-1.5 animate-fade-in origin-top-right text-left">
                        {/* 1. Pin option */}
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
                            <span>{conv.isPinned ? 'Unpin chat' : 'Pin to top'}</span>
                          </button>
                        )}

                        {/* 2. Rename option */}
                        <button
                          type="button"
                          onClick={(e) => handleStartRename(conv, e)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#2e2a22] hover:bg-[#f6f2e8] transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#736c5f]" />
                          <span>Rename</span>
                        </button>

                        {/* 3. Share option */}
                        {onShareChat && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(null);
                              onShareChat(conv);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-[#2e2a22] hover:bg-[#f6f2e8] transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-[#736c5f]" />
                            <span>Share / Export</span>
                          </button>
                        )}

                        <div className="my-1 border-t border-[#f0ece2]" />

                        {/* 4. Delete option */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(conv.id);
                            setActiveMenuId(null);
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

        {/* Drawer Bottom: User Avatar + + New Chat pill */}
        <div className="p-4 border-t border-[#ebe5da] flex items-center justify-between bg-[#fbf9f4]">
          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              onNavigate('settings');
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-[#d96b43] text-white font-semibold text-xs flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
            title="User Profile & Settings"
          >
            {initials}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMenuId(null);
              onNewChat();
              onNavigate('chat');
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1e1b18] hover:bg-black text-white text-xs font-medium shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>New chat</span>
          </button>
        </div>
      </aside>

      {/* POWERFUL RENAME DIALOG MODAL */}
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

      {/* CONFIRM DELETE DIALOG MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-red-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1e1c18]">Delete Chat?</h3>
                <p className="text-xs text-[#706a5c]">This conversation will be permanently deleted.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#f2eee6] mt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#666052] hover:bg-[#f0ece2] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleDelete(deleteConfirmId, e)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
