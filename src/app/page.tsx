"use client";

import FlashcardsFeature from "@/app/components/features/FlashcardsFeature";
import HomeFeature from "@/app/components/features/HomeFeature";
import MindmapsFeature from "@/app/components/features/MindmapsFeature";
import NotesFeature from "@/app/components/features/NotesFeature";
import SimplifyFeature from "@/app/components/features/SimplifyFeature";
import StealthFeature from "@/app/components/features/StealthFeature";
import { Button } from "@/app/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Layers,
  Lightbulb,
  Moon,
  Shield,
  Sun,
  Wand2,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FeatureType = "home" | "stealth" | "simplify" | "mindmaps" | "flashcards" | "notes" | "chat";

const navigation = [
  { name: "Simplify", feature: "simplify" as FeatureType, icon: Wand2 },
  { name: "Stealth Mode", feature: "stealth" as FeatureType, icon: Shield },
  { name: "Mindmaps", feature: "mindmaps" as FeatureType, icon: Lightbulb },
  { name: "Flashcards", feature: "flashcards" as FeatureType, icon: Layers },
  { name: "Notes", feature: "notes" as FeatureType, icon: FileText },
];

// Placeholder components for features not yet implemented
const ComingSoonFeature = ({ featureName }: { featureName: string }) => (
  <div className="flex h-full flex-col items-center justify-center bg-background text-foreground">
    <div className="text-center">
      <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        COMING SOON
      </span>
      <h1 className="mb-4 text-3xl font-bold">{featureName}</h1>
      <p className="text-base text-muted-foreground">
        This feature is coming soon. Stay tuned!
      </p>
    </div>
  </div>
);

const CheckerPage = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureType>("home");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("checker-theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("checker-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case "home":
        return (
          <HomeFeature
            onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)}
          />
        );
      case "simplify":
        return <SimplifyFeature />;
      case "stealth":
        return <StealthFeature />;
      case "mindmaps":
        return <MindmapsFeature />;
      case "flashcards":
        return <FlashcardsFeature />;
      case "notes":
        return <NotesFeature />;
      case "chat":
        return <ComingSoonFeature featureName="Chat" />;
      default:
        return (
          <HomeFeature
            onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden bg-[#f4f3f8]">
          {/* Sidebar */}
          <div
            className={cn(
              "flex flex-col h-full bg-[#f4f3f8] dark:bg-[#1a1a1a] text-sidebar-foreground transition-all duration-300 rounded-tl-3xl",
              isCollapsed ? "w-16" : "w-44"
            )}
          >
            <div className="p-6 flex items-center justify-between">
              {!isCollapsed && (
                <div 
                  onClick={() => setActiveFeature("home")}
                  className="flex items-center gap-2 font-bold text-xl text-foreground cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Image
                      alt="Logo"
                      src={
                        "https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                      }
                      width={32}
                      height={32}
                    />
                  </div>
                  <span className="text-gray-900 dark:text-white">Conch</span>
                </div>
              )}
              {isCollapsed && (
                <div 
                  onClick={() => setActiveFeature("home")}
                  className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    alt="Logo"
                    src={
                      "https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                    }
                    width={32}
                    height={32}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              <nav className="px-3 space-y-3">
                {navigation.map((item) => {
                  const isActive = activeFeature === item.feature;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveFeature(item.feature)}
                      className={cn(
                        "group w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all text-left relative",
                        isActive
                          ? "bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white font-semibold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10 font-normal"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6366f1] rounded-r-full" />
                      )}
                      <item.icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-colors relative z-10",
                          isActive
                            ? "text-[#6366f1] dark:text-[#6366f1]"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-[#6366f1]"
                        )}
                      />
                      {!isCollapsed && (
                        <span className={cn(
                          "relative z-10 transition-colors",
                          isActive
                            ? "text-[#6366f1] dark:text-[#6366f1]"
                            : "group-hover:text-[#6366f1]"
                        )}>
                          {item.name}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
{/* 
            {!isCollapsed && (
              <div className="p-4 pb-6">
                <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      Free Plan
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full w-1/3 bg-purple-600 dark:bg-purple-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    167/500 words used today
                  </p>
                  <Button
                    onClick={() => router.push("/pricing")}
                    className="w-full bg-[#6366f1] hover:bg-[#5558e3] text-white text-xs font-medium h-9 rounded-lg"
                  >
                    <Zap className="w-3 h-3 mr-1.5" />
                    Upgrade to Limitless
                  </Button>
                </div>
              </div>
            )} */}

            {isCollapsed && (
              <div className="p-2 pb-4">
                <Button
                  onClick={() => router.push("/pricing")}
                  size="icon"
                  className="w-full bg-[#6366f1] hover:bg-[#5558e3] text-white"
                >
                  <Zap className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <header className="flex h-16 items-center justify-between bg-[#f4f3f8] dark:bg-[#1a1a1a] px-8 shrink-0">
              <div className="flex items-center gap-8">
                <span onClick={() => router.push("/pricing")} className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#6366f1] cursor-pointer transition-colors">
                  Pricing
                </span>
                <span
                  onClick={() => router.push("/blog")}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#6366f1] cursor-pointer transition-colors"
                >
                  Blog
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  className=""
                >
                  Sign In
                </Button>
                <Button variant="default" className="">
                  Get Started Free
                </Button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto dark:bg-[#1a1a1a]  rounded-3xl">
              {renderFeature()}
            </main>
          </div>
        </div>
      </div>
  );
};

export default CheckerPage;
