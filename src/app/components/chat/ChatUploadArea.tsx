"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, FileImage, Presentation } from "lucide-react";
import { motion } from "framer-motion";

interface ChatUploadAreaProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

const ACCEPTED_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "application/vnd.ms-powerpoint": [".ppt"],
};

const fileTypes = [
  { label: "PDF", icon: FileText, color: "#ef4444" },
  { label: "DOCX", icon: FileImage, color: "#3b82f6" },
  { label: "PPTX", icon: Presentation, color: "#f97316" },
];

const ChatUploadArea = ({ onFileSelected, isUploading }: ChatUploadAreaProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: isUploading,
  });

  const rootProps = getRootProps();

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-10 md:py-14">
      <div
        {...rootProps}
        className={`w-full max-w-sm border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
          isDragActive
            ? "border-[#6366f1] bg-gradient-to-b from-[#6366f1]/8 to-[#8b5cf6]/4 scale-[1.02]"
            : "border-gray-200 hover:border-[#6366f1]/40 hover:bg-gradient-to-b hover:from-[#6366f1]/3 hover:to-transparent"
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full"
        >
        <input {...getInputProps()} />

        {/* Subtle background glow */}
        {isDragActive && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#6366f1_0%,_transparent_70%)] opacity-[0.06]" />
        )}

        <div className="flex flex-col items-center gap-4 relative z-10">
          {isUploading ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1]/15 to-[#8b5cf6]/10 flex items-center justify-center">
                <div className="w-6 h-6 border-[2.5px] border-[#6366f1] border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground mb-0.5">
                  Extracting text...
                </p>
                <p className="text-[12px] text-muted-foreground">
                  This may take a moment
                </p>
              </div>
            </>
          ) : (
            <>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragActive
                  ? "bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/15 shadow-lg shadow-[#6366f1]/10"
                  : "bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5"
              }`}>
                <Upload className={`w-6 h-6 transition-all duration-300 ${
                  isDragActive ? "text-[#6366f1] -translate-y-0.5" : "text-[#6366f1]/70"
                }`} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground mb-1">
                  {isDragActive ? "Drop your file here" : "Drop your document here"}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  or <span className="text-[#6366f1] font-medium">browse files</span>
                </p>
              </div>
            </>
          )}
        </div>
        </motion.div>
      </div>

      {/* File type indicators */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-3 mt-5"
      >
        {fileTypes.map((ft) => {
          const Icon = ft.icon;
          return (
            <div key={ft.label} className="flex items-center gap-1.5">
              <Icon className="w-3 h-3" style={{ color: ft.color }} />
              <span className="text-[11px] text-muted-foreground font-medium">{ft.label}</span>
            </div>
          );
        })}
        <span className="text-[10px] text-muted-foreground/60 ml-1">max 10MB</span>
      </motion.div>
    </div>
  );
};

export default ChatUploadArea;
