import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Play, Volume2 } from 'lucide-react';

interface VoiceSettingsViewProps {
  onBack: () => void;
}

export const VoiceSettingsView: React.FC<VoiceSettingsViewProps> = ({ onBack }) => {
  const voices = [
    { name: 'Buttery', desc: 'Smooth, warm, and natural' },
    { name: 'Airy', desc: 'Light, clear, and calm' },
    { name: 'Mellow', desc: 'Gentle and reassuring' },
    { name: 'Crisp', desc: 'Energetic and focused' },
    { name: 'Dost', desc: 'Friendly and conversational' },
  ];

  const [activeIdx, setActiveIdx] = useState(1); // Default "Airy" matching screenshot 1
  const [language, setLanguage] = useState('English (India)');
  const [pace, setPace] = useState('Normal');

  const handleTestVoice = (voiceName: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `Hello! This is ${voiceName} voice in Ask AI. How can I help you today?`
      );
      utter.rate = pace === 'Fast' ? 1.2 : pace === 'Slow' ? 0.8 : 1.0;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#fbf9f4] overflow-y-auto select-none">
      {/* Top Header matching Screenshots 1 & 2 */}
      <header className="shrink-0 h-14 border-b border-[#ece7dc] px-4 flex items-center justify-between bg-[#fbf9f4]/95 backdrop-blur-md z-20">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-xl text-[#3d382f] hover:bg-[#efe9dd] transition-colors cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <h1 className="text-lg font-serif font-semibold text-[#1e1c18]">
          Voice settings
        </h1>
        <div className="w-8" />
      </header>

      {/* Main Voice Selector Carousel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-sm mx-auto w-full">
        {/* Horizontal Card Swiper */}
        <div className="w-full flex items-center justify-center gap-3 overflow-hidden py-6">
          {/* Previous peek */}
          <div
            onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : voices.length - 1))}
            className="w-16 h-36 rounded-3xl bg-white/70 border border-[#e5dfd2] opacity-40 shrink-0 cursor-pointer flex items-center justify-center text-xs font-medium text-[#7d7563]"
          >
            {voices[(activeIdx - 1 + voices.length) % voices.length].name}
          </div>

          {/* Active Center Card (Matching Screenshot 1 & 2) */}
          <div
            onClick={() => handleTestVoice(voices[activeIdx].name)}
            className="w-52 h-52 rounded-3xl bg-white border border-[#e8dfcf] shadow-[0_12px_32px_rgba(217,107,67,0.12),0_4px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 group relative"
          >
            <span className="text-xl font-medium text-[#1e1c18] mb-1">
              {voices[activeIdx].name}
            </span>
            <span className="text-[11px] text-[#8c8574]">
              {voices[activeIdx].desc}
            </span>

            <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4eee4] text-[#1e1c18] text-xs font-semibold group-hover:bg-[#d96b43] group-hover:text-white transition-colors">
              <Play className="w-3 h-3 fill-current" />
              <span>Tap to preview</span>
            </div>
          </div>

          {/* Next peek */}
          <div
            onClick={() => setActiveIdx((prev) => (prev + 1) % voices.length)}
            className="w-16 h-36 rounded-3xl bg-white/70 border border-[#e5dfd2] opacity-40 shrink-0 cursor-pointer flex items-center justify-center text-xs font-medium text-[#7d7563]"
          >
            {voices[(activeIdx + 1) % voices.length].name}
          </div>
        </div>

        {/* Carousel Dots indicator matching Screenshots 1 & 2 */}
        <div className="flex items-center gap-2 mb-8">
          {voices.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                i === activeIdx ? 'bg-[#1e1c18] scale-125' : 'bg-[#c5bfae]'
              }`}
            />
          ))}
        </div>

        {/* Setting options below matching Screenshots 1 & 2 */}
        <div className="w-full space-y-2.5">
          {/* Language option with BETA badge */}
          <div
            onClick={() => {
              const langs = ['English (India)', 'Hinglish (India)', 'English (US)', 'Hindi (India)'];
              const next = langs[(langs.indexOf(language) + 1) % langs.length];
              setLanguage(next);
            }}
            className="w-full bg-white p-3.5 rounded-2xl border border-[#ece7dc] flex items-center justify-between shadow-xs cursor-pointer active:bg-[#f6f2e9]"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#1e1c18] font-normal">Language</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#ede8dc] text-[#5c5545] text-[10px] font-bold tracking-wider">
                BETA
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5c5545]">
              <span>{language}</span>
              <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
            </div>
          </div>

          {/* Pace option */}
          <div
            onClick={() => {
              const paces = ['Slow', 'Normal', 'Fast'];
              const next = paces[(paces.indexOf(pace) + 1) % paces.length];
              setPace(next);
            }}
            className="w-full bg-white p-3.5 rounded-2xl border border-[#ece7dc] flex items-center justify-between shadow-xs cursor-pointer active:bg-[#f6f2e9]"
          >
            <span className="text-sm text-[#1e1c18] font-normal">Pace</span>
            <div className="flex items-center gap-1.5 text-xs text-[#5c5545]">
              <span>{pace}</span>
              <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
