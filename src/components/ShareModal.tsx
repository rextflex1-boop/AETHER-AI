import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download, FileText } from 'lucide-react';
import { Conversation } from '../types.ts';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  conversation,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyTranscript = async () => {
    let text = `--- Aks AI Conversation: ${conversation.title} ---\n\n`;
    conversation.messages.forEach((m) => {
      text += `[${m.role === 'user' ? 'You' : 'Aks AI'}]:\n${m.text}\n\n`;
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownloadMarkdown = () => {
    let md = `# ${conversation.title}\n*Saved from Aks AI on ${new Date().toLocaleDateString()}*\n\n---\n\n`;
    conversation.messages.forEach((m) => {
      md += `### ${m.role === 'user' ? 'User' : 'Aks AI'}\n\n${m.text}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_') || 'chat'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-150">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-base text-stone-900">Share Chat</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-stone-600">
            Share "<span className="font-semibold text-stone-900">{conversation.title}</span>" transcript or export to file.
          </p>

          <button
            type="button"
            onClick={handleCopyTranscript}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-xs transition-all cursor-pointer border border-stone-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-600" />
                <span>Copy Full Transcript</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs shadow-md shadow-red-500/25 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Markdown (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
