import React from 'react';
import { X, Check, Zap, Sparkles, Brain } from 'lucide-react';
import { AIModelType } from '../types.ts';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: AIModelType;
  onSelectModel: (model: AIModelType) => void;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onSelectModel,
}) => {
  if (!isOpen) return null;

  const models: {
    id: AIModelType;
    name: string;
    tagline: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash Lite',
      tagline: 'Ultra Fast & High Availability',
      description: 'Lightning fast responses with zero wait time and high throughput.',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      color: 'border-amber-200 bg-amber-50/50',
    },
    {
      id: 'hinglish-dost',
      name: 'Hinglish Dost Mode',
      tagline: 'Bindaas Desi Buddy',
      description: 'Chats in fun, warm Hinglish (Hindi + English) with great humor and high intellect.',
      icon: <Sparkles className="w-5 h-5 text-red-500" />,
      color: 'border-red-200 bg-red-50/50',
    },
    {
      id: 'gemini-flash-thinking',
      name: 'Deep Thinker & Coder',
      tagline: 'Deep Reasoning',
      description: 'Focused on complex logic, detailed step-by-step math, and software architecture.',
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      color: 'border-purple-200 bg-purple-50/50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-150">
          <div>
            <h3 className="font-bold text-base text-stone-900">Select AI Model</h3>
            <p className="text-xs text-stone-500">Pick your preferred response style</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 py-4">
          {models.map((m) => {
            const isSelected = m.id === currentModel;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onSelectModel(m.id);
                  onClose();
                }}
                className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-500 bg-red-50/40 ring-2 ring-red-400/20'
                    : 'border-stone-200/90 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">{m.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">{m.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="text-[11px] font-semibold text-stone-500 mt-0.5">{m.tagline}</div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{m.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
