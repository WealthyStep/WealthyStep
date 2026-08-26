import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Minus, Lock, Headset } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatMessage, ChatbotIntent } from '@/lib/chatbot/types';
import { detectIntent } from '@/lib/chatbot/engine';
import { knowledgeBase } from '@/lib/chatbot/knowledge-base';
import { LeadFormFlow } from './LeadFormFlow';

interface ChatWindowProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, isOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inLeadFlow, setInLeadFlow] = useState(false);

  // Initialize with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = knowledgeBase['GREETING'];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([
        {
          id: Date.now().toString(),
          role: 'bot',
          content: greeting.answer!,
          quickReplies: greeting.quickReplies,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Process response
    setTimeout(() => {
      const { intent, confidence } = detectIntent(text);
      
      // If user wants human support, trigger lead flow
      if (intent === 'HUMAN_SUPPORT' || intent === 'CONTACT') {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: knowledgeBase['HUMAN_SUPPORT'].answer!,
          timestamp: new Date(),
          isLeadFlow: true
        };
        setInLeadFlow(true);
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }

      // If we have a good match
      if (confidence === 'HIGH' || confidence === 'MEDIUM') {
        const kbEntry = knowledgeBase[intent];
        let responseText = kbEntry.answer!;
        
        if (confidence === 'MEDIUM') {
          responseText = "I think you're asking about this:\n\n" + responseText;
        }

        if (kbEntry.complianceNote) {
          responseText += "\n\nNote: " + kbEntry.complianceNote;
        }

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: responseText,
          quickReplies: kbEntry.quickReplies,
          richCard: kbEntry.richCard,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        // Unknown fallback
        const fallback = knowledgeBase['UNKNOWN'];
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: fallback.answer!,
          quickReplies: fallback.quickReplies,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      }
      
      setIsTyping(false);
    }, 300); // Super fast simulated typing delay
  };

  const handleQuickReply = (reply: string) => {
    if (reply.includes('Contact Our Team')) {
      handleSend('I want someone to contact me');
    } else {
      handleSend(reply);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-hidden relative">
      {/* Premium Header - Light Theme */}
      <div className="bg-white text-navy px-4 py-3 sm:px-5 sm:py-4 flex justify-between items-start shrink-0 z-10 rounded-t-2xl border-b border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-gray-100 overflow-hidden shadow-sm">
            <img src="/icon.png" alt="Bot" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-[14px] sm:text-[15px] leading-tight tracking-wide mt-0.5">Wealthy Step Assist</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82C341] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#82C341]"></span>
              </span>
              <span className="text-[11px] text-gray-500 font-medium tracking-wide">Support Available</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-navy transition-all"
            aria-label="Minimize chat"
          >
            <Minus size={16} />
          </button>
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-navy transition-all"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages / Form Area */}
      {inLeadFlow ? (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          <LeadFormFlow 
            onSuccess={() => {
              setInLeadFlow(false);
              onClose();
            }} 
            onCancel={() => {
              setInLeadFlow(false);
              setMessages(prev => [...prev.filter(m => !m.isLeadFlow), {
                id: Date.now().toString(),
                role: 'system',
                content: 'Enquiry cancelled. Let me know if you need anything else.',
                timestamp: new Date()
              }]);
            }} 
          />
        </div>
      ) : (
        <ChatMessages 
          messages={messages} 
          onQuickReplyClick={handleQuickReply} 
          isTyping={isTyping}
          onLeadSuccess={() => {}}
          onLeadCancel={() => {}}
        />
      )}

      {/* Footer Area with Privacy Text */}
      <div className="bg-white px-4 py-3 shrink-0 rounded-b-2xl flex flex-col border-t border-gray-100">
        {!inLeadFlow && (
          <div className="mb-3">
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </div>
        )}
        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Lock size={10} className="text-gray-400" /> Privacy Focused
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <Headset size={10} className="text-gray-400" /> Human Support
          </div>
        </div>
      </div>
    </div>
  );
};
