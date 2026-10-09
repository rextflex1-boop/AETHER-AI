import React, { useState, useRef } from 'react';
import {
  Plus,
  Image as ImageIcon,
  Video,
  FileText,
  SlidersHorizontal,
  X,
  AlertCircle,
} from 'lucide-react';
import { ChatImage, AIModelType } from '../types.ts';

interface ActionSpeedDialProps {
  onAttachFile: (file: ChatImage) => void;
  onOpenModelSelector: () => void;
  currentModel: AIModelType;
}

export const ActionSpeedDial: React.FC<ActionSpeedDialProps> = ({
  onAttachFile,
  onOpenModelSelector,
  currentModel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zipWarning, setZipWarning] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (e: React.ChangeEvent<HTMLInputElement>, fileCategory: 'photo' | 'video' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check for ZIP file restriction explicitly requested by user
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.zip') || fileName.endsWith('.tar') || fileName.endsWith('.rar') || fileName.endsWith('.7z')) {
      setZipWarning(true);
      setTimeout(() => setZipWarning(false), 4500);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      onAttachFile({
        data,
        mimeType: file.type || 'application/octet-stream',
        name: file.name,
        type: fileCategory,
      });
      setIsOpen(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="relative select-none">
      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileProcess(e, 'photo')}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileProcess(e, 'video')}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.txt,.doc,.docx,.csv,.json,.md"
        className="hidden"
        onChange={(e) => handleFileProcess(e, 'file')}
      />

      {/* Backdrop when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Animated Pop-up Menu */}
      <div
        className={`absolute bottom-16 left-0 z-40 w-64 p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.18)] transition-all duration-300 transform origin-bottom-left ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-3 pointer-events-none'
        }`}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 pb-2 mb-1 border-b border-stone-150 flex items-center justify-between">
          <span>Attach & Settings</span>
          <span className="text-[10px] text-red-600 font-semibold lowercase">
            no zip support
          </span>
        </div>

        <div className="space-y-1">
          {/* Photo option */}
          <button
            type="button"
            onClick={() => {
              photoInputRef.current?.click();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-100/90 active:bg-stone-200 text-stone-800 transition-all text-left text-sm font-medium group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs text-stone-900">Add Photo</div>
              <div className="text-[10px] text-stone-500">Camera / Gallery pictures</div>
            </div>
          </button>

          {/* Video option */}
          <button
            type="button"
            onClick={() => {
              videoInputRef.current?.click();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-100/90 active:bg-stone-200 text-stone-800 transition-all text-left text-sm font-medium group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs text-stone-900">Add Video</div>
              <div className="text-[10px] text-stone-500">Short video clips</div>
            </div>
          </button>

          {/* File option */}
          <button
            type="button"
            onClick={() => {
              docInputRef.current?.click();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-100/90 active:bg-stone-200 text-stone-800 transition-all text-left text-sm font-medium group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs text-stone-900">Add Document</div>
              <div className="text-[10px] text-stone-500">PDF, TXT, DOC files</div>
            </div>
          </button>

          {/* Model Selector option (highlighted in screenshot as 'model Selector') */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenModelSelector();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-100/90 active:bg-stone-200 text-stone-800 transition-all text-left text-sm font-medium group cursor-pointer border-t border-stone-150 pt-2"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-xs text-stone-900">Model Selector</div>
              <div className="text-[10px] text-rose-600 font-medium">
                {currentModel === 'gemini-3.1-flash-lite'
                  ? 'Gemini 3.1 Flash Lite'
                  : currentModel === 'hinglish-dost'
                  ? 'Hinglish Dost Mode'
                  : 'Deep Thinker'}
              </div>
            </div>
          </button>
        </div>

        {/* User requested reminder pill */}
        <div className="mt-2 p-2 rounded-lg bg-red-50/80 border border-red-200/60 text-[10px] text-red-700 flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
          <span>ZIP files are not supported (+ button)</span>
        </div>
      </div>

      {/* Zip error notification toast */}
      {zipWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4 text-white" />
          <span>ZIP file support nahi karta bhai! Photo ya Document upload karo.</span>
        </div>
      )}

      {/* The Iconic RED circular button with WHITE '+' icon (As requested) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full bg-red-600 hover:bg-red-500 active:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(220,38,38,0.42)] hover:shadow-[0_8px_24px_rgba(220,38,38,0.52)] transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-4 focus:ring-red-400/40"
        title="Add files & Model Selector"
      >
        {/* Subtle 3D inner rim highlight */}
        <div className="absolute inset-0 rounded-full border border-white/30 pointer-events-none" />

        {/* White '+' that smoothly rotates to an 'x' when opened */}
        <Plus
          className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white stroke-[2.8] transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-45' : 'rotate-0 group-hover:rotate-90'
          }`}
        />
      </button>
    </div>
  );
};
