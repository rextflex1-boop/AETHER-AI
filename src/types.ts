export interface ChatImage {
  data: string; // base64 string
  mimeType: string;
  name?: string;
  type?: 'photo' | 'video' | 'file';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: ChatImage;
  isStreaming?: boolean;
  error?: string;
  modelUsed?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  model?: string;
  isPinned?: boolean;
}

export type AIModelType = 'gemini-3.1-flash-lite' | 'gemini-flash-thinking' | 'hinglish-dost';

export interface AuthUser {
  email: string;
  name?: string;
  avatarUrl?: string;
  isGuest?: boolean;
}

export type AppView = 'chat' | 'chats-list' | 'projects' | 'settings' | 'voice-settings' | 'auth';
