import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '@/lib/chatbot/types';
import { Bot, User } from 'lucide-react';
import { QuickReplies } from './QuickReplies';
import { LeadFormFlow } from './LeadFormFlow';

interface ChatMessagesProps {
  messages: ChatMessage[];
  onQuickReplyClick: (reply: string) => void;
  isTyping: boolean;
  onLeadSuccess: () => void;
  onLeadCancel: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  onQuickReplyClick, 
  isTyping,
  onLeadSuccess,
  onLeadCancel
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll if there are multiple messages (not just welcome) or if typing
    if (messages.length > 1 || isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} aria-live="polite">
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
      <div className="flex flex-col gap-4 pb-2">
      {messages.map((msg) => {
        if (msg.isLeadFlow) {
          return (
            <div key={msg.id} className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <LeadFormFlow onSuccess={onLeadSuccess} onCancel={onLeadCancel} />
            </div>
          );
        }

        const isBot = msg.role === 'bot' || msg.role === 'system';
        const isWelcome = isBot && msg.id === messages[0].id;
        
        // Simple time format (e.g. 10:30 AM)
        const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <div key={msg.id} className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[88%] gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              
              {isBot && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm mt-1 border border-gray-100 overflow-hidden">
                   <img src="/icon.png" alt="Bot" className="w-full h-full object-contain p-1" />
                </div>
              )}

                <div className="flex flex-col gap-2 w-full max-w-full">
                  <div 
                    className={`px-3.5 py-2.5 text-[12px] leading-relaxed whitespace-pre-wrap shadow-sm relative pb-5 ${
                      isBot 
                        ? 'bg-white text-[#0B052B] rounded-2xl rounded-tl-sm' 
                        : 'bg-[#0B052B] text-white rounded-2xl rounded-tr-sm'
                    }`}
                  >
                    {msg.content}
                    <span className={`absolute bottom-1 right-2.5 text-[8px] font-medium opacity-60 ${isBot ? 'text-[#0B052B]' : 'text-white'}`}>
                      {timeStr}
                    </span>
                  </div>

                  {msg.richCard && (
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-2 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300 w-[240px]">
                      <h4 className="font-bold text-navy text-[13px]">{msg.richCard.title}</h4>
                      <ul className="flex flex-col gap-1.5 mb-1">
                        {msg.richCard.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-700">
                            <div className="w-3.5 h-3.5 rounded-full bg-lime/20 flex items-center justify-center shrink-0 mt-0.5">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-lime"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                      {msg.richCard.actionText && (
                        <p className="text-[11px] text-gray-500 font-medium mt-1">{msg.richCard.actionText}</p>
                      )}
                      {msg.richCard.actionButton && (
                        <button 
                          onClick={() => onQuickReplyClick(msg.richCard!.actionButton!)}
                          className="w-full bg-[#82C341] text-white py-2 rounded-xl text-[12px] font-bold hover:bg-[#72ad39] transition-all mt-1"
                        >
                          {msg.richCard.actionButton}
                        </button>
                      )}
                    </div>
                  )}
                  {isBot && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <QuickReplies 
                      replies={msg.quickReplies} 
                      onClick={onQuickReplyClick} 
                      isWelcomeScreen={isWelcome}
                    />
                  )}
                </div>
              </div>
            </div>
        );
      })}

      {isTyping && (
        <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex gap-3 flex-row max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100 overflow-hidden mt-1">
                <img src="/icon.png" alt="Bot" className="w-full h-full object-contain p-[3px]" />
            </div>
            <div className="px-3.5 py-2.5 bg-white text-navy border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-9">
              <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
};
