"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, FileImage, Presentation, X } from "lucide-react";
import { motion } from "framer-motion";

interface SourceFile {
  name: string;
  content: string;
}

interface PodcastUploadAreaProps {
  onFilesReady: (files: SourceFile[]) => void;
  isUploading: boolean;
}

const ACCEPTED_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
};

const fileTypes = [
  { label: "PDF", icon: FileText, color: "#ef4444" },
  { label: "DOCX", icon: FileImage, color: "#3b82f6" },
  { label: "PPTX", icon: Presentation, color: "#f97316" },
];

const MAX_FILES = 3;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const PodcastUploadArea = ({ onFilesReady, isUploading }: PodcastUploadAreaProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const combined = [...files, ...acceptedFiles].slice(0, MAX_FILES);
      const oversized = combined.find((f) => f.size > MAX_SIZE);
      if (oversized) {
        setError(`"${oversized.name}" exceeds 10MB limit`);
        return;
      }
      setFiles(combined);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: MAX_FILES - files.length,
    disabled: isUploading || parsing || files.length >= MAX_FILES,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleContinue = async () => {
    if (files.length === 0) return;
    setParsing(true);
    setError(null);

    try {
      const parsed: SourceFile[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/ai/chat/parse-file", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Parse failed" }));
          throw new Error(data.error || `Failed to parse ${file.name}`);
        }
        const data = await res.json();
        parsed.push({ name: file.name, content: data.text });
      }
      onFilesReady(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse files");
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 md:py-10">
      <div
        {...getRootProps()}
        className={`w-full max-w-md border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
          isDragActive
            ? "border-[#6366f1] bg-gradient-to-b from-[#6366f1]/8 to-[#8b5cf6]/4 scale-[1.02]"
            : "border-gray-200 hover:border-[#6366f1]/40 hover:bg-gradient-to-b hover:from-[#6366f1]/3 hover:to-transparent"
        } ${isUploading || parsing || files.length >= MAX_FILES ? "opacity-60 pointer-events-none" : ""}`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragActive
                  ? "bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/15 shadow-lg shadow-[#6366f1]/10"
                  : "bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/5"
              }`}
            >
              <Upload
                className={`w-6 h-6 transition-all duration-300 ${
                  isDragActive ? "text-[#6366f1] -translate-y-0.5" : "text-[#6366f1]/70"
                }`}
              />
            </div>
            <div>
              <p className="text-[14px] font-medium text-foreground mb-1">
                {isDragActive ? "Drop files here" : "Drop your documents here"}
              </p>
              <p className="text-[12px] text-muted-foreground">
                or <span className="text-[#6366f1] font-medium">browse files</span>
                <span className="ml-1">(up to {MAX_FILES} files)</span>
              </p>
            </div>
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
        <span className="text-[10px] text-muted-foreground/60 ml-1">max 10MB each</span>
      </motion.div>

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="w-full max-w-md mt-5 space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-[#6366f1] shrink-0" />
                <span className="text-[13px] text-foreground truncate">{file.name}</span>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          ))}

          <button
            onClick={handleContinue}
            disabled={parsing}
            className="w-full mt-3 bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50 text-white rounded-xl px-5 py-3 text-[14px] font-medium transition-all flex items-center justify-center gap-2"
          >
            {parsing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Extracting text...
              </>
            ) : (
              "Continue to Configure"
            )}
          </button>
        </div>
      )}

      {error && (
        <p className="text-[12px] text-red-500 mt-3 text-center">{error}</p>
      )}
    </div>
  );
};

export default PodcastUploadArea;
