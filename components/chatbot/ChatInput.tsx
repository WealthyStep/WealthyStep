import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="flex-1 relative flex items-end w-full">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        className="w-full max-h-[120px] min-h-[40px] bg-white border border-gray-200 rounded-[20px] py-[10px] pl-4 pr-12 text-[12px] sm:text-[13px] text-navy focus:outline-none focus:border-[#82C341] resize-none disabled:opacity-50 shadow-sm transition-all placeholder:text-gray-400"
        rows={1}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || disabled}
        className="absolute right-1 bottom-1 w-[32px] h-[32px] rounded-full bg-[#0B052B] text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:bg-slate-300 hover:bg-[#150a50] transition-all active:scale-90 shadow-sm"
        aria-label="Send message"
      >
        <Send size={14} className={input.trim() ? "translate-x-px -translate-y-px transition-transform" : "transition-transform"} />
      </button>
    </div>
  );
};
