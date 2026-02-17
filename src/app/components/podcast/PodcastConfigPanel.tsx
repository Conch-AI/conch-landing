"use client";

import { useState } from "react";
import { ChevronDown, Clock, Zap } from "lucide-react";
import PodcastHostVoices, { Host } from "./PodcastHostVoices";

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

const DEFAULT_NAMES = ["Alex", "Morgan", "Sam", "Jordan"];
const DEFAULT_VOICES = ["alloy", "echo", "nova", "fable"];

interface PodcastConfigPanelProps {
  config: PodcastConfig;
  onConfigChange: (config: PodcastConfig) => void;
  onGenerate: () => void;
  contentLength: number;
  isGenerating: boolean;
}

const PodcastConfigPanel = ({
  config,
  onConfigChange,
  onGenerate,
  contentLength,
  isGenerating,
}: PodcastConfigPanelProps) => {
  const [langOpen, setLangOpen] = useState(false);

  const estimatedDuration = Math.max(2, Math.min(30, Math.round(contentLength / 1500)));
  const selectedLang = LANGUAGES.find((l) => l.value === config.language) || LANGUAGES[0];

  const setNumHosts = (n: number) => {
    const hosts: Host[] = Array.from({ length: n }, (_, i) => {
      if (config.hosts[i]) return config.hosts[i];
      return { id: i + 1, name: DEFAULT_NAMES[i], voiceId: DEFAULT_VOICES[i] };
    });
    onConfigChange({ ...config, numHosts: n, hosts, targetDuration: estimatedDuration });
  };

  return (
    <div className="px-5 py-6 md:px-8 md:py-8 space-y-6 overflow-y-auto max-h-[65vh]">
      {/* Number of hosts */}
      <div>
        <label className="text-[13px] font-medium text-foreground mb-2.5 block">Number of Hosts</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setNumHosts(n)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium border transition-all ${
                config.numHosts === n
                  ? "border-[#6366f1] bg-[#6366f1] text-white shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
              }`}
            >
              {n} {n === 1 ? "Host" : "Hosts"}
            </button>
          ))}
        </div>
      </div>

      {/* Podcast mode */}
      <div>
        <label className="text-[13px] font-medium text-foreground mb-2.5 block">Podcast Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => onConfigChange({ ...config, mode: m.value })}
              className={`p-3 rounded-xl border text-center transition-all ${
                config.mode === m.value
                  ? "border-[#6366f1] bg-[#6366f1]/5 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <p className="text-[12px] font-medium text-foreground">{m.label}</p>
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
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] hover:border-gray-300 transition-colors"
          >
            <span>
              {selectedLang.flag} {selectedLang.label}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${langOpen ? "rotate-180" : ""}`} />
          </button>
          {langOpen && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-[200px] overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    onConfigChange({ ...config, language: lang.value });
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors ${
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

      {/* Host voices */}
      <div>
        <label className="text-[13px] font-medium text-foreground mb-2.5 block">Host Voices</label>
        <PodcastHostVoices
          numHosts={config.numHosts}
          hosts={config.hosts}
          onHostsChange={(hosts) => onConfigChange({ ...config, hosts })}
          speechRate={config.speechRate}
          onSpeechRateChange={(speechRate) => onConfigChange({ ...config, speechRate })}
        />
      </div>

      {/* Duration estimate + credits */}
      <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 flex-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-[12px] text-muted-foreground">
            ~{estimatedDuration} min estimated
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-[12px] text-muted-foreground">1 credit</span>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50 text-white rounded-xl px-5 py-3.5 text-[14px] font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
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
