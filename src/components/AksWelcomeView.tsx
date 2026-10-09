import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AksWelcomeViewProps {
  onSelectPrompt: (prompt: string) => void;
}

export const AksWelcomeView: React.FC<AksWelcomeViewProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    { title: 'UI Design Ideas', prompt: 'Bhai ek mast website ka UI structure explain karo' },
    { title: 'Quantum Computing', prompt: 'Explain Quantum Computing in simple Hinglish with examples' },
    { title: 'Creative Launch Copy', prompt: 'Write a creative product launch announcement in Hinglish' },
    { title: 'Python Data Script', prompt: 'Python script to analyze data and plot charts' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-2 max-w-md mx-auto w-full select-none text-center my-auto">
      {/* Compact luxury emblem matching AETHER AI */}
      <div className="relative mb-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d89f68] via-[#f7d4b2] to-[#b87a46] p-[2px] shadow-lg shadow-[#d89f68]/20 inline-block">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <span className="text-base font-black bg-gradient-to-tr from-stone-900 via-[#b87a46] to-stone-900 bg-clip-text text-transparent">
              AETHER
            </span>
          </div>
        </div>
      </div>

      <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight mb-1">
        AETHER AI me aapka swagat hai ✨
      </h1>
      <p className="text-[11px] md:text-xs text-stone-500 max-w-xs mx-auto mb-4 leading-relaxed">
        Neeche diye gaye box me sawaal likhein ya + button se photo attach karein.
      </p>

      {/* Compact 2x2 grid so everything fits without scrolling on any phone! */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group flex flex-col justify-between p-2.5 rounded-xl bg-white/90 hover:bg-white border border-stone-200/90 hover:border-[#d89f68]/80 shadow-xs hover:shadow-md transition-all text-left cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[11px] font-bold text-stone-900 group-hover:text-red-600 transition-colors truncate">
                {item.title}
              </span>
              <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-red-600 shrink-0 ml-1" />
            </div>
            <p className="text-[10px] text-stone-500 line-clamp-2 leading-tight">
              {item.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
