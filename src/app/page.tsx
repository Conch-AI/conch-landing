"use client";

import FlashcardsFeature from "@/app/components/features/FlashcardsFeature";
import HomeFeature from "@/app/components/features/HomeFeature";
import MindmapsFeature from "@/app/components/features/MindmapsFeature";
import NotesFeature from "@/app/components/features/NotesFeature";
import SimplifyFeature from "@/app/components/features/SimplifyFeature";
import StealthFeature from "@/app/components/features/StealthFeature";
import BlogHome from "@/app/components/blogs/BlogHome";
import BlogPost from "@/app/components/blogs/BlogPost";
import { BlogSkeletonGrid } from "@/app/components/blogs/components/blog-skeleton";
import { Button } from "@/app/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Layers,
  Lightbulb,
  Menu,
  Moon,
  Shield,
  Sun,
  Wand2,
  X,
  Zap
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "types/Post";

type FeatureType = "home" | "stealth" | "simplify" | "mindmaps" | "flashcards" | "notes" | "blog" | "chat";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  interface Category {
    name: string;
  }
  const [blogData, setBlogData] = useState<{ posts: Post[]; categories: Category[] } | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Force light mode - always set to false
    setIsDarkMode(false);
  }, []);

  // Apply theme to document
  useEffect(() => {
    // Force light mode - always remove dark class
    document.documentElement.classList.remove("dark");
    localStorage.setItem("checker-theme", "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    // Force light mode - do nothing (keep button for UI but don't change theme)
    setIsDarkMode(false);
  };

  // Fetch blog data when blog feature is selected
  useEffect(() => {
    if (activeFeature === "blog" && !blogData) {
      setBlogLoading(true);
      fetch("/api/blogs")
        .then((res) => res.json())
        .then((data) => {
          setBlogData(data);
          setBlogLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching blog data:", error);
          setBlogLoading(false);
        });
    }
  }, [activeFeature, blogData]);

  // Fetch individual post when slug is selected
  useEffect(() => {
    if (selectedPostSlug && blogData) {
      setPostLoading(true);
      // Find post in existing data first
      const post = blogData.posts.find((p) => p.slug === selectedPostSlug);
      if (post) {
        setSelectedPost(post);
        setPostLoading(false);
      } else {
        // If not found, could fetch from API
        setPostLoading(false);
      }
    }
  }, [selectedPostSlug, blogData]);

  // Handle post click
  const handlePostClick = (slug: string) => {
    setSelectedPostSlug(slug);
  };

  // Handle back to blog list
  const handleBackToBlog = () => {
    setSelectedPostSlug(null);
    setSelectedPost(null);
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
      case "blog":
        if (blogLoading) {
          return (
            <div className="flex flex-col items-start justify-start min-h-full bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <div className="mx-auto w-full max-w-6xl 2xl:max-w-7xl">
                {/* Header - matching header.tsx */}
                <div className="flex w-full flex-col items-start justify-start gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
                  {/* Blog title - actual title with gradient */}
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
                      Blog
                    </h1>
                  </div>
                  {/* Search bar skeleton */}
                  <div className="relative w-full md:w-72 lg:w-80">
                    <div className="h-10 sm:h-11 w-full bg-gray-200 rounded-xl animate-pulse"></div>
                  </div>
                </div>
                
                {/* Categories - hardcoded categories matching the image layout */}
                <div className="my-6 sm:my-8 w-full">
                  {/* Mobile dropdown */}
                  <div className="md:hidden w-full">
                    <div className="h-11 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  {/* Desktop pills - exact categories from image in two rows */}
                  <div className="hidden md:flex flex-wrap items-center gap-2 justify-center">
                    {/* First row categories */}
                    {["All", "AI Detection", "AI Detection for School", "AI Detection Tools", "AI Writing Detection", "ChatGPT School Detection", "Essay Writing"].map((category, i) => (
                      <div 
                        key={i} 
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          i === 0
                            ? "bg-[#6366f1] text-white shadow-sm"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-[#6366f1] hover:text-[#6366f1]"
                        }`}
                      >
                        {category}
                      </div>
                    ))}
                    {/* Second row categories */}
                    {["Essay Writing: Citations", "Humanize AI Content", "Learning", "Study Techniques"].map((category, i) => (
                      <div 
                        key={`row2-${i}`} 
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-all bg-white text-gray-600 border border-gray-200 hover:border-[#6366f1] hover:text-[#6366f1]"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Blog posts skeleton grid */}
                <BlogSkeletonGrid count={6} />
              </div>
            </div>
          );
        }
        if (postLoading) {
          return (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#6366f1] mx-auto"></div>
                <p className="text-sm text-gray-600">Loading post...</p>
              </div>
            </div>
          );
        }
        if (selectedPost) {
          return <BlogPost post={selectedPost} onBack={handleBackToBlog} />;
        }
        if (blogData) {
          return (
            <BlogHome
              incomingPosts={blogData.posts}
              categories={blogData.categories}
              onPostClick={handlePostClick}
            />
          );
        }
        return null;
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
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden bg-[#f4f3f8]">
          {/* Sidebar */}
          <div
            className={cn(
              "flex flex-col h-auto md:h-full bg-[#f4f3f8] text-sidebar-foreground transition-all duration-300 rounded-t-3xl md:rounded-tl-3xl md:rounded-tr-none",
              isCollapsed ? "w-12" : "w-full md:w-24"
            )}
          >
            <div className="p-3 md:p-4 flex items-center justify-between md:justify-center relative">
              <div 
                onClick={() => setActiveFeature("home")}
                className="flex items-center gap-1.5 font-bold text-base md:text-lg text-foreground cursor-pointer hover:opacity-80 transition-opacity md:pl-4"
              >
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center">
                  <Image
                    alt="Logo"
                    src={
                      "https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                    }
                    width={24}
                    height={24}
                    className="md:w-7 md:h-7"
                  />
                </div>
                <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">Conch</span>
              </div>

              {/* Mobile-only header actions */}
              <div className="flex md:hidden items-center gap-2">
                <span onClick={() => router.push("/pricing")} className="text-[13px] text-gray-600 hover:text-[#6366f1] cursor-pointer transition-colors">
                  Pricing
                </span>
                <span onClick={() => setActiveFeature("blog")} className="text-[13px] text-gray-600 hover:text-[#6366f1] cursor-pointer transition-colors">
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
              </div>

              {/* Mobile dropdown menu */}
              {mobileMenuOpen && (
                <div className="absolute top-full right-4 mt-1 z-50 md:hidden bg-white rounded-xl border border-border shadow-lg p-3 flex flex-col gap-2 min-w-[180px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="justify-start text-gray-600 hover:text-gray-900 h-8 text-[12px]"
                  >
                    {isDarkMode ? <Sun className="h-3.5 w-3.5 mr-2" /> : <Moon className="h-3.5 w-3.5 mr-2" />}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </Button>
                  <Button variant="outline" className="text-[13px] h-9 w-full" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Button>
                  <Button variant="default" className="text-[13px] h-9 w-full" onClick={() => setMobileMenuOpen(false)}>
                    Get Started Free
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 md:flex-none overflow-x-auto md:overflow-y-auto md:overflow-x-hidden py-2">
              <nav className="px-2 md:px-1.5 flex md:flex-col space-x-2 md:space-x-0 md:space-y-1">
                {navigation.map((item) => {
                const isActive = activeFeature === item.feature;
                return (
                  <button
                    key={item.name}
                    onClick={() => setActiveFeature(item.feature)}
                    className="group w-auto md:w-full min-w-[64px] md:min-w-0 flex flex-col items-center gap-1 px-2 py-2 md:py-3 text-[10px] sm:text-[11px] rounded-xl transition-all relative"
                  >
                      <div className={cn(
                        "w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all",
                        isActive
                          ? "bg-white shadow-sm"
                          : "bg-transparent group-hover:bg-white/50"
                      )}>
                        <item.icon
                        className={cn(
                          "w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-colors",
                          isActive
                            ? "text-[#6366f1]"
                            : "text-gray-500 group-hover:text-[#6366f1]"
                        )}
                      />
                      </div>
                      <span className={cn(
                        "transition-colors text-center leading-tight text-gray-900",
                        isActive
                          ? "font-medium"
                          : "font-normal"
                      )}>
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
{/* 
            {!isCollapsed && (
              <div className="p-4 pb-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <p className="text-xs font-medium text-gray-900">
                      Free Plan
                    </p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-full w-1/3 bg-purple-600 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
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
            {/* Top Navigation — desktop only */}
            <header className="hidden md:flex h-14 items-center justify-between bg-[#f4f3f8] px-7 shrink-0">
              <div className="flex items-center gap-7 pl-5 text-[13.5px]">
                <span onClick={() => router.push("/pricing")} className=" text-gray-600 hover:text-[#6366f1] cursor-pointer transition-colors">
                  Pricing
                </span>
                <span
                  onClick={() => setActiveFeature("blog")}
                  className=" text-gray-600 hover:text-[#6366f1] cursor-pointer transition-colors"
                >
                  Blog
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 w-9"
                >
                  {isDarkMode ? (
                    <Sun className="h-4.5 w-4.5" />
                  ) : (
                    <Moon className="h-4.5 w-4.5" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="text-[13px] px-4 py-1.5 h-9"
                >
                  Sign In
                </Button>
                <Button variant="default" className="text-[13px] px-4 py-1.5 h-9">
                  Get Started Free
                </Button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto rounded-3xl">
              {renderFeature()}
            </main>
          </div>
        </div>
      </div>
  );
};

export default CheckerPage;
