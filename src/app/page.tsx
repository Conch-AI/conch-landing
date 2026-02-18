"use client";

import FlashcardsFeature from "@/app/components/features/FlashcardsFeature";
import HomeFeature from "@/app/components/features/HomeFeature";
import MindmapsFeature from "@/app/components/features/MindmapsFeature";
import NotesFeature from "@/app/components/features/NotesFeature";
import SimplifyFeature from "@/app/components/features/SimplifyFeature";
import StealthFeature from "@/app/components/features/StealthFeature";
import PricingFeature from "@/app/components/features/PricingFeature";
import { Button } from "@/app/ui/button";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/context/SessionContext";
import FeatureNavbar, { FeatureType, navigation } from "./components/FeatureNavbar";
import { API_BASE_URL } from "@/config";
import { usePageTracking } from "@/hooks/useAnalytics";

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
  const { session } = useSession();
  console.log("session", session);
  const mainContentRef = useRef<HTMLElement>(null);
  const [isDarkMode] = useState(false);
  const [isCollapsed] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureType>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLoggedIn() {
    if (session?.isLoggedIn) {
      router.push(API_BASE_URL);
    }
  }

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("checker-theme", "light");
  }, [isDarkMode]);

  

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [activeFeature]);

  // Track page view with optimized Next.js analytics
  usePageTracking("/");

  const renderFeature = () => {
    switch (activeFeature) {
      case "home":
        return (
          <HomeFeature
            onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)}
          />
        );
      case "simplify":
        return <SimplifyFeature session={session!} handleLoggedIn={handleLoggedIn} onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)} />;
      case "stealth":
        return <StealthFeature session={session!} handleLoggedIn={handleLoggedIn} onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)} />;
      case "mindmaps":
        return <MindmapsFeature session={session!} handleLoggedIn={handleLoggedIn} onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)} />;
      case "flashcards":
        return <FlashcardsFeature session={session!} handleLoggedIn={handleLoggedIn} onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)} />;
      case "notes":
        return <NotesFeature session={session!} handleLoggedIn={handleLoggedIn} onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)} />
      case "pricing":
        return <PricingFeature onFeatureSelect={(feature) => setActiveFeature(feature as FeatureType)} />;
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
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-[#f4f3f8]">
        <div
          className={cn(
            "hidden md:flex flex-col h-full bg-[#f4f3f8] text-sidebar-foreground transition-all duration-300 rounded-tl-3xl",
            isCollapsed ? "w-12" : "w-24"
          )}
        >
          <div className="p-4 flex items-center justify-center">
            <div
              onClick={() => setActiveFeature("home")}
              className="flex items-center gap-1.5 font-bold text-lg text-foreground cursor-pointer hover:opacity-80 transition-opacity pl-4 z-50"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center">
                <Image
                  alt="Logo"
                  src={
                    "https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                  }
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
              </div>
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">Conch</span>
            </div>
          </div>

          <FeatureNavbar activeFeature={activeFeature} setActiveFeature={setActiveFeature} />

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

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="md:hidden bg-[#f4f3f8] px-3 py-3 flex items-center justify-between shrink-0 border-b border-gray-200/50 relative">
            <div
              onClick={() => setActiveFeature("home")}
              className="flex items-center gap-1.5 font-bold text-base text-foreground cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                <Image
                  alt="Logo"
                  src={
                    "https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                  }
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">Conch</span>
            </div>

            <div className="flex items-center gap-2 relative">
              <span onClick={() => setActiveFeature("pricing")} className="hidden md:block text-[13px] text-gray-600 hover:text-[#6366f1] cursor-pointer transition-colors">
                Pricing
              </span>
              <span onClick={() => router.push("/blogs")} className="hidden md:block text-[13px] text-gray-600 hover:text-[#6366f1] cursor-pointer transition-colors">
                Blog
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-8 w-8"
              >
                {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </Button>

              {mobileMenuOpen && (
                <div className="absolute top-full right-0 mt-1 z-50 bg-white rounded-xl border border-border shadow-lg p-3 flex flex-col gap-2 min-w-[200px]">
                {session?.isLoggedIn && (
                  <div className="flex flex-col gap-1 pb-2 border-b border-gray-100 mb-1">
                    <div className="flex items-center gap-2 px-2">

                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-xs border border-gray-200">
                        {session.displayName?.charAt(0) || session.email?.charAt(0) || "U"}
                      </div>

                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-sm text-gray-900 truncate">{session.displayName}</span>
                        <span className="text-xs text-gray-500 truncate">{session.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => { setActiveFeature("pricing"); setMobileMenuOpen(false); }}
                    className="text-left px-3 py-2 text-[13px] text-gray-600 hover:text-[#6366f1] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => { router.push("/blogs"); setMobileMenuOpen(false); }}
                    className="text-left px-3 py-2 text-[13px] text-gray-600 hover:text-[#6366f1] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Blog
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-100 pt-2 mt-1">
                  {session?.isLoggedIn ? (
                    <Button
                      variant="default"
                      className="text-[13px] h-9 w-full bg-primary hover:opacity-90 shadow-sm"
                      onClick={() => { router.push(API_BASE_URL); setMobileMenuOpen(false); }}
                    >
                      Go to App
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      className="text-[13px] h-9 w-full" 
                      onClick={() => { setActiveFeature("pricing"); setMobileMenuOpen(false); }}
                    >
                      Upgrade Now
                    </Button>
                  )}
                </div>
                </div>
              )}
            </div>
          </header>

          <header className="hidden md:flex h-14 items-center justify-between bg-[#f4f3f8] px-7 shrink-0">
            <div className="flex items-center gap-7 pl-5 text-[13.5px]">
              <span onClick={() => setActiveFeature("pricing")} className=" text-gray-600 hover:text-[#6366f1] cursor-pointer transition-colors">
                Pricing
              </span>
              <span
                onClick={() => router.push("/blogs")}
                className=" text-gray-600 hover:text-[#6366f1] cursor-pointer transition-colors"
              >
                Blog
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {session?.isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 mr-1">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium text-xs border border-gray-200">
                      {session.displayName?.charAt(0) || session.email?.charAt(0) || "U"}
                    </div>
                    <div className="hidden lg:flex flex-col text-xs">
                      <span className="font-medium text-gray-900">{session.displayName}</span>
                      <span className="text-gray-500 max-w-[150px] truncate">{session.email}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(API_BASE_URL)}
                    variant="default"
                    className="text-[13px] px-4 py-1.5 h-9 bg-primary hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Go to App
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => router.push(API_BASE_URL)}
                    variant="outline"
                    className="text-[13px] px-4 py-1.5 h-9"
                  >
                    Get Started
                  </Button>
                  <Button onClick={() => setActiveFeature("pricing")} variant="default" className="text-[13px] px-4 py-1.5 h-9">
                    Upgrade Now
                  </Button>
                </>
              )}
            </div>
          </header>

          <main ref={mainContentRef} className="flex-1 overflow-auto rounded-3xl md:rounded-3xl pb-16 md:pb-0">
            {renderFeature()}
          </main>

          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-40">
            <div className="flex items-center justify-around px-1 pb-safe pt-1">
              {navigation.map((item) => {
                const isActive = activeFeature === item.feature;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveFeature(item.feature)}
                    className="flex flex-col items-center justify-center gap-1 px-2 py-2.5 min-w-0 flex-1 transition-all relative"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      isActive
                        ? "bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] shadow-md"
                        : "bg-transparent"
                    )}>
                      <item.icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-gray-500"
                        )}
                      />
                    </div>
                    <span className={cn(
                      "text-[10px] transition-colors text-center leading-tight truncate w-full max-w-[60px]",
                      isActive
                        ? "font-semibold text-[#6366f1]"
                        : "font-normal text-gray-500"
                    )}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CheckerPage;
