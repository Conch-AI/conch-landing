"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { VOICE_MAP } from "./PodcastHostVoices";

interface Dialogue {
  hostId: number;
  hostName: string;
  voiceId: string;
  text: string;
}

interface Chapter {
  title: string;
  startTime: number;
  endTime: number;
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
  onNewPodcast: () => void;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

const PodcastPlayer = ({ data, onNewPodcast }: PodcastPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(data.duration || 0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    const audio = new Audio(data.audioUrl);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [data.audioUrl]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const changeSpeed = (s: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = s;
    setSpeed(s);
    setShowSpeedMenu(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const v = parseFloat(e.target.value);
    audioRef.current.volume = v;
    setVolume(v);
    if (v === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const downloadAudio = () => {
    const a = document.createElement("a");
    a.href = data.audioUrl;
    a.download = `${data.title || "podcast"}.mp3`;
    a.click();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      {/* Podcast info */}
      <div className="text-center mb-6">
        <h3 className="text-[18px] font-medium text-foreground mb-1">{data.title || "Your Podcast"}</h3>
        <div className="flex items-center justify-center gap-3 text-[12px] text-muted-foreground">
          <span>{data.mode}</span>
          <span>-</span>
          <span>{data.numHosts} {data.numHosts === 1 ? "host" : "hosts"}</span>
          <span>-</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Waveform / progress */}
      <div
        ref={progressRef}
        className="relative h-2 bg-gray-100 rounded-full cursor-pointer mb-2 group"
        onClick={seekTo}
      >
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[#6366f1] rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground mb-6">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={() => skip(-15)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <SkipBack className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-[#6366f1] hover:bg-[#5558e3] text-white flex items-center justify-center shadow-lg transition-colors"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>
        <button onClick={() => skip(15)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <SkipForward className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Secondary controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Volume */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-gray-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={changeVolume}
            className="w-20 h-1 accent-[#6366f1]"
          />
        </div>

        {/* Speed */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {speed}x
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSpeedMenu && (
            <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`block w-full text-left px-4 py-2 text-[12px] hover:bg-gray-50 transition-colors ${
                    speed === s ? "text-[#6366f1] font-medium" : "text-gray-600"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Download + Transcript toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`p-1.5 rounded-lg transition-colors ${
              showTranscript ? "bg-[#6366f1]/10 text-[#6366f1]" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={downloadAudio}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chapters */}
      {data.chapters && data.chapters.length > 0 && (
        <div className="mb-6">
          <h4 className="text-[12px] font-medium text-foreground mb-2.5">Chapters</h4>
          <div className="flex flex-wrap gap-1.5">
            {data.chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = ch.startTime;
                    if (!isPlaying) {
                      audioRef.current.play();
                      setIsPlaying(true);
                    }
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] border transition-colors ${
                  currentTime >= ch.startTime && currentTime < ch.endTime
                    ? "border-[#6366f1] bg-[#6366f1]/5 text-[#6366f1] font-medium"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {ch.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Transcript */}
      {showTranscript && data.dialogues && data.dialogues.length > 0 && (
        <div className="border-t border-gray-100 pt-4 max-h-[300px] overflow-y-auto space-y-3">
          <h4 className="text-[12px] font-medium text-foreground mb-2">Transcript</h4>
          {data.dialogues.map((d, i) => {
            const voice = VOICE_MAP[d.voiceId];
            return (
              <div key={i} className="flex gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg ${voice?.color || "bg-gray-400"} flex items-center justify-center text-xs shrink-0 mt-0.5`}
                >
                  {voice?.avatar || "🎵"}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-foreground mb-0.5">{d.hostName}</p>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{d.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {data.summary && !showTranscript && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="text-[12px] font-medium text-foreground mb-1.5">Summary</h4>
          <p className="text-[12px] text-muted-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* New podcast */}
      <button
        onClick={onNewPodcast}
        className="w-full mt-6 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl px-5 py-3 text-[13px] font-medium transition-colors"
      >
        Create Another Podcast
      </button>
    </div>
  );
};

export default PodcastPlayer;
