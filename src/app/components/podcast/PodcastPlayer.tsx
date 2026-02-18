"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Settings,
} from "lucide-react";
import { VOICE_PERSONALITIES, VoiceItem } from "./PodcastHostVoices";

export interface Dialogue {
  hostId: number;
  hostName: string;
  voiceId: string;
  text: string;
  chapterIndex?: number;
  startTime: number;
  endTime: number;
}

export interface Chapter {
  title: string;
  startTime: number;
  endTime: number;
  duration?: number;
  description?: string;
}

export interface PodcastData {
  _id: string;
  title: string;
  language: string;
  mode: string;
  numHosts: number;
  hosts: { id: number; voiceId: string; name: string }[];
  duration: number;
  dialogues: Dialogue[];
  chapters: Chapter[];
  summary: string;
  audioUrl: string;
  thumbnailUrl: string;
  status: string;
}

interface PodcastPlayerProps {
  data: PodcastData;
  onNewPodcast?: () => void;
  onPlayerReady?: (ref: { seekTo: (seconds: number) => void } | null) => void;
  onTimeUpdate?: (seconds: number) => void;
  hideTranscript?: boolean;
  voices?: VoiceItem[];
  className?: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

const PodcastPlayer = ({
  data,
  onNewPodcast,
  onPlayerReady,
  onTimeUpdate,
  hideTranscript,
  voices,
  className = "",
}: PodcastPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(data.duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [seeking, setSeeking] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset playback state when the podcast changes
  useEffect(() => {
    setPlayed(0);
    setDuration(data.duration || 0);
    setPlaying(false);
  }, [data._id, data.duration]);

  // Sync playing state → audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch((err) => {
        console.error("[Player] play() failed:", err);
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [playing]);

  // Sync volume + muted → audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  // Sync playback rate → audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  // Expose seekTo to parent once audio element is available
  useEffect(() => {
    if (!onPlayerReady) return;
    onPlayerReady({
      seekTo: (s: number) => {
        const audio = audioRef.current;
        if (audio) audio.currentTime = s;
      },
    });
    return () => onPlayerReady(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to get voice image URL from voices array
  const getVoiceImage = (voiceId: string): string | null => {
    const voice = voices?.find((v) => v.voiceId === voiceId);
    return voice?.previewImageUrl || null;
  };

  const handlePlayPause = useCallback(() => setPlaying((p) => !p), []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (v > 0) setMuted(false);
  }, []);

  const handleToggleMute = useCallback(() => setMuted((m) => !m), []);

  const handleSeekChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  }, []);

  const handleSeekMouseDown = useCallback(() => setSeeking(true), []);

  const handleSeekMouseUp = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      setSeeking(false);
      const frac = parseFloat((e.target as HTMLInputElement).value);
      const audio = audioRef.current;
      if (audio && audio.duration) {
        audio.currentTime = frac * audio.duration;
      }
    },
    [],
  );

  const handleTimeUpdate = useCallback(() => {
    if (seeking) return;
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setPlayed(audio.currentTime / audio.duration);
    onTimeUpdate?.(audio.currentTime);
  }, [seeking, onTimeUpdate]);

  const handleDurationChange = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    console.log("[Player] Duration:", audio.duration);
    setDuration(audio.duration);
  }, []);

  const handleEnded = useCallback(() => setPlaying(false), []);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.currentTarget;
    console.error("[Player] Audio error:", audio.error?.code, audio.error?.message, "src:", audio.src?.substring(0, 100));
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }, []);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
  }, []);

  const skipBackward = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 15);
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!data.audioUrl) return;
    try {
      const response = await fetch(data.audioUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${data.title || "podcast"}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(data.audioUrl, "_blank");
    }
  }, [data.audioUrl, data.title]);

  return (
    <div className={`relative flex flex-col gap-6 ${className}`}>
      {/* Native audio element — hidden, used for all playback */}
      <audio
        ref={audioRef}
        src={data.audioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
        onError={handleError}
        onCanPlay={() => console.log("[Player] canplay, src:", data.audioUrl?.substring(0, 80))}
        style={{ display: "none" }}
      />

      {/* Player Card */}
      <div className="relative rounded-2xl border border-gray-200/80 bg-white p-5 pb-4 shadow-lg shadow-gray-200/40 dark:border-gray-700/60 dark:bg-[#1a1a1a] dark:shadow-[0_2px_20px_rgba(0,0,0,0.3)] overflow-visible">
        {/* Top: Thumbnail + Metadata */}
        <div className="flex gap-5">
          {/* Thumbnail */}
          {data.thumbnailUrl ? (
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl shadow-md">
              <img src={data.thumbnailUrl} alt={data.title} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 shadow-md">
              <span className="text-4xl">{"\uD83C\uDF99\uFE0F"}</span>
            </div>
          )}

          {/* Metadata */}
          <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
            <div>
              <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground line-clamp-2">
                {data.title || "Your Podcast"}
              </h2>

              {/* Tags */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#6366f1]/8 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#6366f1]">
                  {data.language?.toUpperCase()}
                </span>
                <span className="rounded-full bg-[#6366f1]/8 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#6366f1]">
                  {data.mode}
                </span>
                <span className="rounded-full bg-[#6366f1]/8 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[#6366f1]">
                  {data.hosts?.length || data.numHosts} Host{(data.hosts?.length || data.numHosts) !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Summary */}
              {data.summary && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {data.summary}
                </p>
              )}
            </div>

            {/* Host pills */}
            {data.hosts && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {data.hosts.map((host) => {
                  const personality = VOICE_PERSONALITIES[host.voiceId] || VOICE_PERSONALITIES.echo;
                  const imageUrl = getVoiceImage(host.voiceId);
                  return (
                    <div
                      key={host.id}
                      className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3"
                      style={{
                        background: `${personality.hex}08`,
                        borderColor: `${personality.hex}20`,
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={host.name}
                          className="h-7 w-7 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
                        />
                      ) : (
                        <div
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: personality.hex }}
                        >
                          {(host.name || "H").charAt(0)}
                        </div>
                      )}
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        {host.name || `Host ${host.id}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-gray-100 dark:bg-gray-800" />

        {/* Controls Row */}
        <div className="flex items-center gap-4">
          {/* Play button */}
          <button
            onClick={handlePlayPause}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30 transition-all duration-200 hover:scale-[1.06] hover:bg-[#5558e3] hover:shadow-xl hover:shadow-[#6366f1]/35 active:scale-95"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="h-[18px] w-[18px]" fill="currentColor" />
            ) : (
              <Play className="h-[18px] w-[18px] ml-[2px]" fill="currentColor" />
            )}
          </button>

          {/* Skip buttons */}
          <button
            onClick={skipBackward}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-[#f4f3f8] hover:text-[#6366f1] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            title="-15s"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            onClick={skipForward}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-[#f4f3f8] hover:text-[#6366f1] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            title="+15s"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          <div className="flex-1" />

          {/* Time */}
          <span className="font-mono text-sm tabular-nums text-gray-500 dark:text-gray-400">
            {formatTime(duration * played)}{" "}
            <span className="text-gray-300 dark:text-gray-600">/</span>{" "}
            {formatTime(duration)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 py-2">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="podcast-seek h-[6px] w-full cursor-pointer appearance-none rounded-full block"
            style={{
              background: `linear-gradient(to right, #6366f1 ${played * 100}%, #e2e8f0 ${played * 100}%)`,
            }}
          />
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                  showSpeedMenu
                    ? "bg-[#6366f1]/8 text-[#6366f1]"
                    : "text-gray-500 hover:bg-[#f4f3f8] hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                {playbackRate}x
                <Settings className="h-3 w-3" />
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full left-0 z-10 mb-2 w-24 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                  {SPEEDS.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`block w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-[#f4f3f8] dark:hover:bg-gray-800 ${
                        playbackRate === rate
                          ? "font-bold text-[#6366f1] bg-[#6366f1]/5"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-500 transition-all hover:bg-[#f4f3f8] hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              title="Download Audio"
            >
              <Download className="h-3 w-3" />
              Download
            </button>

            {/* Transcript toggle */}
            {!hideTranscript && data.dialogues && data.dialogues.length > 0 && (
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                  showTranscript
                    ? "bg-[#6366f1] text-white shadow-sm shadow-[#6366f1]/20"
                    : "text-gray-500 hover:bg-[#f4f3f8] hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                Transcript
              </button>
            )}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleMute}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-[#f4f3f8] hover:text-[#6366f1] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white shrink-0"
            >
              {muted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="podcast-seek h-1 w-[60px] cursor-pointer appearance-none rounded-full block"
              style={{
                background: `linear-gradient(to right, #6366f1 ${(muted ? 0 : volume) * 100}%, #e2e8f0 ${(muted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Transcript Section (inline, only when no external transcript) */}
      {!hideTranscript && showTranscript && data.dialogues && data.dialogues.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] dark:border-gray-700/60 dark:bg-[#1a1a1a]">
          <h3 className="text-lg font-bold text-foreground">Transcript</h3>
          <div className="flex flex-col gap-4">
            {data.dialogues.map((dialogue, index) => {
              const host = data.hosts?.find((h) => h.id === dialogue.hostId);
              const hostName = host?.name || dialogue.hostName || `Host ${dialogue.hostId}`;
              const voiceId = host?.voiceId || dialogue.voiceId;
              const personality = VOICE_PERSONALITIES[voiceId] || VOICE_PERSONALITIES.echo;
              const imageUrl = getVoiceImage(voiceId);

              return (
                <div key={index} className="flex gap-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={hostName}
                      className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: personality.hex }}
                    >
                      {hostName.charAt(0)}
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-xs font-bold" style={{ color: personality.hex }}>
                      {hostName}
                    </span>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {dialogue.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New podcast button (only when no external layout) */}
      {onNewPodcast && (
        <button
          onClick={onNewPodcast}
          className="w-full border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl px-5 py-3 text-[13px] font-medium transition-colors dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600"
        >
          Create Another Podcast
        </button>
      )}
    </div>
  );
};

export default PodcastPlayer;
