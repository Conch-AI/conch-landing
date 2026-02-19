"use client";

import { FileText, Maximize2, Minimize2, RotateCcw, Upload } from "lucide-react";

interface ChatHeaderProps {
  fileName: string | null;
  onNewChat: () => void;
  onUploadNew: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const ChatHeader = ({ fileName, onNewChat, onUploadNew, isFullscreen, onToggleFullscreen }: ChatHeaderProps) => {
  if (!fileName) return null;

  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 md:px-5 py-2.5 bg-gradient-to-r from-white to-gray-50/50">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1]/12 to-[#8b5cf6]/8 flex items-center justify-center shrink-0">
          <FileText className="w-3.5 h-3.5 text-[#6366f1]" />
        </div>
        <span className="text-[12px] md:text-[13px] font-medium text-gray-700 truncate">
          {fileName}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] md:text-[12px] font-medium text-gray-400 hover:text-[#6366f1] hover:bg-[#6366f1]/5 rounded-lg transition-all duration-200"
        >
          <RotateCcw className="w-3 h-3" />
          Clear
        </button>
        <div className="w-px h-3.5 bg-gray-200" />
        <button
          onClick={onUploadNew}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] md:text-[12px] font-medium text-gray-400 hover:text-[#6366f1] hover:bg-[#6366f1]/5 rounded-lg transition-all duration-200"
        >
          <Upload className="w-3 h-3" />
          New File
        </button>
        {onToggleFullscreen && (
          <>
            <div className="w-px h-3.5 bg-gray-200" />
            <button
              onClick={onToggleFullscreen}
              className="flex items-center justify-center w-7 h-7 text-gray-400 hover:text-[#6366f1] hover:bg-[#6366f1]/5 rounded-lg transition-all duration-200"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
