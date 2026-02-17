"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

interface PodcastGeneratingProps {
  podcastId: string;
  onComplete: (podcastId: string) => void;
  onError: (message: string) => void;
}

const STEPS = [
  "Analyzing your documents...",
  "Writing the podcast script...",
  "Generating voice audio...",
  "Mixing and mastering...",
  "Finalizing your podcast...",
];

const PodcastGenerating = ({ podcastId, onComplete, onError }: PodcastGeneratingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Animate through steps
    stepIntervalRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 8000);

    // Poll status
    const poll = async () => {
      try {
        const res = await fetch(`/api/ai/podcast/status?podcastId=${podcastId}`);
        if (!res.ok) throw new Error("Failed to check status");
        const data = await res.json();

        if (data.status === "completed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
          onComplete(podcastId);
        } else if (data.status === "failed" || data.status === "error") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
          const msg = data.errorMessage || "Generation failed. Please try again.";
          setError(msg);
          onError(msg);
        }
      } catch {
        // Don't fail on single poll error, keep trying
      }
    };

    intervalRef.current = setInterval(poll, 3000);
    poll(); // initial check

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [podcastId, onComplete, onError]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-[16px] font-medium text-foreground mb-2">Generation Failed</h3>
        <p className="text-[13px] text-muted-foreground mb-6 max-w-sm">{error}</p>
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
    <div className="flex flex-col items-center justify-center px-6 py-16">
      {/* Animated podcast wave */}
      <div className="flex items-end gap-1 h-12 mb-8">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-[#6366f1] to-[#8b5cf6]"
            animate={{
              height: [12, 28 + Math.random() * 20, 12],
            }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <h3 className="text-[18px] font-medium text-foreground mb-2">Creating your podcast</h3>
      <p className="text-[13px] text-muted-foreground mb-8">This usually takes 1-3 minutes</p>

      {/* Steps progress */}
      <div className="w-full max-w-xs space-y-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: i <= currentStep ? 1 : 0.3,
            }}
            className="flex items-center gap-3"
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                i < currentStep
                  ? "bg-[#6366f1] text-white"
                  : i === currentStep
                  ? "border-2 border-[#6366f1]"
                  : "border-2 border-gray-200"
              }`}
            >
              {i < currentStep && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {i === currentStep && (
                <div className="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse" />
              )}
            </div>
            <span
              className={`text-[12px] ${
                i <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {step}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PodcastGenerating;
