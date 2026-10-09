import React from 'react';
import {
  ArrowLeft,
  Info,
  User,
  CreditCard,
  Sliders,
  Layers,
  Shield,
  Moon,
  Mic,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { AppView } from '../types.ts';

interface SettingsViewProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
  onClearAllChats: () => void;
  userEmail?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onNavigate,
  onClearAllChats,
  userEmail = 'pubgxmobile2867@gmail.com',
}) => {
  return (
    <div className="flex-1 flex flex-col h-full w-full bg-[#fcfbf9] overflow-y-auto select-none">
      {/* Top Header matching Screenshot 3 */}
      <header className="shrink-0 h-14 border-b border-[#ece7dc] px-4 flex items-center justify-between bg-[#fcfbf9]/95 backdrop-blur-md z-20">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-xl text-[#3d382f] hover:bg-[#efe9dd] transition-colors cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <h1 className="text-lg font-serif font-semibold text-[#1e1c18]">
          Settings
        </h1>
        <button
          type="button"
          className="p-1.5 -mr-1.5 rounded-xl text-[#3d382f] hover:bg-[#efe9dd] transition-colors cursor-pointer"
          title="Info"
        >
          <Info className="w-5 h-5 stroke-[1.8]" />
        </button>
      </header>

      {/* Settings Content Area matching Screenshot 3 */}
      <div className="p-4 max-w-lg mx-auto w-full space-y-3.5 pb-10">
        {/* User Account Card */}
        <div
          onClick={() => onNavigate('auth')}
          className="bg-white p-3.5 rounded-2xl border border-[#ece7dc] hover:border-[#d89f68] transition-all flex items-center justify-between shadow-xs cursor-pointer group"
          title="Switch Account or Login"
        >
          <div className="flex items-center gap-3 truncate pr-2">
            <div className="w-8 h-8 rounded-full bg-[#d96b43] text-white font-semibold text-xs flex items-center justify-center shrink-0">
              {userEmail.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate text-left">
              <span className="text-xs sm:text-sm font-semibold text-[#1e1c18] group-hover:text-[#b87a46] block truncate transition-colors">
                {userEmail}
              </span>
              <span className="text-[10px] text-stone-500">Tap to switch or sign in</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#1e1b18] text-white text-[11px] font-bold">
              Free
            </span>
            <ChevronRight className="w-4 h-4 text-[#a39c8e] group-hover:text-[#1e1c18] transition-colors" />
          </div>
        </div>

        {/* Upgrade Banner Card matching Screenshot 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#ece7dc] shadow-xs space-y-2.5">
          <h2 className="text-base font-bold text-[#1e1c18]">
            Want more Ask AI?
          </h2>
          <p className="text-xs sm:text-sm text-[#5d5648] leading-relaxed">
            Upgrade for more usage and capabilities.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => alert('Ask AI Pro upgrade is free in this build!')}
              className="px-5 py-2.5 rounded-full bg-[#1e1b18] hover:bg-black text-white text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* Setting Items Group 1 */}
        <div className="bg-white rounded-2xl border border-[#ece7dc] divide-y divide-[#f2eee6] overflow-hidden shadow-xs">
          <div className="flex items-center justify-between p-3.5 hover:bg-[#faf8f4] cursor-pointer">
            <div className="flex items-center gap-3 text-sm text-[#24211a]">
              <User className="w-4.5 h-4.5 text-[#6c6659]" />
              <span>Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
          </div>

          <div className="flex items-center justify-between p-3.5 hover:bg-[#faf8f4] cursor-pointer">
            <div className="flex items-center gap-3 text-sm text-[#24211a]">
              <CreditCard className="w-4.5 h-4.5 text-[#6c6659]" />
              <span>Billing</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
          </div>
        </div>

        {/* Setting Items Group 2 */}
        <div className="bg-white rounded-2xl border border-[#ece7dc] divide-y divide-[#f2eee6] overflow-hidden shadow-xs">
          <div className="flex items-center justify-between p-3.5 hover:bg-[#faf8f4] cursor-pointer">
            <div className="flex items-center gap-3 text-sm text-[#24211a]">
              <Sliders className="w-4.5 h-4.5 text-[#6c6659]" />
              <div>
                <div className="font-normal">Capabilities</div>
                <div className="text-[11px] text-[#787163]">5 enabled</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
          </div>

          <div className="flex items-center justify-between p-3.5 hover:bg-[#faf8f4] cursor-pointer">
            <div className="flex items-center gap-3 text-sm text-[#24211a]">
              <Layers className="w-4.5 h-4.5 text-[#6c6659]" />
              <div>
                <div className="font-normal">Connectors</div>
                <div className="text-[11px] text-[#787163]">1 connected</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
          </div>

          <div className="flex items-center justify-between p-3.5 hover:bg-[#faf8f4] cursor-pointer">
            <div className="flex items-center gap-3 text-sm text-[#24211a]">
              <Shield className="w-4.5 h-4.5 text-[#6c6659]" />
              <span>Permissions</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
          </div>
        </div>

        {/* Setting Items Group 3: Voice & Clear */}
        <div className="bg-white rounded-2xl border border-[#ece7dc] divide-y divide-[#f2eee6] overflow-hidden shadow-xs">
          {/* Voice settings (links to Screenshot 1 & 2) */}
          <div
            onClick={() => onNavigate('voice-settings')}
            className="flex items-center justify-between p-3.5 hover:bg-[#faf8f4] cursor-pointer"
          >
            <div className="flex items-center gap-3 text-sm text-[#24211a]">
              <Mic className="w-4.5 h-4.5 text-[#6c6659]" />
              <div>
                <div className="font-normal">Voice settings</div>
                <div className="text-[11px] text-[#787163]">Airy, Buttery & pace</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
          </div>

          <div className="flex items-center justify-between p-3.5 hover:bg-[#faf8f4] cursor-pointer">
            <div className="flex items-center gap-3 text-sm text-[#24211a]">
              <Moon className="w-4.5 h-4.5 text-[#6c6659]" />
              <div>
                <div className="font-normal">Color mode</div>
                <div className="text-[11px] text-[#787163]">System</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a39c8e]" />
          </div>

          {/* Clear history */}
          <div
            onClick={() => {
              if (window.confirm('Delete all conversations permanently?')) {
                onClearAllChats();
              }
            }}
            className="flex items-center justify-between p-3.5 hover:bg-red-50 text-red-600 cursor-pointer"
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              <Trash2 className="w-4.5 h-4.5" />
              <span>Clear all chat history</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
