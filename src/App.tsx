/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AksBackground } from './components/AksBackground.tsx';
import { AksTopBar } from './components/AksTopBar.tsx';
import { AksInputBar } from './components/AksInputBar.tsx';
import { ClaudeStyleDrawer } from './components/ClaudeStyleDrawer.tsx';
import { FullChatsView } from './components/FullChatsView.tsx';
import { ProjectsView } from './components/ProjectsView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { VoiceSettingsView } from './components/VoiceSettingsView.tsx';
import { ModelSelectorModal } from './components/ModelSelectorModal.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { ChatMessageView } from './components/ChatMessageView.tsx';
import { AksWelcomeView } from './components/AksWelcomeView.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import {
  Conversation,
  ChatMessage,
  ChatImage,
  AIModelType,
  AppView,
  AuthUser,
} from './types.ts';

const STORAGE_KEY = 'ask_ai_user_conversations_v2';
const USER_EMAIL = 'pubgxmobile2867@gmail.com';

function createNewConversation(model: AIModelType = 'gemini-3.1-flash-lite'): Conversation {
  return {
    id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: 'Untitled',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    model,
  };
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    // Only real chats: start fresh with an empty new chat
    return [createNewConversation()];
  });

  const [activeId, setActiveId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0].id;
      }
    } catch (e) {}
    return conversations[0]?.id || '';
  });

  const [activeView, setActiveView] = useState<AppView>('chat');
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem('aether_ai_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      email: USER_EMAIL,
      name: 'Aether Explorer',
      isGuest: false,
    };
  });
  const [currentModel, setCurrentModel] = useState<AIModelType>('gemini-3.1-flash-lite');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active conversation
  const activeConversation =
    conversations.find((c) => c.id === activeId) || conversations[0] || createNewConversation();

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {}
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeView === 'chat') {
      scrollToBottom();
    }
  }, [activeConversation?.messages, activeView]);

  // Create new chat
  const handleNewChat = () => {
    if (isStreaming) handleStopGeneration();
    const newConv = createNewConversation(currentModel);
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setActiveView('chat');
  };

  // Select conversation
  const handleSelectConversation = (id: string) => {
    if (isStreaming) handleStopGeneration();
    setActiveId(id);
    setActiveView('chat');
  };

  // Delete single conversation
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const fresh = createNewConversation(currentModel);
        setActiveId(fresh.id);
        return [fresh];
      }
      if (activeId === id) {
        setActiveId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Delete multiple conversations (for Select Mode in Chats View)
  const handleDeleteMultipleConversations = (ids: string[]) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => !ids.includes(c.id));
      if (filtered.length === 0) {
        const fresh = createNewConversation(currentModel);
        setActiveId(fresh.id);
        return [fresh];
      }
      if (ids.includes(activeId)) {
        setActiveId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Clear all chats
  const handleClearAllChats = () => {
    const fresh = createNewConversation(currentModel);
    setConversations([fresh]);
    setActiveId(fresh.id);
    setActiveView('chat');
  };

  // Rename conversation
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  // Toggle pin conversation
  const handleTogglePin = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Retry last message if error occurred
  const handleRetryLastMessage = () => {
    if (isStreaming) return;
    const msgs = activeConversation.messages;
    if (msgs.length === 0) return;

    let lastUserIndex = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1) return;

    const lastUser = msgs[lastUserIndex];
    const trimmed = msgs.slice(0, lastUserIndex);
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, messages: trimmed } : c))
    );
    handleSendMessage(lastUser.text, lastUser.image);
  };

  // Stop stream
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.isStreaming ? { ...m, isStreaming: false } : m
          ),
        };
      })
    );
  };

  // Auto-generate title
  const generateTitle = async (convId: string, promptText: string) => {
    try {
      const res = await fetch('/api/chat/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title && data.title !== 'New Conversation') {
          handleRenameConversation(convId, data.title);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send message
  const handleSendMessage = async (text: string, attachment?: ChatImage) => {
    if (isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
      image: attachment,
    };

    const modelMessageId = `model_${Date.now()}`;
    const modelPlaceholder: ChatMessage = {
      id: modelMessageId,
      role: 'model',
      text: '',
      timestamp: Date.now(),
      isStreaming: true,
      modelUsed: currentModel,
    };

    const currentConv = activeConversation;
    const isFirst = currentConv.messages.length === 0;
    const newMessages = [...currentConv.messages, userMessage, modelPlaceholder];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: newMessages,
              updatedAt: Date.now(),
              title: isFirst ? text.slice(0, 28) : c.title,
            }
          : c
      )
    );

    if (isFirst) {
      generateTitle(activeId, text);
    }

    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let systemInstruction = 'You are Ask AI, an intelligent, helpful, concise, and elegant AI assistant modeled with utmost clarity and depth.';
    if (currentModel === 'hinglish-dost') {
      systemInstruction =
        'You are Ask AI in Hinglish Dost mode: a super friendly, witty, energetic Indian buddy who speaks in conversational natural Hinglish (Hindi written in English alphabets mixed with English). Be warm, fun, and provide brilliant answers with great clarity!';
    } else if (currentModel === 'gemini-flash-thinking') {
      systemInstruction =
        'You are Ask AI in Deep Reasoning mode: carefully analyze complex problems, provide step-by-step logic, code, and thorough solutions.';
    }

    try {
      const payloadMessages = [
        ...currentConv.messages.map((m) => ({
          role: m.role,
          text: m.text,
          image: m.image
            ? { mimeType: m.image.mimeType, data: m.image.data }
            : undefined,
        })),
        {
          role: 'user',
          text,
          image: attachment
            ? { mimeType: attachment.mimeType, data: attachment.data }
            : undefined,
        },
      ];

      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          systemInstruction,
          temperature: currentModel === 'hinglish-dost' ? 0.9 : 0.7,
          model: currentModel === 'gemini-flash-thinking' ? 'gemini-3.1-flash-lite' : 'gemini-3.1-flash-lite',
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      if (reader) {
        let buffer = '';
        let done = false;

        while (!done) {
          const { value, done: readDone } = await reader.read();
          done = readDone;
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                const data = trimmed.slice(6).trim();
                if (data === '[DONE]') {
                  done = true;
                  break;
                }
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.error) throw new Error(parsed.error);
                  if (parsed.text) {
                    accumulated += parsed.text;
                    setConversations((prev) =>
                      prev.map((c) => {
                        if (c.id !== activeId) return c;
                        return {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === modelMessageId
                              ? { ...m, text: accumulated }
                              : m
                          ),
                        };
                      })
                    );
                    scrollToBottom();
                  }
                } catch (e) {}
              }
            }
          }
        }
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === modelMessageId
                ? { ...m, text: accumulated, isStreaming: false }
                : m
            ),
          };
        })
      );
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === modelMessageId
                  ? {
                      ...m,
                      error: err.message || 'Something went wrong. Please try again.',
                      isStreaming: false,
                    }
                  : m
              ),
            };
          })
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden flex flex-col font-sans select-text bg-[#fcfbf9]">
      {/* Silky satin background with rose-gold ribbons */}
      <AksBackground />

      {/* Claude-style Navigation Drawer (Matching Screenshot 8) */}
      <ClaudeStyleDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        conversations={conversations.filter((c) => c.messages.length > 0)}
        activeConversationId={activeId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onNavigate={(view) => setActiveView(view)}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onTogglePin={handleTogglePin}
        onShareChat={() => setIsShareModalOpen(true)}
        userEmail={currentUser.email}
      />

      {/* Model Selector Modal */}
      <ModelSelectorModal
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        currentModel={currentModel}
        onSelectModel={(m) => setCurrentModel(m)}
      />

      {/* Share Chat Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        conversation={activeConversation}
      />

      {/* VIEW 0: AETHER AI Auth Screen */}
      {activeView === 'auth' && (
        <AuthScreen
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setActiveView('chat');
          }}
          onCancel={() => setActiveView('chat')}
        />
      )}

      {/* VIEW 1: Full Chats View (Matching Screenshots 5, 6, 7) */}
      {activeView === 'chats-list' && (
        <FullChatsView
          conversations={conversations.filter((c) => c.messages.length > 0)}
          activeConversationId={activeId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          onDeleteMultipleConversations={handleDeleteMultipleConversations}
          onRenameConversation={handleRenameConversation}
          onTogglePin={handleTogglePin}
          onBack={() => setActiveView('chat')}
        />
      )}

      {/* VIEW 2: Projects View (Matching Screenshot 4) */}
      {activeView === 'projects' && (
        <ProjectsView
          onBack={() => setActiveView('chat')}
          onNewChat={handleNewChat}
        />
      )}

      {/* VIEW 3: Settings View (Matching Screenshot 3) */}
      {activeView === 'settings' && (
        <SettingsView
          onBack={() => setActiveView('chat')}
          onNavigate={(view) => setActiveView(view)}
          onClearAllChats={handleClearAllChats}
          userEmail={currentUser.email}
        />
      )}

      {/* VIEW 4: Voice Settings View (Matching Screenshots 1 & 2) */}
      {activeView === 'voice-settings' && (
        <VoiceSettingsView
          onBack={() => setActiveView('settings')}
        />
      )}

      {/* VIEW 5: Main Chat Screen (With Screenshot 1 & 2 design + Top Bar & Bottom 3D input) */}
      {activeView === 'chat' && (
        <>
          {/* Top Header Bar - ALWAYS FIXED AT TOP */}
          <div className="shrink-0 w-full z-20">
            <AksTopBar
              onOpenDrawer={() => setIsDrawerOpen(true)}
              onOpenShare={() => setIsShareModalOpen(true)}
              currentModel={currentModel}
            />
          </div>

          {/* Central Chat Feed Area - ONLY this area scrolls */}
          <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain z-10 flex flex-col relative px-2 md:px-4 py-2">
            {activeConversation.messages.length === 0 ? (
              <AksWelcomeView onSelectPrompt={(p) => handleSendMessage(p)} />
            ) : (
              <div className="flex-1 max-w-3xl mx-auto w-full pb-4">
                {activeConversation.messages.map((msg) => (
                  <ChatMessageView
                    key={msg.id}
                    message={msg}
                    onRetry={handleRetryLastMessage}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>

          {/* Bottom Floating Bar - ALWAYS PINNED AT BOTTOM:
              [Red '+' button with speed-dial]  --  [3D 'Type Your Question' Box]  --  [Telegram Send Button] */}
          <footer className="shrink-0 w-full z-20 pb-safe bg-gradient-to-t from-white/95 via-white/70 to-transparent backdrop-blur-[2px]">
            <AksInputBar
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              onStopGeneration={handleStopGeneration}
              onOpenModelSelector={() => setIsModelSelectorOpen(true)}
              currentModel={currentModel}
            />
          </footer>
        </>
      )}
    </div>
  );
}
