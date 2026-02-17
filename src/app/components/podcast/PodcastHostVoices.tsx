"use client";

import { useState, useRef } from "react";
import { Play, Square } from "lucide-react";

export interface Host {
  id: number;
  voiceId: string;
  name: string;
}

export const VOICE_MAP: Record<string, { avatar: string; color: string; label: string }> = {
  alloy: { avatar: "🎙️", color: "bg-amber-500", label: "Warm & Balanced" },
  echo: { avatar: "🎧", color: "bg-blue-500", label: "Deep & Resonant" },
  fable: { avatar: "📖", color: "bg-emerald-500", label: "Expressive & British" },
  onyx: { avatar: "🎤", color: "bg-slate-600", label: "Authoritative & Bold" },
  nova: { avatar: "✨", color: "bg-pink-500", label: "Bright & Energetic" },
  shimmer: { avatar: "💫", color: "bg-violet-500", label: "Clear & Melodic" },
};

const VOICE_IDS = Object.keys(VOICE_MAP);
const DEFAULT_NAMES = ["Alex", "Morgan", "Sam", "Jordan"];
const DEFAULT_VOICES = ["alloy", "echo", "nova", "fable"];

interface PodcastHostVoicesProps {
  numHosts: number;
  hosts: Host[];
  onHostsChange: (hosts: Host[]) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
}

const PodcastHostVoices = ({
  numHosts,
  hosts,
  onHostsChange,
  speechRate,
  onSpeechRateChange,
}: PodcastHostVoicesProps) => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPreview = async (voiceId: string) => {
    if (playingVoice === voiceId) {
      audioRef.current?.pause();
      setPlayingVoice(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlayingVoice(voiceId);
    try {
      const audio = new Audio(`/api/ai/podcast/voice-sample?voiceId=${voiceId}`);
      audioRef.current = audio;
      audio.onended = () => setPlayingVoice(null);
      audio.onerror = () => setPlayingVoice(null);
      await audio.play();
    } catch {
      setPlayingVoice(null);
    }
  };

  const updateHost = (index: number, updates: Partial<Host>) => {
    const updated = hosts.map((h, i) => (i === index ? { ...h, ...updates } : h));
    onHostsChange(updated);
  };

  return (
    <div className="space-y-5">
      {Array.from({ length: numHosts }).map((_, i) => {
        const host = hosts[i] || {
          id: i + 1,
          name: DEFAULT_NAMES[i],
          voiceId: DEFAULT_VOICES[i],
        };
        const selectedVoice = VOICE_MAP[host.voiceId];

        return (
          <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-8 h-8 rounded-lg ${selectedVoice?.color || "bg-gray-400"} flex items-center justify-center text-sm`}
              >
                {selectedVoice?.avatar || "🎵"}
              </div>
              <input
                type="text"
                value={host.name}
                onChange={(e) => updateHost(i, { name: e.target.value })}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#6366f1] transition-colors"
                placeholder={`Host ${i + 1} name`}
              />
            </div>

            {/* Voice selector grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {VOICE_IDS.map((vid) => {
                const voice = VOICE_MAP[vid];
                const isSelected = host.voiceId === vid;
                return (
                  <button
                    key={vid}
                    onClick={() => updateHost(i, { voiceId: vid })}
                    className={`relative flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-center ${
                      isSelected
                        ? "border-[#6366f1] bg-[#6366f1]/5 shadow-sm"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <span className="text-base">{voice.avatar}</span>
                    <span className="text-[10px] font-medium text-foreground capitalize">{vid}</span>
                    <span className="text-[9px] text-muted-foreground leading-tight">{voice.label}</span>
                    {/* Preview button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreview(vid);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      {playingVoice === vid ? (
                        <Square className="w-2 h-2 text-[#6366f1]" />
                      ) : (
                        <Play className="w-2 h-2 text-gray-500 ml-0.5" />
                      )}
                    </button>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Speech rate */}
      <div>
        <label className="text-[12px] font-medium text-foreground mb-2 block">Speech Rate</label>
        <div className="flex gap-2">
          {[0.8, 1.0, 1.2].map((rate) => (
            <button
              key={rate}
              onClick={() => onSpeechRateChange(rate)}
              className={`flex-1 py-2 rounded-lg text-[12px] font-medium border transition-all ${
                speechRate === rate
                  ? "border-[#6366f1] bg-[#6366f1]/5 text-[#6366f1]"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastHostVoices;
