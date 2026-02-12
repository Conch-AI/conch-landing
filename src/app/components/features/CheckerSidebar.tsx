"use client";

import { Button } from "@/app/ui/button";
import {
  BookOpen,
  Chrome,
  GitBranch,
  Home,
  MessageSquare,
  Shield,
  StickyNote,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type CheckerFeature =
  | "home"
  | "stealth"
  | "simplify"
  | "mindmaps"
  | "flashcards"
  | "notes"
  | "blog"
  | "pricing"
  | "chat";

interface CheckerSidebarProps {
  activeFeature: CheckerFeature;
  onFeatureSelect: (feature: CheckerFeature) => void;
}

const CheckerSidebar = ({
  activeFeature,
  onFeatureSelect,
}: CheckerSidebarProps) => {
  const [wordsUsed] = useState(167);
  const totalWords = 500;
  const progressPercentage = (wordsUsed / totalWords) * 100;

  const navItems: {
    feature: CheckerFeature;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { feature: "home", label: "Home", Icon: Home },
    { feature: "stealth", label: "Stealth Mode", Icon: Shield },
    { feature: "simplify", label: "Simplify", Icon: Shield },
    { feature: "mindmaps", label: "Mindmaps", Icon: GitBranch },
    { feature: "flashcards", label: "Flashcards", Icon: BookOpen },
    { feature: "notes", label: "Notes", Icon: StickyNote },
    { feature: "chat", label: "Chat", Icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen w-[200px] flex-shrink-0 flex-col border-r border-border bg-card px-4 py-5">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 px-1">
        <Image
          src="/images/logos/logo.png"
          width={26}
          height={26}
          alt="Conch"
          className="rounded"
        />
        <span className="text-lg font-semibold text-foreground">Conch</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => {
          const IconComponent = item.Icon;
          return (
            <button
              key={item.feature}
              onClick={() => onFeatureSelect(item.feature)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                activeFeature === item.feature
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <IconComponent
                className={`h-[18px] w-[18px] ${
                  activeFeature === item.feature
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Chrome Extension Link */}
      <div className="mb-4 mt-auto">
        <a
          href="https://chrome.google.com/webstore/detail/conch-ai/namibaeakmnknolcnomfdhklhkabkchl?hl=en&authuser=0"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-emerald-500 transition-colors hover:bg-secondary/50"
        >
          <Chrome className="h-[18px] w-[18px]" />
          <span>Get Chrome Extension</span>
        </a>
      </div>

      {/* Free Plan Section */}
      <div className="rounded-xl border border-border bg-secondary/50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#6366f1]" />
          <span className="text-sm font-medium text-foreground">Free Plan</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-[#6366f1] transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          {wordsUsed}/{totalWords} words used today
        </p>

        {/* Upgrade Button */}
        <Button variant="default" className="w-full" size="sm">
          <Zap className="mr-2 h-4 w-4" />
          Upgrade to Limitless
        </Button>
      </div>
    </div>
  );
};

export default CheckerSidebar;
