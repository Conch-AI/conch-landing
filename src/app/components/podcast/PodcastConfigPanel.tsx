"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import PodcastHostVoices, { Host, VoiceItem } from "./PodcastHostVoices";

export interface PodcastConfig {
  numHosts: number;
  hosts: Host[];
  language: string;
  mode: "Conversational" | "Detailed" | "Interview";
  speechRate: number;
  targetDuration: number;
}

const LANGUAGES = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Spanish", flag: "🇪🇸" },
  { value: "fr", label: "French", flag: "🇫🇷" },
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "it", label: "Italian", flag: "🇮🇹" },
  { value: "pt", label: "Portuguese", flag: "🇵🇹" },
  { value: "ja", label: "Japanese", flag: "🇯🇵" },
  { value: "ko", label: "Korean", flag: "🇰🇷" },
  { value: "zh", label: "Chinese", flag: "🇨🇳" },
];

const MODES: { value: PodcastConfig["mode"]; label: string; desc: string }[] = [
  { value: "Conversational", label: "Conversational", desc: "Natural dialogue between hosts" },
  { value: "Detailed", label: "Detailed", desc: "In-depth analysis of content" },
  { value: "Interview", label: "Interview", desc: "Q&A format discussion" },
];

/**
 * Calculate optimal podcast duration based on content length
 */
const calculatePodcastDuration = (contentLength: number): number => {
  const CHARS_PER_MINUTE = 2000;
  const estimatedMinutes = contentLength / CHARS_PER_MINUTE;

  if (estimatedMinutes <= 1.5) return 1;
  if (estimatedMinutes <= 2.5) return 2;
  if (estimatedMinutes <= 3.5) return 3;
  if (estimatedMinutes <= 4.5) return 4;
  if (estimatedMinutes <= 6) return 5;
  if (estimatedMinutes <= 7.5) return 6;
  if (estimatedMinutes <= 9) return 7;
  if (estimatedMinutes <= 11) return 8;
  if (estimatedMinutes <= 13) return 9;
  return 10;
};

interface PodcastConfigPanelProps {
  config: PodcastConfig;
  onConfigChange: (config: PodcastConfig) => void;
  onGenerate: () => void;
  contentLength: number;
  isGenerating: boolean;
  initialVoices?: VoiceItem[];
}

const PodcastConfigPanel = ({
  config,
  onConfigChange,
  onGenerate,
  contentLength,
  isGenerating,
  initialVoices,
}: PodcastConfigPanelProps) => {
  const [langOpen, setLangOpen] = useState(false);

  const estimatedDuration = contentLength > 0 ? calculatePodcastDuration(contentLength) : 5;

  const selectedLang = LANGUAGES.find((l) => l.value === config.language) || LANGUAGES[0];

  // Sync targetDuration with content changes
  useEffect(() => {
    if (config.targetDuration !== estimatedDuration) {
      onConfigChange({ ...config, targetDuration: estimatedDuration });
    }
  }, [estimatedDuration, config, onConfigChange]);

  return (
    <div className="space-y-8">
      {/* Host voices — full width, at the top */}
      <div>
        <label className="text-[13px] font-medium text-foreground mb-2.5 block">Select & Customize Voices</label>
        <PodcastHostVoices
          numHosts={config.numHosts}
          hosts={config.hosts}
          onHostsChange={(hosts) => onConfigChange({ ...config, hosts })}
          speechRate={config.speechRate}
          onSpeechRateChange={(speechRate) => onConfigChange({ ...config, speechRate })}
          initialVoices={initialVoices}
        />
      </div>

      {/* Number of hosts + Mode + Language row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Number of hosts */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-2.5 block">Number of Hosts</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => onConfigChange({ ...config, numHosts: n })}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                  config.numHosts === n
                    ? "border-[#6366f1] bg-[#6366f1] text-white shadow-sm"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Podcast mode */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-2.5 block">Podcast Mode</label>
          <div className="flex flex-col gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => onConfigChange({ ...config, mode: m.value })}
                className={`relative p-3 rounded-xl border text-left transition-all ${
                  config.mode === m.value
                    ? "border-[#6366f1] bg-[#6366f1]/5 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                {config.mode === m.value && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#6366f1]">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <p className={`text-[12px] font-medium ${config.mode === m.value ? "text-[#6366f1]" : "text-foreground"}`}>{m.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="text-[13px] font-medium text-foreground mb-2.5 block">Language</label>
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] hover:border-gray-300 transition-colors dark:bg-gray-800 dark:border-gray-700"
            >
              <span>{selectedLang.flag} {selectedLang.label}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-[200px] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      onConfigChange({ ...config, language: lang.value });
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors dark:hover:bg-gray-700 ${
                      config.language === lang.value ? "bg-[#6366f1]/5 text-[#6366f1]" : "text-foreground"
                    }`}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile generate button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full sm:hidden bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50 text-white rounded-xl px-5 py-3.5 text-[14px] font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Starting generation...
          </>
        ) : (
          "Generate Podcast"
        )}
      </button>
    </div>
  );
};

export default PodcastConfigPanel;
