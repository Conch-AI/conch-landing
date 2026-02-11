"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export type UsageKey =
  | "flashcards"
  | "mindMaps"
  | "condensedNotes"
  | "simplify"
  | "stealth"

type UsageCounts = Record<UsageKey, number>;

const PLAN_LIMITS: UsageCounts = {
  flashcards: 3,
  mindMaps: 3,
  condensedNotes: 3,
  simplify: 3,
  stealth: 5,
};

const DEFAULT_USAGE: UsageCounts = {
  flashcards: 0,
  mindMaps: 0,
  condensedNotes: 0,
  simplify: 0,
  stealth: 0,
};

const GUEST_ID_KEY = "conch_guest_id";
const USAGE_KEY = "conch_guest_usage";

interface AppContextValue {
  guestId: string;
  usage: UsageCounts;
  planLimits: UsageCounts;
  incrementUsage: (feature: UsageKey) => void;
  checkLimit: (feature: UsageKey) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [guestId, setGuestId] = useState("");
  const [usage, setUsage] = useState<UsageCounts>(DEFAULT_USAGE);

  useEffect(() => {
    // Load or create guest ID
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(GUEST_ID_KEY, id);
      localStorage.setItem(USAGE_KEY, JSON.stringify(DEFAULT_USAGE));
    }
    setGuestId(id);

    // Load usage counts
    const stored = localStorage.getItem(USAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<UsageCounts>;
        setUsage({ ...DEFAULT_USAGE, ...parsed });
      } catch {
        setUsage(DEFAULT_USAGE);
      }
    }
  }, []);

  const incrementUsage = useCallback((feature: UsageKey) => {
    console.log("incrementing usage for feature:", feature);
    setUsage((prev) => {
      const updated = { ...prev, [feature]: prev[feature] + 1 };
      localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
      console.log("updated usage:", updated);
      return updated;
    });
  }, []);

  const checkLimit = useCallback(
    (feature: UsageKey): boolean => {
      return usage[feature] < PLAN_LIMITS[feature];
    },
    [usage],
  );

  return (
    <AppContext.Provider value={{ guestId, usage, planLimits: PLAN_LIMITS, incrementUsage, checkLimit }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return ctx;
}
