import React, { useState, useRef, useEffect } from 'react';
import { TelegramSendIcon } from './TelegramSendIcon.tsx';
import { ActionSpeedDial } from './ActionSpeedDial.tsx';
import { ChatImage, AIModelType } from '../types.ts';
import { X, Mic, MicOff, Video, FileText } from 'lucide-react';

interface AksInputBarProps {
  onSendMessage: (text: string, attachment?: ChatImage) => void;
  isStreaming: boolean;
  onStopGeneration: () => void;
  onOpenModelSelector: () => void;
  currentModel: AIModelType;
}

export const AksInputBar: React.FC<AksInputBarProps> = ({
  onSendMessage,
  isStreaming,
  onStopGeneration,
  onOpenModelSelector,
  currentModel,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState<ChatImage | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea as text grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleSend = () => {
    if (isStreaming) {
      onStopGeneration();
      return;
    }

    const trimmed = inputText.trim();
    if (!trimmed && !attachment) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onSendMessage(trimmed, attachment || undefined);
    setInputText('');
    setAttachment(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice typing / dictation
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pb-1 pt-1">
      {/* Attached file chip preview if any */}
      {attachment && (
        <div className="mb-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-md inline-flex items-center gap-2 max-w-md animate-fade-in">
          {attachment.type === 'photo' ? (
            <img
              src={attachment.data}
              alt="attachment"
              className="w-8 h-8 object-cover rounded-lg border border-stone-200"
            />
          ) : attachment.type === 'video' ? (
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-stone-800 truncate">
              {attachment.name || 'Attached file'}
            </div>
            <div className="text-[9px] text-stone-500 uppercase">{attachment.type}</div>
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main 3-Button Row matching the annotated screenshot:
          [Red '+' Button]  --  [3D 'Type Your Question' Box]  --  [Telegram Send Button] */}
      <div className="flex items-end gap-2 sm:gap-3">
        {/* 1. LEFT: RED Circular '+' Button with Speed Dial */}
        <div className="shrink-0 mb-0.5">
          <ActionSpeedDial
            onAttachFile={(file) => setAttachment(file)}
            onOpenModelSelector={onOpenModelSelector}
            currentModel={currentModel}
          />
        </div>

        {/* 2. CENTER: 3D 'Type Your Question' Input Box */}
        <div
          className={`flex-1 relative rounded-2xl sm:rounded-3xl transition-all duration-200 ${
            isFocused
              ? 'shadow-[0_10px_25px_rgba(180,140,110,0.22),0_2px_8px_rgba(0,0,0,0.06)] bg-white ring-2 ring-[#d89f68]/70 border-transparent'
              : 'shadow-[0_4px_16px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.03)] bg-white/95 border border-stone-200/90'
          }`}
        >
          {/* 3D top-bevel gloss line */}
          <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none rounded-t-3xl" />

          <div className="flex items-center px-3 sm:px-4 py-1.5 min-h-[46px] sm:min-h-[50px]">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              rows={1}
              placeholder={
                isListening
                  ? 'Aapki awaaz sun raha hoon...'
                  : 'Type Your Question...'
              }
              className="flex-1 bg-transparent text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm md:text-base outline-none resize-none leading-relaxed py-1 min-h-[32px] max-h-[120px]"
            />

            {/* Voice Dictation Mic Button inside 3D input box */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1.5 rounded-lg transition-all shrink-0 cursor-pointer ml-1 ${
                isListening
                  ? 'text-red-500 bg-red-50 animate-pulse'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100/80'
              }`}
              title={isListening ? 'Stop listening' : 'Voice typing'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 3. RIGHT: TELEGRAM-STYLE MESSAGE SEND BUTTON */}
        <div className="shrink-0 mb-0.5">
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() && !attachment && !isStreaming}
            className={`w-11 h-11 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer relative group focus:outline-none focus:ring-4 focus:ring-[#2AABEE]/30 active:scale-95 ${
              inputText.trim() || attachment || isStreaming
                ? 'bg-gradient-to-tr from-[#229ED9] via-[#2AABEE] to-[#3ab9fc] text-white shadow-[0_4px_16px_rgba(34,158,217,0.42)] hover:shadow-[0_6px_22px_rgba(34,158,217,0.55)] active:scale-95'
                : 'bg-stone-200/90 text-stone-400 shadow-xs cursor-not-allowed'
            }`}
            title={isStreaming ? 'Stop generation' : 'Send message (Telegram style)'}
          >
            {/* 3D highlight rim */}
            <div className="absolute inset-0 rounded-full border border-white/30 pointer-events-none" />

            {isStreaming ? (
              <span className="w-3.5 h-3.5 rounded-xs bg-white animate-pulse" />
            ) : (
              <div className="transform -translate-x-0.5 translate-y-0.5 group-hover:scale-105 group-hover:rotate-6 transition-transform">
                <TelegramSendIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
