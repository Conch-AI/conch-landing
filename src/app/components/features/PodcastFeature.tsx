"use client";

import Footer from "@/app/components/ui/Footer";
import { CheckerFeature } from "./CheckerSidebar";
import { useCallback, useEffect, useRef, useState } from "react";
import SignupModal from "../SignupModal";
import { useAppContext } from "@/context/AppContext";
import { Session } from "@/context/SessionContext";
import PodcastUploadArea from "../podcast/PodcastUploadArea";
import PodcastConfigPanel, { PodcastConfig } from "../podcast/PodcastConfigPanel";
import PodcastGenerating from "../podcast/PodcastGenerating";
import PodcastPlayer, { PodcastData } from "../podcast/PodcastPlayer";
import PodcastContent from "../podcast/PodcastContent";
import { VOICE_PERSONALITIES, VoiceItem } from "../podcast/PodcastHostVoices";

interface PodcastFeatureProps {
  onFeatureSelect?: (feature: CheckerFeature) => void;
  session?: Session;
  handleLoggedIn?: () => void;
}

interface SourceFile {
  name: string;
  content: string;
}

type View = "upload" | "configure" | "generating" | "playing";

const STEP_LABELS = ["Upload", "Configure", "Generate", "Listen"];

const DEFAULT_CONFIG: PodcastConfig = {
  numHosts: 2,
  hosts: [
    { id: 1, name: "Alex", voiceId: "echo" },
    { id: 2, name: "Morgan", voiceId: "nova" },
  ],
  language: "en",
  mode: "Conversational",
  speechRate: 1.0,
  targetDuration: 5,
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* -- Playing View (2-column layout with chat-bubble transcript) -- */
const PlayingView = ({
  data,
  voices,
  onShowSignup,
}: {
  data: PodcastData;
  voices?: VoiceItem[];
  onShowSignup?: () => void;
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [playerApi, setPlayerApi] = useState<{ seekTo: (s: number) => void } | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always use full dialogues, but check if content is limited
  const hasDialogues = data.dialogues && data.dialogues.length > 0;
  const hasLimitedContent = !!(data.limitedDialogues && data.dialogues && data.limitedDialogues.length < data.dialogues.length);
  const limitedCount = hasLimitedContent ? data.limitedDialogues!.length : data.dialogues.length;
  
  // Calculate total duration including dummy time for extra dialogues (10 seconds each)
  const extraDialoguesCount = hasLimitedContent ? data.dialogues.length - data.limitedDialogues!.length : 0;
  const totalDurationWithExtras = data.duration + (extraDialoguesCount * 10);

  console.log("totalDurationWithExtras", totalDurationWithExtras,data);
  
  // Create modified data object with updated duration for the player
  const playerData = {
    ...data,
    dummyDuration: totalDurationWithExtras
  };

  // Helper to get voice image URL
  const getVoiceImage = (voiceId: string): string | null => {
    const voice = voices?.find((v) => v.voiceId === voiceId);
    return voice?.previewImageUrl || null;
  };

  // Find the currently-active dialogue index based on playback time
  const activeIdx = (data.dialogues ?? []).findIndex((d, i) => {
    const next = data.dialogues[i + 1];
    return currentTime >= d.startTime && (next ? currentTime < next.startTime : true);
  });

  // Build a host-side map: assign each unique hostId to left or right
  const hostSideMap = useRef(new Map<number, "left" | "right">()).current;
  (data.dialogues ?? []).forEach((d) => {
    if (!hostSideMap.has(d.hostId)) {
      hostSideMap.set(d.hostId, hostSideMap.size % 2 === 0 ? "left" : "right");
    }
  });

  // Auto-scroll to the active dialogue
  useEffect(() => {
    if (userScrolledRef.current) return;
    if (activeRef.current && transcriptRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIdx]);

  // Detect manual scroll -> pause auto-scroll for 4s
  const handleTranscriptScroll = useCallback(() => {
    userScrolledRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      userScrolledRef.current = false;
    }, 4000);
  }, []);

  const handleSeekTo = (seconds: number) => {
    playerApi?.seekTo(seconds);
  };

  const seekToChapter = (timestamp: number) => {
    playerApi?.seekTo(timestamp);
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 py-6">

      <div className="mx-auto max-w-5xl">
        <div className={`grid gap-6 ${hasDialogues ? "grid-cols-1 lg:grid-cols-[380px_1fr]" : "grid-cols-1 max-w-3xl mx-auto"}`}>
          {/* Left column: Sticky player + chapters */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <PodcastPlayer
              data={playerData}
              onPlayerReady={setPlayerApi}
              onTimeUpdate={setCurrentTime}
              hideTranscript={hasDialogues}
              voices={voices}
            />

            {/* Chapters panel */}
            {data.chapters && data.chapters.length > 0 && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                <h4 className="text-sm font-semibold text-foreground mb-3">Chapters</h4>
                <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto pr-1">
                  {data.chapters.map((chapter, idx) => {
                    const isActive = currentTime >= chapter.startTime && currentTime < chapter.endTime;
                    return (
                      <button
                        key={idx}
                        onClick={() => seekToChapter(chapter.startTime)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 text-sm border ${
                          isActive
                            ? "bg-[#6366f1]/5 border-[#6366f1]/20 shadow-sm"
                            : "border-transparent hover:bg-[#f4f3f8] dark:hover:bg-gray-800"
                        }`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          isActive ? "bg-[#6366f1] text-white shadow-sm shadow-[#6366f1]/25" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className={`flex-1 truncate font-medium transition-colors ${
                          isActive ? "text-[#6366f1]" : "text-foreground"
                        }`}>
                          {chapter.title}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                          {formatTime(chapter.startTime)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Chat-bubble transcript */}
          {hasDialogues && (
            <div
              ref={transcriptRef}
              onScroll={handleTranscriptScroll}
              className="rounded-xl border border-gray-200 bg-white overflow-y-auto lg:max-h-[calc(100vh-120px)] dark:border-gray-700 dark:bg-gray-900"
            >
              {/* Transcript header */}
              <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-semibold text-foreground">Transcript</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.dialogues.length} dialogue segments · Click to jump
                </p>
                
                {/* Full podcast message for limited content */}
                {hasLimitedContent && (
                    <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors relative z-20"
                    onClick={() => onShowSignup?.()}
                  >
                    <svg 
                      className="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                      />
                    </svg>
                    <span>Hear the full podcast ({formatTime(totalDurationWithExtras)}) - Click here</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4 md:p-5">
                {data.dialogues.map((dialogue, index) => {
                  const host = data.hosts?.find((h) => h.id === dialogue.hostId);
                  const hostName = host?.name || dialogue.hostName || `Host ${dialogue.hostId}`;
                  const voiceId = host?.voiceId || dialogue.voiceId;
                  const personality = VOICE_PERSONALITIES[voiceId] || VOICE_PERSONALITIES.echo;
                  const imageUrl = getVoiceImage(voiceId);
                  const side = hostSideMap.get(dialogue.hostId) ?? "left";
                  const isActive = index === activeIdx;
                  const isLimited = hasLimitedContent && index >= limitedCount;

                  return (
                    <div
                      key={index}
                      ref={isActive ? activeRef : undefined}
                      onClick={() => {
                        if (isLimited) {
                          onShowSignup?.();
                        } else {
                          handleSeekTo(dialogue.startTime);
                        }
                      }}
                      className={`flex gap-3 cursor-pointer transition-all duration-300 max-w-[88%] relative ${
                        side === "right" ? "ml-auto flex-row-reverse" : ""
                      } ${isActive && !isLimited ? "scale-[1.01]" : ""} ${
                        !isLimited ? (isActive ? "opacity-100" : "opacity-70 hover:opacity-100") : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div className="shrink-0 pt-1">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={hostName}
                            className="h-9 w-9 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                            style={{ background: personality.hex }}
                          >
                            {hostName.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Bubble */}
                      <div className={`flex flex-col gap-1 ${side === "right" ? "items-end" : ""} relative flex-1`}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: personality.hex }}>
                            {hostName}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {isLimited ? "" : formatTime(dialogue.startTime)}
                          </span>
                        </div>
                        <div
                          className={`rounded-2xl border px-4 py-2.5 text-sm leading-relaxed transition-all relative ${
                            side === "right" ? "rounded-tr-sm" : "rounded-tl-sm"
                          } ${
                            isActive && !isLimited
                              ? "bg-[#6366f1]/5 border-[#6366f1]/20 shadow-sm"
                              : "bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-700/40"
                          }`}
                        >
                          <p className="text-gray-800 dark:text-gray-200">{dialogue.text}</p>
                          
                          {/* Blur overlay for limited content */}
                          {isLimited && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-transparent backdrop-blur-[5px] ">
                              <div className="flex flex-col items-center gap-2 px-4">
                                {/* <svg 
                                  className="h-5 w-5 text-[#6366f1]" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor" 
                                  strokeWidth={2}
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                                  />
                                </svg> */}
                                {/* <span className="text-xs font-medium text-[#6366f1]">Sign up to view</span> */}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -- Main PodcastFeature Component -- */
const PodcastFeature = ({ onFeatureSelect }: PodcastFeatureProps) => {
  const { checkLimit, incrementUsage, guestId } = useAppContext();
  const [sourceFiles, setSourceFiles] = useState<SourceFile[]>([]);
  const [config, setConfig] = useState<PodcastConfig>(DEFAULT_CONFIG);
  const [view, setView] = useState<View>("upload");
  const [podcastId, setPodcastId] = useState<string | null>(null);
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [voices, setVoices] = useState<VoiceItem[]>([]);
  const [previewVoiceId, setPreviewVoiceId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const currentStep = view === "upload" ? 0 : view === "configure" ? 1 : view === "generating" ? 2 : 3;

//testing
  // useEffect(() => {
  //   if (!podcastId) return;
    
  //   const fetchPodcast = async () => {
  //     try {
  //       const res = await fetch(`/api/ai/podcast/get?podcastId=${podcastId}`);
  //       if (!res.ok) throw new Error("Failed to fetch podcast");
  //       const data = await res.json();
  //       console.log("[Podcast] Fetched podcast data:", data);
  //       setPodcastData(data as PodcastData);
  //       setView("playing");
  //     } catch (error) {
  //       console.error("Error fetching podcast:", error);
  //     }
  //   };
  //   fetchPodcast();
  // }, [podcastId]);

  // Fetch voices from API on mount
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await fetch("/api/ai/podcast/voices?includePreviews=true");
        if (!res.ok) throw new Error("Failed to fetch voices");
        const data = await res.json();
        setVoices(data.voices || []);
      } catch (err) {
        console.error("Error fetching voices:", err);
      }
    };
    fetchVoices();
  }, []);

  // Initialize preview audio element
  useEffect(() => {
    const audio = new Audio();
    previewAudioRef.current = audio;
    audio.onended = () => setPreviewVoiceId(null);
    audio.onerror = () => setPreviewVoiceId(null);
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const handleVoicePreview = useCallback((voiceId: string, previewUrl?: string | null) => {
    const audio = previewAudioRef.current;
    if (!audio) return;

    // Toggle off if same voice
    if (previewVoiceId === voiceId) {
      audio.pause();
      audio.currentTime = 0;
      setPreviewVoiceId(null);
      return;
    }

    // Stop any playing audio
    audio.pause();
    audio.currentTime = 0;

    const src = previewUrl || `/api/ai/podcast/voice-sample?voiceId=${voiceId}`;
    audio.src = src;
    setPreviewVoiceId(voiceId);
    audio.play().catch(() => setPreviewVoiceId(null));
  }, [previewVoiceId]);

  const handleFilesReady = (files: SourceFile[]) => {
    setSourceFiles(files);
    setView("configure");
  };

  const handleGenerate = async () => {
    // if (session?.isLoggedIn) {
    //   handleLoggedIn();
    //   return;
    // }

    if (!checkLimit("podcast")) {
      setShowSignupModal(true);
      return;
    }

    setIsGenerating(true);
    try {
      const content = sourceFiles.map((f) => f.content).join("\n\n---\n\n");
      const res = await fetch("/api/ai/podcast/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          language: config.language,
          numHosts: config.numHosts,
          hosts: config.hosts,
          mode: config.mode,
          targetDuration: config.targetDuration,
          speechRate: config.speechRate,
          guestId,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to create podcast" }));
        throw new Error(data.error);
      }

      const data = await res.json();
      console.log("[Podcast] Created, podcastId:", data.podcastId);
      setPodcastId(data.podcastId);
      setView("generating");
    } catch (error) {
      console.error("Generate error:", error);
      alert(error instanceof Error ? error.message : "Failed to start generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerationComplete = useCallback(async (id: string) => {
    console.log("[Podcast] Generation complete, podcastId:", id);
    try {
      const res = await fetch(`/api/ai/podcast/get?podcastId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch podcast");
      const data = await res.json();
      console.log("[Podcast] Fetched podcast data:", { id: data._id, title: data.title, audioUrl: data.audioUrl, status: data.status });
      setPodcastData(data);
      incrementUsage("podcast");
      setView("playing");
    } catch (error) {
      console.error("[Podcast] Fetch podcast error:", error);
    }
  }, [incrementUsage]);

  // Playing view breaks out of the card container for full-width layout
  if (view === "playing" && podcastData) {
    return (
      <div className="min-h-full bg-background text-foreground overflow-y-auto">
        <PlayingView 
          data={podcastData} 
          voices={voices} 
          onShowSignup={() => setShowSignupModal(true)}
        />

        <PodcastContent
          voices={voices}
          previewVoiceId={previewVoiceId}
          onVoicePreview={handleVoicePreview}
        />

        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          content="You've reached your free podcast limit. Sign up for Conch to continue creating podcasts from your documents."
        />

        <Footer onFeatureSelect={onFeatureSelect as (feature: CheckerFeature) => void} />
      </div>
    );
  }

  // Configure view — full-page layout, not inside a card
  if (view === "configure") {
    const contentLength = sourceFiles.reduce((sum, f) => sum + f.content.length, 0);
    return (
      <div className="min-h-full bg-background text-foreground overflow-y-auto">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-5xl">
            {/* Header with back + title + generate */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView("upload")}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:text-foreground dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-foreground leading-tight">Configure Podcast</h1>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    {sourceFiles.length} file{sourceFiles.length !== 1 ? "s" : ""} uploaded · Customize your podcast settings
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="hidden sm:flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-50 text-white rounded-xl px-5 py-2.5 text-[14px] font-medium transition-all shadow-sm shadow-[#6366f1]/20"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Podcast"
                )}
              </button>
            </div>

            {/* Step breadcrumb */}
            <div className="flex items-center gap-1.5 mb-8 text-[12px]">
              {STEP_LABELS.map((label, i) => (
                <span key={label} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
                  <span className={i === currentStep ? "text-[#6366f1] font-medium" : i < currentStep ? "text-foreground" : "text-muted-foreground/50"}>
                    {label}
                  </span>
                </span>
              ))}
            </div>

            {/* Config content — full width, no card wrapping */}
            <PodcastConfigPanel
              config={config}
              onConfigChange={setConfig}
              onGenerate={handleGenerate}
              contentLength={contentLength}
              isGenerating={isGenerating}
              initialVoices={voices}
            />
          </div>
        </div>

        <PodcastContent
          voices={voices}
          previewVoiceId={previewVoiceId}
          onVoicePreview={handleVoicePreview}
        />

        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          content="You've reached your free podcast limit. Sign up for Conch to continue creating podcasts from your documents."
        />

        <Footer onFeatureSelect={onFeatureSelect as (feature: CheckerFeature) => void} />
      </div>
    );
  }

  // Generating view — full-page layout
  if (view === "generating" && podcastId) {
    return (
      <div className="min-h-full bg-background text-foreground overflow-y-auto">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-lg md:text-xl font-semibold text-foreground leading-tight">Generating Podcast</h1>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Your podcast is being created. This usually takes 1 minute.
              </p>
            </div>

            {/* Step breadcrumb */}
            <div className="flex items-center gap-1.5 mb-8 text-[12px]">
              {STEP_LABELS.map((label, i) => (
                <span key={label} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
                  <span className={i === currentStep ? "text-[#6366f1] font-medium" : i < currentStep ? "text-foreground" : "text-muted-foreground/50"}>
                    {label}
                  </span>
                </span>
              ))}
            </div>

            <PodcastGenerating
              podcastId={podcastId}
              onComplete={handleGenerationComplete}
              onError={() => {}}
            />
          </div>
        </div>

        <PodcastContent
          voices={voices}
          previewVoiceId={previewVoiceId}
          onVoicePreview={handleVoicePreview}
        />

        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          content="You've reached your free podcast limit. Sign up for Conch to continue creating podcasts from your documents."
        />

        <Footer onFeatureSelect={onFeatureSelect as (feature: CheckerFeature) => void} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto px-4 md:px-6">
      {/* Compact hero headline */}
      <section className="pt-4 sm:pt-6 md:pt-7 pb-3 md:pb-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center" ref={topRef}>
          <h1 className="text-xl sm:text-2xl md:text-[36px] font-semibold tracking-tight mb-2 md:mb-3 text-foreground leading-tight">
            Turn your documents into <span className="">podcasts</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-[14px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload any document and let AI transform it into an engaging podcast with multiple hosts, natural voices, and chapter markers.
          </p>
        </div>
      </section>

      {/* Main Card — upload only */}
      <section className="px-4 md:px-8 pb-10 md:pb-14">
        <div className="max-w-5xl mx-auto relative">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl md:rounded-[20px] border border-gray-200 dark:border-gray-700 shadow-lg shadow-gray-100/60 dark:shadow-none overflow-hidden flex flex-col min-h-[420px]">
            {/* Step indicator */}
            <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <div className={`w-8 h-px transition-colors ${i <= currentStep ? "bg-[#6366f1]/40" : "bg-gray-200 dark:bg-gray-700"}`} />
                  )}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-300 ${
                        i === currentStep
                          ? "border-2 border-[#6366f1] text-[#6366f1] bg-[#6366f1]/5"
                          : "border border-gray-200 dark:border-gray-700 text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-[11px] hidden sm:inline transition-colors ${
                        i === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <PodcastUploadArea onFilesReady={handleFilesReady} isUploading={false} />
          </div>
        </div>
      </section>

      <PodcastContent
        voices={voices}
        previewVoiceId={previewVoiceId}
        onVoicePreview={handleVoicePreview}
        onScrollToTop={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        content="You've reached your free podcast limit. Sign up for Conch to continue creating podcasts from your documents."
      />

      <Footer onFeatureSelect={onFeatureSelect as (feature: CheckerFeature) => void} />
    </div>
  );
};

export default PodcastFeature;
