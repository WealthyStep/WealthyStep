import React from 'react';
import { TrendingUp, ShieldCheck, Globe, Calculator, Headset, ChevronRight } from 'lucide-react';

interface QuickRepliesProps {
  replies: string[];
  onClick: (reply: string) => void;
  isWelcomeScreen?: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onClick, isWelcomeScreen = false }) => {
  if (!replies || replies.length === 0) return null;

  const getIconForReply = (text: string, iconSize: number = 20) => {
    text = text.toLowerCase();
    if (text.includes('fund')) return <TrendingUp size={iconSize} className="text-lime" />;
    if (text.includes('insurance')) return <ShieldCheck size={iconSize} className="text-[#3b82f6]" />;
    if (text.includes('nri') || text.includes('globe')) return <Globe size={iconSize} className="text-[#8b5cf6]" />;
    if (text.includes('calc')) return <Calculator size={iconSize} className="text-[#f97316]" />;
    if (text.includes('contact') || text.includes('team')) return <Headset size={iconSize} className="text-[#ef4444]" />;
    return <ChevronRight size={iconSize} className="text-gray-400" />;
  };

  if (isWelcomeScreen) {
    return (
      <div className="flex flex-col mt-2 w-full max-w-[300px]">
        <div className="flex flex-wrap gap-2 w-full">
          {replies.map((reply, idx) => {
            return (
              <button
                key={idx}
                onClick={() => onClick(reply)}
                className="flex items-center justify-start gap-2 px-3 py-2 bg-white border border-gray-200 shadow-sm rounded-xl hover:border-lime hover:shadow-md transition-all active:scale-95 shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  {getIconForReply(reply, 12)}
                </div>
                <span className="text-[11px] font-bold text-navy whitespace-nowrap">
                  {reply}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 mb-1">
          <div className="flex-1 h-px bg-gray-100"></div>
          <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Or type below</span>
          <div className="flex-1 h-px bg-gray-100"></div>
        </div>
      </div>
    );
  }

  // Standard Pill Layout
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {replies.map((reply, idx) => (
        <button
          key={idx}
          onClick={() => onClick(reply)}
          className="text-[12px] bg-white text-lime border border-lime px-3 py-1.5 rounded-full hover:bg-lime hover:text-white transition-all shadow-sm font-semibold text-left"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};
