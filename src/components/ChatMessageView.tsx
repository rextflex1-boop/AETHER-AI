import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, AlertCircle, RotateCcw } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { marked } from 'marked';

interface ChatMessageViewProps {
  message: ChatMessage;
  onRetry?: () => void;
}

export const ChatMessageView: React.FC<ChatMessageViewProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleToggleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const clean = message.text.replace(/```[\s\S]*?```/g, 'Code omitted.').replace(/[#*_`]/g, '');
      const utter = new SpeechSynthesisUtterance(clean);
      utter.rate = 1.0;
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
      setIsSpeaking(true);
    }
  };

  return (
    <div className={`py-2 px-2 md:px-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[88%] md:max-w-[78%] rounded-3xl p-3.5 sm:p-4 shadow-sm transition-all ${
          isUser
            ? 'bg-gradient-to-tr from-stone-900 to-stone-850 text-white rounded-br-sm shadow-md'
            : 'bg-white/95 backdrop-blur-md border border-stone-200/90 text-stone-900 rounded-bl-sm shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
        }`}
      >
        {/* Attachment preview if user uploaded one */}
        {message.image && (
          <div className="mb-2.5">
            {message.image.type === 'photo' ? (
              <img
                src={message.image.data}
                alt={message.image.name || 'Uploaded picture'}
                className="max-h-60 rounded-2xl object-cover border border-stone-200 shadow-sm"
              />
            ) : (
              <div className="p-3 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700">
                📎 {message.image.name || 'Attached media'}
              </div>
            )}
          </div>
        )}

        {/* Text / Markdown */}
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed">
            {message.text}
          </p>
        ) : (
          <div>
            {message.error ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-red-600 text-xs sm:text-[13px] leading-relaxed bg-red-50/70 p-2.5 rounded-xl border border-red-200/80">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <div className="flex-1">
                    <span className="font-semibold block mb-0.5">High Demand Spike:</span>
                    <span>{message.error}</span>
                  </div>
                </div>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-medium cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try again (Retry)</span>
                  </button>
                )}
              </div>
            ) : (
              <div
                className="prose prose-stone max-w-none text-sm md:text-[15px] leading-relaxed select-text"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(message.text || '', { breaks: true, gfm: true }) as string,
                }}
              />
            )}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-red-600 ml-1 animate-pulse rounded-xs" />
            )}
          </div>
        )}

        {/* Timestamp and toolbar */}
        <div
          className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[11px] ${
            isUser ? 'border-white/10 text-stone-400' : 'border-stone-100 text-stone-400'
          }`}
        >
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {!isUser && !message.isStreaming && !message.error && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 hover:text-stone-700 transition-colors cursor-pointer"
                title="Copy text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleToggleSpeak}
                className={`p-1 hover:text-stone-700 transition-colors cursor-pointer ${
                  isSpeaking ? 'text-red-600' : ''
                }`}
                title="Read aloud"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
