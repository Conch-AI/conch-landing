"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface ChatPresetQuestionsProps {
  onSelect: (question: string) => void;
  compact?: boolean;
  suggestions?: string[];
  isLoadingSuggestions?: boolean;
}

const defaultPresets = [
  "Summarize this document",
  "What are the key points?",
  "What is the main argument?",
  "Explain key terms used",
  "What are the conclusions?",
];

const ChatPresetQuestions = ({ onSelect, compact, suggestions, isLoadingSuggestions }: ChatPresetQuestionsProps) => {
  // Compact (after chat started): only show dynamic suggestions
  // Full (initial view): show hardcoded defaults
  const items = compact
    ? (suggestions && suggestions.length > 0 ? suggestions : [])
    : (suggestions && suggestions.length > 0 ? suggestions : defaultPresets);

  if (compact) {
    if (items.length === 0 && !isLoadingSuggestions) return null;

    return (
      <div className="shrink-0 px-3 md:px-4 py-3 border-t border-gray-100 bg-gray-50/50 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-1.5">
          {isLoadingSuggestions ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-7 w-36 rounded-lg bg-gray-100 animate-pulse shrink-0" />
              ))}
            </>
          ) : (
            items.map((q) => (
              <button
                key={q}
                onClick={() => onSelect(q)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-100 bg-white hover:border-[#6366f1]/30 hover:bg-[#6366f1]/[0.04] transition-all duration-200 text-[11px] md:text-[12px] text-gray-500 hover:text-gray-700 whitespace-nowrap shrink-0 group"
              >
                <MessageCircle className="w-3 h-3 text-gray-300 group-hover:text-[#6366f1] transition-colors" />
                {q}
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-6"
      >
        <p className="text-[13px] text-muted-foreground">
          {isLoadingSuggestions ? "Analyzing your document..." : "Your document is ready. Try asking:"}
        </p>
      </motion.div>

      <div className="flex flex-col gap-2 w-full max-w-sm">
        {isLoadingSuggestions ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-[50px] rounded-xl bg-gray-50 animate-pulse" />
            ))}
          </>
        ) : (
          items.map((q, i) => (
            <motion.button
              key={q}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: "easeOut" }}
              onClick={() => onSelect(q)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white/60 hover:border-[#6366f1]/30 hover:bg-gradient-to-r hover:from-[#6366f1]/[0.04] hover:to-transparent transition-all duration-200 text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-[#6366f1]/10 flex items-center justify-center transition-colors shrink-0">
                <MessageCircle className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#6366f1] transition-colors" />
              </div>
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">
                {q}
              </span>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatPresetQuestions;
