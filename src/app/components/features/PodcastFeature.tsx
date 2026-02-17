"use client";

import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import Footer from "@/app/components/ui/Footer";
import { CheckerFeature } from "./CheckerSidebar";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Headphones,
  Mic,
  Sparkles,
  Users,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import SignupModal from "../SignupModal";
import { useAppContext } from "@/context/AppContext";
import { Session } from "@/context/SessionContext";
import PodcastUploadArea from "../podcast/PodcastUploadArea";
import PodcastConfigPanel, { PodcastConfig } from "../podcast/PodcastConfigPanel";
import PodcastGenerating from "../podcast/PodcastGenerating";
import PodcastPlayer, { PodcastData } from "../podcast/PodcastPlayer";

interface PodcastFeatureProps {
  onFeatureSelect?: (feature: CheckerFeature) => void;
  session: Session;
  handleLoggedIn: () => void;
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
    { id: 1, name: "Alex", voiceId: "alloy" },
    { id: 2, name: "Morgan", voiceId: "echo" },
  ],
  language: "en",
  mode: "Conversational",
  speechRate: 1.0,
  targetDuration: 5,
};

const PodcastFeature = ({ onFeatureSelect, session, handleLoggedIn }: PodcastFeatureProps) => {
  const { checkLimit, incrementUsage, guestId } = useAppContext();
  const [sourceFiles, setSourceFiles] = useState<SourceFile[]>([]);
  const [config, setConfig] = useState<PodcastConfig>(DEFAULT_CONFIG);
  const [view, setView] = useState<View>("upload");
  const [podcastId, setPodcastId] = useState<string | null>(null);
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const topRef = useRef<HTMLDivElement>(null);

  const currentStep = view === "upload" ? 0 : view === "configure" ? 1 : view === "generating" ? 2 : 3;

  const handleFilesReady = (files: SourceFile[]) => {
    setSourceFiles(files);
    setView("configure");
  };

  const handleGenerate = async () => {
    if (session?.isLoggedIn) {
      handleLoggedIn();
      return;
    }

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
    try {
      const res = await fetch(`/api/ai/podcast/get?podcastId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch podcast");
      const data = await res.json();
      setPodcastData(data);
      incrementUsage("podcast");
      setView("playing");
    } catch (error) {
      console.error("Fetch podcast error:", error);
    }
  }, [incrementUsage]);

  const handleNewPodcast = () => {
    setSourceFiles([]);
    setConfig(DEFAULT_CONFIG);
    setView("upload");
    setPodcastId(null);
    setPodcastData(null);
  };

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-6 md:pt-7 pb-3 md:pb-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center" ref={topRef}>
          <h1 className="text-xl sm:text-2xl md:text-[36px] font-medium tracking-tight mb-2 md:mb-3 text-foreground leading-tight">
            Turn your documents into podcasts
          </h1>
          <p className="text-xs sm:text-sm md:text-[14px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload any document and let AI transform it into an engaging podcast with multiple hosts, natural voices, and chapter markers.
          </p>
        </div>
      </section>

      {/* Main Card */}
      <section className="px-4 md:px-8 pb-10 md:pb-14">
        <div className="max-w-5xl mx-auto relative">
          {view !== "upload" && (
            <div className="absolute -inset-4 bg-gradient-to-b from-[#6366f1]/[0.04] via-transparent to-transparent rounded-3xl pointer-events-none" />
          )}
          <div
            className={`relative bg-white rounded-2xl md:rounded-[20px] border overflow-hidden flex flex-col transition-all duration-500 ease-out ${
              view !== "upload"
                ? "min-h-[560px] border-gray-200/80 shadow-xl shadow-gray-200/40"
                : "min-h-[380px] max-h-[460px] border-gray-200 shadow-lg shadow-gray-100/60"
            }`}
          >
            {/* Step indicator */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
              {STEP_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  {i > 0 && <div className="w-6 h-px bg-gray-200" />}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${
                        i < currentStep
                          ? "bg-[#6366f1] text-white"
                          : i === currentStep
                          ? "border-2 border-[#6366f1] text-[#6366f1]"
                          : "border border-gray-200 text-gray-400"
                      }`}
                    >
                      {i < currentStep ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-[11px] hidden sm:inline ${
                        i <= currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              ))}

              {/* Back button */}
              {view === "configure" && (
                <button
                  onClick={() => setView("upload")}
                  className="ml-auto text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back
                </button>
              )}
            </div>

            {/* View content */}
            {view === "upload" && (
              <PodcastUploadArea onFilesReady={handleFilesReady} isUploading={false} />
            )}
            {view === "configure" && (
              <PodcastConfigPanel
                config={config}
                onConfigChange={setConfig}
                onGenerate={handleGenerate}
                contentLength={sourceFiles.reduce((sum, f) => sum + f.content.length, 0)}
                isGenerating={isGenerating}
              />
            )}
            {view === "generating" && podcastId && (
              <PodcastGenerating
                podcastId={podcastId}
                onComplete={handleGenerationComplete}
                onError={() => {}}
              />
            )}
            {view === "playing" && podcastData && (
              <PodcastPlayer data={podcastData} onNewPodcast={handleNewPodcast} />
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-18 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-18 leading-tight">
            Documents come alive as audio
          </h2>

          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24 pt-10">
            <div className="rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1]/12 to-[#8b5cf6]/8 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-[#6366f1]" />
                </div>
                <div className="flex items-center gap-2">
                  {["Conversational", "Detailed", "Interview"].map((m) => (
                    <span key={m} className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-[#6366f1]/8 text-[#6366f1]">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="w-full flex items-end gap-1 h-8 justify-center">
                  {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.6].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-full bg-gradient-to-t from-[#6366f1] to-[#8b5cf6]"
                      style={{ height: `${h * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="max-w-[270px] md:max-w-md mx-auto md:mx-0">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Multiple podcast<br />modes
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Choose from conversational, detailed, or interview formats. Each mode creates a unique listening experience tailored to your content.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24">
            <div className="order-2 md:order-1 max-w-[270px] md:max-w-md mx-auto md:mx-0">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Natural AI voices<br />with personality
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Pick from six distinct voices, each with their own character. Customize names, mix voices, and preview before generating.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col gap-3">
                {[
                  { emoji: "🎙️", name: "Alex", color: "bg-amber-500", desc: "Warm & Balanced" },
                  { emoji: "🎧", name: "Morgan", color: "bg-blue-500", desc: "Deep & Resonant" },
                ].map((v) => (
                  <div key={v.name} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                    <div className={`w-8 h-8 rounded-lg ${v.color} flex items-center justify-center text-sm`}>
                      {v.emoji}
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-foreground">{v.name}</p>
                      <p className="text-[10px] text-muted-foreground">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <Headphones className="w-4 h-4 text-[#6366f1]" />
                  <span className="text-[11px] font-medium text-foreground">Full Player Controls</span>
                </div>
                <div className="flex items-center gap-3 justify-center py-2">
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                    <span className="text-[9px] text-gray-500">-15</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center">
                    <span className="text-white text-[12px]">▶</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                    <span className="text-[9px] text-gray-500">+15</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 relative">
                  <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full" />
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  <span>2:34</span>
                  <span>6:12</span>
                </div>
              </div>
            </div>
            <div className="max-w-[270px] md:max-w-md mx-auto md:mx-0">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Full-featured<br />audio player
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Play, pause, seek, adjust speed, and download your podcast. Navigate with chapters and follow along with the full transcript.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Use Section */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Who can use Podcast Generator?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              { icon: GraduationCap, title: "Students", desc: "Turn lecture notes and textbooks into podcasts you can listen to while commuting, exercising, or doing chores." },
              { icon: BookOpen, title: "Educators", desc: "Convert course materials into engaging audio content for students who prefer listening over reading." },
              { icon: Users, title: "Professionals", desc: "Transform reports and documents into podcasts for easy consumption during busy workdays." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3.5">
                    <Icon className="w-4.5 h-4.5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-18 px-6 bg-background pt-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <Badge className="bg-[#f4f3f8] text-muted-foreground border-0 mb-5 px-3.5 py-1.5 rounded-full font-normal text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mr-1.5 inline-block"></span>
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-[40px] font-medium text-foreground">
              Got Questions?
            </h2>
          </div>

          <div className="space-y-1">
            {[
              { q: "What file types can I use?", a: "You can upload PDF, DOCX, and PPTX files. Up to 3 files per podcast, with a maximum size of 10MB each." },
              { q: "How long does generation take?", a: "Typically 1-3 minutes depending on document length and number of hosts. You'll see real-time progress during generation." },
              { q: "How many free podcasts do I get?", a: "Guest users get 2 free podcast generations. Sign up for Conch to get more credits and access all features." },
              { q: "Can I choose different languages?", a: "Yes! We support 9 languages including English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, and Chinese." },
              { q: "Can I download the podcast?", a: "Yes, every generated podcast can be downloaded as an MP3 file for offline listening." },
              { q: "How many hosts can I have?", a: "You can configure 1 to 4 hosts, each with their own unique voice and name. More hosts create more dynamic conversations." },
            ].map((faq, i) => (
              <div
                key={i}
                className={`px-5 py-4 cursor-pointer rounded-2xl transition-all ${
                  openFaq === i ? "bg-[#f4f3f8]" : "hover:bg-[#f4f3f8]/30"
                }`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[15px] text-foreground">{faq.q}</p>
                  <ChevronDown className={`w-4.5 h-4.5 text-muted-foreground/50 transition-transform duration-200 flex-shrink-0 ml-3.5 ${openFaq === i ? "rotate-180" : ""}`} />
                </div>
                {openFaq === i && (
                  <p className="text-muted-foreground leading-relaxed mt-3.5 text-[13px]">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-18 px-6 pt-10 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-[36px] font-medium text-foreground mb-2.5 leading-tight">
            Ready to create your podcast?
          </h2>
          <p className="text-[14px] text-muted-foreground mb-7 max-w-md mx-auto">
            Upload a document and generate an engaging podcast in minutes.
          </p>
          <Button
            variant="default"
            className="text-[14px] px-5 py-2"
            onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Try it now — it&apos;s free
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>
      </section>

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
