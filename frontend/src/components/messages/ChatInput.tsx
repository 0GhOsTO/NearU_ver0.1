'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 border-t border-nu-border/60 bg-nu-bg px-4 py-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 rounded-full border border-nu-border bg-nu-elevated px-4 py-2.5 text-sm text-nu-text placeholder-nu-dim focus:border-nu-blue/50 focus:outline-none focus:ring-2 focus:ring-nu-blue/15 transition-all"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="rounded-full bg-nu-blue p-2.5 text-white hover:bg-nu-blue-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
