"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw, Check } from "lucide-react";

interface PodcastGeneratingProps {
  podcastId: string;
  onComplete: (podcastId: string) => void;
  onError: (message: string) => void;
}

const STEPS = [
  { label: "Analyzing documents", duration: 8000 },
  { label: "Writing script", duration: 12000 },
  { label: "Generating voices", duration: 15000 },
  { label: "Mixing audio", duration: 10000 },
  { label: "Finalizing podcast", duration: 8000 },
];

const TIDBITS = [
  "The average podcast listener subscribes to 7 shows",
  "Listening to conversations activates the same brain regions as real social interaction",
  "There are over 4 million podcasts worldwide — yours is about to join them",
  "Most people listen to podcasts while commuting, exercising, or doing chores",
  "The word 'podcast' was coined in 2004 by journalist Ben Hammersley",
  "Podcast listeners retain 40% more information compared to reading",
  "Audio content creates a sense of intimacy that text can't match",
  "AI-generated podcasts can turn dense documents into engaging conversations",
];

const PodcastGenerating = ({
  podcastId,
  onComplete,
  onError,
}: PodcastGeneratingProps) => {
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tidbitIndex, setTidbitIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tidbitRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stableOnComplete = useCallback(onComplete, []);
  const stableOnError = useCallback(onError, []);

  // Advance steps on their own timers
  useEffect(() => {
    const advanceStep = (stepIndex: number) => {
      if (stepIndex >= STEPS.length - 1) return;
      stepTimeoutRef.current = setTimeout(() => {
        setCurrentStep(stepIndex + 1);
        advanceStep(stepIndex + 1);
      }, STEPS[stepIndex].duration);
    };
    advanceStep(0);

    return () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Rotate through tidbits
    tidbitRef.current = setInterval(() => {
      setTidbitIndex((prev) => (prev + 1) % TIDBITS.length);
    }, 6000);

    // Poll status
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/ai/podcast/status?podcastId=${podcastId}`
        );
        if (!res.ok) throw new Error("Failed to check status");
        const data = await res.json();

        if (data.status === "completed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (tidbitRef.current) clearInterval(tidbitRef.current);
          if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
          setCurrentStep(STEPS.length);
          stableOnComplete(podcastId);
        } else if (data.status === "failed" || data.status === "error") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (tidbitRef.current) clearInterval(tidbitRef.current);
          if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
          const msg =
            data.errorMessage || "Generation failed. Please try again.";
          setError(msg);
          stableOnError(msg);
        }
      } catch {
        // Don't fail on single poll error, keep trying
      }
    };

    intervalRef.current = setInterval(poll, 3000);
    poll();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (tidbitRef.current) clearInterval(tidbitRef.current);
    };
  }, [podcastId, stableOnComplete, stableOnError]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-[16px] font-medium text-foreground mb-2">
          Generation Failed
        </h3>
        <p className="text-[13px] text-muted-foreground mb-6 max-w-sm">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl text-[13px] font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">

      <div className="w-full max-w-xs">
        {/* Steps */}
        <div className="space-y-4 mb-8">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                {/* Indicator */}
                <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="w-5 h-5 rounded-full bg-[#6366f1] flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#6366f1] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-700" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[14px] transition-colors ${
                    isDone
                      ? "text-foreground"
                      : isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground/50"
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Divider — aligned with step labels */}
        <div className="pl-8 mb-5">
          <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Rotating tidbits — aligned with step labels */}
        <div className="pl-8 h-12 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={tidbitIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="text-[13px] leading-relaxed text-muted-foreground"
            >
              {TIDBITS[tidbitIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PodcastGenerating;
