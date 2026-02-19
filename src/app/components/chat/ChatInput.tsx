"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-sm px-3 md:px-4 py-3 md:py-3.5">
      <div className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 ${
        isFocused
          ? "bg-white ring-2 ring-[#6366f1]/20 shadow-sm shadow-[#6366f1]/5"
          : "bg-gray-50/80 ring-1 ring-gray-100"
      }`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask a question about your document..."
          disabled={disabled}
          className="flex-1 bg-transparent text-[13px] md:text-[14px] outline-none placeholder:text-gray-400 disabled:opacity-50 text-gray-700"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            input.trim() && !disabled
              ? "bg-gradient-to-br from-[#6366f1] to-[#7c3aed] shadow-md shadow-[#6366f1]/25 hover:shadow-lg hover:shadow-[#6366f1]/30 scale-100"
              : "bg-gray-200 scale-95 opacity-50"
          }`}
        >
          <ArrowUp className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
