"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

interface ChatMessageProps {
  question: string;
  response: string;
  isStreaming?: boolean;
}

const ChatMessage = ({ question, response, isStreaming }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* User question - right aligned */}
      <div className="flex justify-end">
        <div className="max-w-[85%] md:max-w-[72%] bg-gradient-to-br from-[#6366f1] to-[#7c3aed] text-white rounded-2xl rounded-br-lg px-4 py-3 shadow-sm shadow-[#6366f1]/15">
          <p className="text-[13px] md:text-[14px] leading-relaxed">{question}</p>
        </div>
      </div>

      {/* AI response - left aligned */}
      <div className="flex gap-2.5 justify-start">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6366f1]/12 to-[#8b5cf6]/8 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3 text-[#6366f1]" />
        </div>
        <div className="max-w-[82%] md:max-w-[70%] bg-white/80 border border-gray-100 rounded-2xl rounded-bl-lg px-4 py-3 group relative shadow-sm">
          {isStreaming && !response ? (
            <div className="flex items-center gap-1.5 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]/50 animate-bounce [animation-delay:0ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]/50 animate-bounce [animation-delay:150ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]/50 animate-bounce [animation-delay:300ms]" />
            </div>
          ) : (
            <>
              <p className="text-[13px] md:text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap">
                {response}
                {isStreaming && (
                  <span className="inline-block w-[3px] h-[16px] bg-[#6366f1]/70 animate-pulse ml-0.5 align-middle rounded-full" />
                )}
              </p>
              {!isStreaming && response && (
                <button
                  onClick={handleCopy}
                  className="absolute -bottom-0.5 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-gray-50 translate-y-0 group-hover:-translate-y-1"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
