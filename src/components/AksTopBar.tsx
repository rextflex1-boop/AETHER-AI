import React from 'react';
import { Menu, Share2, Sparkles } from 'lucide-react';
import { AIModelType } from '../types.ts';

interface AksTopBarProps {
  onOpenDrawer: () => void;
  onOpenShare: () => void;
  currentModel: AIModelType;
}

export const AksTopBar: React.FC<AksTopBarProps> = ({
  onOpenDrawer,
  onOpenShare,
  currentModel,
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-md border-b border-stone-200/50 select-none">
      {/* 1. LEFT: 'Chats' Hamburger Button (as marked in screenshot) */}
      <button
        type="button"
        onClick={onOpenDrawer}
        className="flex flex-col items-center justify-center p-1.5 -ml-1 rounded-2xl text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95 transition-all cursor-pointer group"
        title="Open Chats Drawer"
      >
        <div className="space-y-1 py-1">
          {/* 3 horizontal lines like the hand-drawn icon in user screenshot */}
          <span className="block w-6 h-[2.5px] bg-stone-800 rounded-full transition-transform group-hover:w-7" />
          <span className="block w-4 h-[2.5px] bg-stone-800 rounded-full transition-transform group-hover:w-6" />
          <span className="block w-5 h-[2.5px] bg-stone-800 rounded-full transition-transform group-hover:w-7" />
        </div>
        <span className="text-[10px] font-bold tracking-tight text-stone-600 group-hover:text-stone-900 mt-0.5">
          Chats
        </span>
      </button>

      {/* 2. CENTER: 'Ai ka Name' (AETHER AI) */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-stone-900 via-[#b87a46] to-stone-900 bg-clip-text text-transparent">
            AETHER AI
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <span className="text-[10px] font-semibold text-[#b87a46] tracking-wider uppercase">
          {currentModel === 'hinglish-dost' ? 'Dost Mode' : 'Smart Assistant'}
        </span>
      </div>

      {/* 3. RIGHT: 'Share Chat' Button (as marked in screenshot) */}
      <button
        type="button"
        onClick={onOpenShare}
        className="flex flex-col items-center justify-center p-1.5 -mr-1 rounded-2xl text-stone-700 hover:text-stone-900 hover:bg-stone-100/80 active:scale-95 transition-all cursor-pointer group"
        title="Share Chat"
      >
        <div className="p-1 rounded-xl bg-stone-100/80 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
          <Share2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[10px] font-bold tracking-tight text-stone-600 group-hover:text-stone-900 mt-0.5">
          Share Chat
        </span>
      </button>
    </header>
  );
};
