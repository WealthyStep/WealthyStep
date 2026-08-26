'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { motion, AnimatePresence } from 'motion/react';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after a few seconds or when clicked
  React.useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto mb-3 sm:mb-4 w-[calc(100vw-32px)] sm:w-[350px] h-[450px] sm:h-[500px] max-h-[calc(100dvh-80px)] sm:max-h-[calc(100dvh-100px)] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(24,_13,_69,_0.15)] overflow-hidden border border-white/50 flex flex-col origin-bottom-right ring-1 ring-gray-900/5"
          >
            <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {/* Tooltip */}
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className="pointer-events-auto bg-white px-4 py-2 rounded-2xl shadow-lg border border-gray-100 text-sm font-medium text-navy hidden md:block"
            >
              Hi there! 👋 Need help?
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-white"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                setIsOpen(true);
                setShowTooltip(false);
              }}
              className={`pointer-events-auto touch-manipulation relative shadow-[0_8px_30px_rgba(11,5,43,0.3)] flex items-center transition-all duration-300 hover:scale-[1.02] active:scale-95 border origin-bottom-right scale-[0.85] sm:scale-100 pl-2 pr-5 py-2 bg-navy text-white border-navy rounded-[28px]`}
              aria-label="Open chat"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-[16px] flex items-center justify-center shrink-0 shadow-sm border border-gray-100 overflow-hidden">
                  <img src="/icon.png" alt="Wealthy Step Bot" className="w-full h-full object-contain p-1.5" />
                </div>
                <div className="flex-col items-start justify-center flex">
                  <span className="font-bold text-[14px] leading-tight text-white whitespace-nowrap">Ask Wealthy Step</span>
                  <span className="text-[11px] font-medium text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82C341] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#82C341]"></span>
                    </span>
                    Support Available
                  </span>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
