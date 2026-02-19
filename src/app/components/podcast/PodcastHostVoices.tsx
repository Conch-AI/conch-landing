"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
} from "lucide-react";

export interface Host {
  id: number;
  voiceId: string;
  name: string;
}

// Voice data from API
export interface VoiceItem {
  voiceId: string;
  name: string;
  description: string;
  gender: string;
  color: string;
  previewUrl?: string | null;
  previewImageUrl?: string | null;
}

// Fallback personality data (used when API data is not available)
export const VOICE_PERSONALITIES: Record<
  string,
  {
    avatar: string;
    hex: string;
    color: string;
    personality: string;
    description: string;
    label: string;
  }
> = {
  alloy: {
    avatar: "\uD83C\uDF99\uFE0F",
    hex: "#f59e0b",
    color: "bg-amber-500",
    personality: "A versatile, neutral voice with clear articulation. Perfect for professional narration.",
    description: "Warm & Balanced",
    label: "Warm & Balanced",
  },
  echo: {
    avatar: "\uD83C\uDFA7",
    hex: "#4F46E5",
    color: "bg-indigo-600",
    personality: "A rich, masculine voice with depth and gravitas. Great for storytelling.",
    description: "Deep & Resonant",
    label: "Deep & Resonant",
  },
  fable: {
    avatar: "\uD83D\uDCD6",
    hex: "#059669",
    color: "bg-emerald-600",
    personality: "An elegant British accent with theatrical flair. Ideal for narratives.",
    description: "Expressive & British",
    label: "Expressive & British",
  },
  onyx: {
    avatar: "\uD83C\uDFA4",
    hex: "#1F2937",
    color: "bg-gray-800",
    personality: "A commanding, deep voice that conveys authority and confidence.",
    description: "Authoritative & Bold",
    label: "Authoritative & Bold",
  },
  nova: {
    avatar: "\u2728",
    hex: "#EC4899",
    color: "bg-pink-500",
    personality: "A lively, feminine voice with warmth and enthusiasm. Perfect for engaging content.",
    description: "Bright & Energetic",
    label: "Bright & Energetic",
  },
  shimmer: {
    avatar: "\uD83D\uDCAB",
    hex: "#8B5CF6",
    color: "bg-violet-500",
    personality: "A crystal-clear voice with elegant, flowing delivery. Great for calm narration.",
    description: "Clear & Melodic",
    label: "Clear & Melodic",
  },
  coral: {
    avatar: "\uD83E\uDEB8",
    hex: "#F97316",
    color: "bg-orange-500",
    personality: "An expressive female voice with warmth and character. Great for engaging conversations.",
    description: "Expressive & Warm",
    label: "Expressive & Warm",
  },
};

const DEFAULT_HOST_NAMES = ["Alex", "Morgan", "Sam", "Jordan"];

// Global cache for voice preview audio URLs
const VOICE_PREVIEW_CACHE = new Map<string, string>();

// Waveform visualization
const WaveformVisualizer = ({ isPlaying, color }: { isPlaying: boolean; color: string }) => (
  <div className="flex h-4 items-center justify-center gap-[3px]">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className={`w-[3px] rounded-full ${color} transition-all duration-150 ${
          isPlaying ? "animate-waveform" : ""
        }`}
        style={{
          height: isPlaying ? "14px" : "3px",
          animationDelay: isPlaying ? `${i * 0.12}s` : "0s",
        }}
      />
    ))}
  </div>
);

// Speech rate control
const SpeechRateSlider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const rates = [
    { value: 0.8, label: "0.8\u00D7", description: "Relaxed" },
    { value: 1.0, label: "1.0\u00D7", description: "Normal" },
    { value: 1.2, label: "1.2\u00D7", description: "Energetic" },
  ];

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Volume2 className="h-3.5 w-3.5" />
        Speech Rate
      </label>
      <div className="flex gap-2">
        {rates.map((rate) => (
          <button
            key={rate.value}
            onClick={() => onChange(rate.value)}
            className={`flex-1 rounded-xl py-2.5 text-center border transition-all duration-200 ${
              value === rate.value
                ? "border-[#6366f1] bg-[#6366f1] text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600"
            }`}
          >
            <div className="text-sm font-bold">{rate.label}</div>
            <div className={`text-[10px] ${value === rate.value ? "text-white/70" : "text-gray-400"}`}>
              {rate.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

interface PodcastHostVoicesProps {
  numHosts: number;
  hosts: Host[];
  onHostsChange: (hosts: Host[]) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  initialVoices?: VoiceItem[];
}

const PodcastHostVoices = ({
  numHosts,
  hosts,
  onHostsChange,
  speechRate,
  onSpeechRateChange,
  initialVoices,
}: PodcastHostVoicesProps) => {
  const [voices, setVoices] = useState<VoiceItem[] | null>(
    initialVoices && initialVoices.length > 0 ? initialVoices : null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeHostId, setActiveHostId] = useState(hosts[0]?.id || 1);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keep activeHostId in sync when host count changes
  useEffect(() => {
    const hostExists = hosts.some((h) => h.id === activeHostId);
    if (!hostExists && hosts.length > 0) {
      setActiveHostId(hosts[0].id);
    }
  }, [hosts, activeHostId]);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.onended = () => setPlayingVoiceId(null);
    audio.onerror = () => setPlayingVoiceId(null);
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Sync from parent when initialVoices arrives
  useEffect(() => {
    if (initialVoices && initialVoices.length > 0) {
      setVoices(initialVoices);
      initialVoices.forEach((voice) => {
        if (voice.previewUrl) {
          VOICE_PREVIEW_CACHE.set(voice.voiceId, voice.previewUrl);
        }
      });
    }
  }, [initialVoices]);

  // Fetch voices from API if not provided by parent
  useEffect(() => {
    if (initialVoices && initialVoices.length > 0) return;

    const fetchVoices = async () => {
      try {
        const res = await fetch("/api/ai/podcast/voices?includePreviews=true");
        if (!res.ok) throw new Error("Failed to fetch voices");
        const data = await res.json();

        const voicesData: VoiceItem[] = data.voices || [];
        setVoices(voicesData);

        if (data.previewsIncluded) {
          voicesData.forEach((voice: VoiceItem) => {
            if (voice.previewUrl) {
              VOICE_PREVIEW_CACHE.set(voice.voiceId, voice.previewUrl);
            }
          });
        }
      } catch (err) {
        console.error("Error fetching voices:", err);
        // Fallback to hardcoded voice list
        setVoices([
          { voiceId: "echo", name: "Echo", description: "Male voice with warmth", gender: "male", color: "#4F46E5" },
          { voiceId: "fable", name: "Fable", description: "British male voice", gender: "male", color: "#059669" },
          { voiceId: "onyx", name: "Onyx", description: "Deep male voice", gender: "male", color: "#1F2937" },
          { voiceId: "nova", name: "Nova", description: "Friendly female voice", gender: "female", color: "#EC4899" },
          { voiceId: "shimmer", name: "Shimmer", description: "Soft female voice", gender: "female", color: "#8B5CF6" },
          { voiceId: "coral", name: "Coral", description: "Expressive female voice", gender: "female", color: "#F97316" },
        ]);
      }
    };

    fetchVoices();

    return () => {
      VOICE_PREVIEW_CACHE.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      VOICE_PREVIEW_CACHE.clear();
    };
  }, [initialVoices]);

  // Carousel navigation
  const handleCarouselPrev = () => {
    if (!voices) return;
    setCurrentIndex((prev) => (prev - 1 + voices.length) % voices.length);
  };
  const handleCarouselNext = () => {
    if (!voices) return;
    setCurrentIndex((prev) => (prev + 1) % voices.length);
  };

  // Voice preview playback — use cached API URL, fallback to voice-sample endpoint
  const handlePreview = useCallback(
    (voiceId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      if (playingVoiceId === voiceId && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setPlayingVoiceId(null);
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const cachedUrl = VOICE_PREVIEW_CACHE.get(voiceId);
      const audioSrc = cachedUrl || `/api/ai/podcast/voice-sample?voiceId=${voiceId}`;

      setPlayingVoiceId(voiceId);
      try {
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => setPlayingVoiceId(null));
          }
        }
      } catch {
        setPlayingVoiceId(null);
      }
    },
    [playingVoiceId],
  );

  // Host management
  const handleVoiceSelect = (voiceId: string) => {
    const updated = hosts.map((h) =>
      h.id === activeHostId ? { ...h, voiceId } : h,
    );
    onHostsChange(updated);
  };

  const handleNameChange = (hostId: number, name: string) => {
    const updated = hosts.map((h) => (h.id === hostId ? { ...h, name } : h));
    onHostsChange(updated);
  };

  const getHostsForVoice = (voiceId: string) =>
    hosts
      .map((h, idx) => ({ ...h, index: idx }))
      .filter((h) => h.voiceId === voiceId);

  const activeHost = hosts.find((h) => h.id === activeHostId);
  const activeHostIndex = hosts.findIndex((h) => h.id === activeHostId);

  // Helper to get personality data, merging API voice color with fallback
  const getPersonality = (voiceId: string, voice?: VoiceItem) => {
    const fallback = VOICE_PERSONALITIES[voiceId] || VOICE_PERSONALITIES.echo;
    const hex = voice?.color || fallback.hex;
    return { ...fallback, hex };
  };

  return (
    <div className="space-y-5">
      {/* Host Selector Tabs */}
      <div className="flex gap-1 rounded-xl bg-[#f4f3f8] p-1 dark:bg-gray-800">
        {hosts.slice(0, numHosts).map((host, idx) => {
          const personality = getPersonality(host.voiceId);
          const isActive = activeHostId === host.id;

          return (
            <button
              key={host.id}
              onClick={() => setActiveHostId(host.id)}
              className={`relative flex-1 rounded-lg px-3 py-2.5 text-center transition-all duration-200 ${
                isActive
                  ? "bg-white text-foreground shadow-sm dark:bg-gray-900 dark:text-white"
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/50 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700/50"
              }`}
            >
              <div className={`text-[10px] font-medium uppercase tracking-widest ${isActive ? "text-muted-foreground" : "text-gray-400 dark:text-gray-600"}`}>
                Host {idx + 1}
              </div>
              <div className="truncate text-sm font-semibold">
                {host.name || DEFAULT_HOST_NAMES[idx]}
              </div>
              {isActive && (
                <div className="mx-auto mt-1.5 h-0.5 w-8 rounded-full" style={{ background: personality.hex }} />
              )}
            </button>
          );
        })}
      </div>

      {/* 3D Voice Carousel */}
      {!voices ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-gray-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">Loading voices...</span>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-center text-sm text-muted-foreground">
            Select voice for{" "}
            <span className="font-semibold text-foreground">
              {activeHost?.name || DEFAULT_HOST_NAMES[activeHostIndex] || "Host"}
            </span>
          </p>

          {/* Carousel wrapper */}
          <div className="relative" style={{ perspective: "1200px" }}>
            {/* Left Arrow */}
            <button
              onClick={handleCarouselPrev}
              className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-400 shadow-lg ring-1 ring-black/5 transition-all hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:ring-white/10 dark:hover:text-white md:left-1"
              aria-label="Previous voice"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Cards container */}
            <div className="relative mx-auto flex h-[380px] w-full items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
                style={{ transformStyle: "preserve-3d" }}
              >
                {voices.map((voice, index) => {
                  let relativePos = index - currentIndex;
                  if (relativePos > voices.length / 2) relativePos -= voices.length;
                  if (relativePos < -voices.length / 2) relativePos += voices.length;

                  const personality = getPersonality(voice.voiceId, voice);
                  const isSelectedForActive = activeHost?.voiceId === voice.voiceId;
                  const hostsUsingThis = getHostsForVoice(voice.voiceId);
                  const isCenterCard = relativePos === 0;

                  let transform = "";
                  let cardOpacity = 1;
                  let filter = "brightness(1)";
                  let zIndex = 1;

                  if (relativePos === 0) {
                    transform = "translateX(0) scale(1) rotateY(0deg)";
                    cardOpacity = 1;
                    zIndex = 10;
                  } else if (relativePos === -1) {
                    transform = "translateX(-155px) scale(0.88) rotateY(10deg)";
                    cardOpacity = 0.6;
                    filter = "brightness(0.85)";
                    zIndex = 5;
                  } else if (relativePos === 1) {
                    transform = "translateX(155px) scale(0.88) rotateY(-10deg)";
                    cardOpacity = 0.6;
                    filter = "brightness(0.85)";
                    zIndex = 5;
                  } else if (relativePos === -2) {
                    transform = "translateX(-280px) scale(0.78) rotateY(18deg)";
                    cardOpacity = 0.3;
                    filter = "brightness(0.7)";
                    zIndex = 2;
                  } else if (relativePos === 2) {
                    transform = "translateX(280px) scale(0.78) rotateY(-18deg)";
                    cardOpacity = 0.3;
                    filter = "brightness(0.7)";
                    zIndex = 2;
                  } else {
                    transform = `translateX(${relativePos * 160}px) scale(0.65)`;
                    cardOpacity = 0;
                    filter = "brightness(0.5)";
                    zIndex = 0;
                  }

                  return (
                    <div
                      key={voice.voiceId}
                      className="absolute w-56 cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ease-out"
                      style={{
                        height: "360px",
                        transform,
                        opacity: cardOpacity,
                        filter,
                        zIndex,
                        boxShadow: isCenterCard
                          ? "0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.15)"
                          : "0 10px 30px rgba(0,0,0,0.15)",
                        border: isCenterCard
                          ? "2px solid rgba(99,102,241,0.25)"
                          : "1px solid rgba(0,0,0,0.1)",
                      }}
                      onClick={() => {
                        if (!isCenterCard) setCurrentIndex(index);
                      }}
                    >
                      {/* Background: API image or gradient fallback */}
                      {voice.previewImageUrl ? (
                        <img
                          src={voice.previewImageUrl}
                          alt={voice.name || voice.voiceId}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(160deg, ${personality.hex}30 0%, rgba(30,30,30,1) 70%)`,
                          }}
                        />
                      )}

                      {/* Dark overlay for text readability */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Card content */}
                      <div className="relative flex h-full flex-col justify-between p-4">
                        {/* Top — badges */}
                        <div className="flex items-start justify-between">
                          <div className="flex flex-wrap gap-1">
                            {hostsUsingThis.map((h) => (
                              <span
                                key={h.id}
                                className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm"
                              >
                                Host {h.index + 1}
                              </span>
                            ))}
                          </div>
                          {isCenterCard && (
                            <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/30">
                              <Play className="h-2.5 w-2.5 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Emoji centered (only when no image) */}
                        {!voice.previewImageUrl && (
                          <div className="flex flex-1 items-center justify-center">
                            <span className={`drop-shadow-lg ${isCenterCard ? "text-[64px]" : "text-[48px]"}`}>
                              {personality.avatar}
                            </span>
                          </div>
                        )}

                        {/* Bottom — info & actions */}
                        <div className="mt-auto">
                          {/* Gender pill */}
                          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] backdrop-blur-sm">
                            <div className="h-1.5 w-1.5 rounded-full" style={{ background: personality.hex }} />
                            <span className="text-white/80">
                              {voice.gender} &bull; {personality.description}
                            </span>
                          </div>

                          {/* Voice name */}
                          <h5 className={`font-bold capitalize tracking-tight text-white ${isCenterCard ? "mb-1 text-xl" : "text-base"}`}>
                            {voice.name || voice.voiceId}
                          </h5>

                          {isCenterCard && (
                            <>
                              <p className="mb-3 text-[12px] leading-relaxed text-white/60 line-clamp-2">
                                {personality.personality}
                              </p>

                              {/* Select button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVoiceSelect(voice.voiceId);
                                }}
                                className={`mb-2 w-full rounded-xl py-2.5 text-sm font-bold tracking-wide transition-all duration-200 ${
                                  isSelectedForActive
                                    ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/30"
                                    : "bg-white text-gray-900 hover:bg-white/90"
                                }`}
                              >
                                {isSelectedForActive ? (
                                  <span className="flex items-center justify-center gap-1.5">
                                    Selected
                                    <Check className="h-4 w-4" />
                                  </span>
                                ) : (
                                  `Select as Voice ${activeHostIndex + 1}`
                                )}
                              </button>

                              {/* Preview button */}
                              <button
                                onClick={(e) => handlePreview(voice.voiceId, e)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 py-2 text-xs font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/25 hover:text-white"
                              >
                                {playingVoiceId === voice.voiceId ? (
                                  <>
                                    <Pause className="h-3 w-3" />
                                    <span>Playing...</span>
                                    <WaveformVisualizer isPlaying={true} color="bg-white" />
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-3 w-3" />
                                    <span>Preview Voice</span>
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleCarouselNext}
              className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-400 shadow-lg ring-1 ring-black/5 transition-all hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:ring-white/10 dark:hover:text-white md:right-1"
              aria-label="Next voice"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Voice selection status dots */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs">
            {hosts.slice(0, numHosts).map((host, idx) => {
              const voiceData = voices?.find((v) => v.voiceId === host.voiceId);
              const personality = getPersonality(host.voiceId, voiceData || undefined);
              return (
                <div key={host.id} className="flex items-center gap-2">
                  <span className="text-muted-foreground">Host {idx + 1}:</span>
                  <div
                    className="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      background: host.voiceId ? `${personality.hex}10` : "rgba(0,0,0,0.04)",
                      border: `1px solid ${host.voiceId ? personality.hex + "25" : "rgba(0,0,0,0.06)"}`,
                      color: host.voiceId ? personality.hex : "#9ca3af",
                    }}
                  >
                    {voiceData?.previewImageUrl ? (
                      <img
                        src={voiceData.previewImageUrl}
                        alt=""
                        className="h-4 w-4 rounded-full object-cover"
                      />
                    ) : (
                      <span>{personality.avatar}</span>
                    )}
                    <span className="capitalize">{host.voiceId ? personality.description : "None"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Host Name Inputs */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Host Names
        </label>
        <div className="grid grid-cols-2 gap-3">
          {hosts.slice(0, numHosts).map((host, idx) => (
            <div key={host.id}>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Host {idx + 1}
              </label>
              <input
                type="text"
                value={host.name}
                onChange={(e) => handleNameChange(host.id, e.target.value)}
                placeholder={DEFAULT_HOST_NAMES[idx]}
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 placeholder:text-gray-400 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-gray-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Speech Rate */}
      <SpeechRateSlider value={speechRate} onChange={onSpeechRateChange} />
    </div>
  );
};

export default PodcastHostVoices;
