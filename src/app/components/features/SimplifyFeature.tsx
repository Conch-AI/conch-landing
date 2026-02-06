"use client";

import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import Footer from "@/app/components/ui/Footer";
import { jsPDF } from "jspdf";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  ChevronDown,
  Copy,
  Download,
  FileText,
  GraduationCap,
  Heart,
  Lightbulb,
  MessageCircle,
  Newspaper,
  Palette,
  RefreshCw,
  Scale
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const SimplifyFeature = () => {
  const [query, setQuery] = useState("");
  const [activeTone, setActiveTone] = useState("Informative");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tones = [
    { label: "Casual", icon: MessageCircle },
    { label: "Formal", icon: Briefcase },
    { label: "Informative", icon: BookOpen },
    { label: "Academic", icon: GraduationCap },
    { label: "Friendly", icon: Heart },
    { label: "Confident", icon: Lightbulb },
  ];

  const sampleQuestions = [
    "Why is the sky blue?",
    "How do airplanes fly?",
    "What are black holes?",
    "Why do we dream?",
    "How does the internet work?",
    "Why do leaves change color in autumn?",
    "What causes lightning and thunder?",
    "How do fish breathe underwater?",
    "Why is the ocean salty?",
    "How do volcanoes erupt?",
  ];

  const handleSimplify = async (inputQuery?: string) => {
    const textToSimplify = inputQuery || query;
    if (!textToSimplify.trim()) return;

    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ai/explain-like-im-5", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: textToSimplify,
          tone: activeTone,
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          setResponse((prev) => prev + text);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrySample = () => {
    const randomQuestion =
      sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    setQuery(randomQuestion);
    handleSimplify(randomQuestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSimplify();
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    if (!response) return;

    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(response, 180);

    doc.setFontSize(12);
    doc.text(splitText, 15, 15);
    doc.save("simplified-content.pdf");
  };

  const SkeletonLoader = () => (
    <div className="flex flex-col gap-4">
      <div className="animate-pulse h-4 w-3/4 rounded bg-muted"></div>
      <div className="animate-pulse h-4 w-full rounded bg-muted"></div>
      <div className="animate-pulse h-4 w-5/6 rounded bg-muted"></div>
      <div className="animate-pulse h-4 w-3/6 rounded bg-muted"></div>
    </div>
  );

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-6 md:pt-7 pb-3 md:pb-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-[36px] font-medium tracking-tight mb-2 md:mb-3 text-foreground leading-tight">
            Make anything easy to understand
          </h1>
          <p className="text-xs sm:text-sm md:text-[14px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform complex topics into clear, simple explanations with AI-powered simplification.
          </p>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="px-4 md:px-8 pb-10 md:pb-14">
        <div className="max-w-5xl mx-auto">
          {/* Main Editor Card */}
          <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Tone Selector - Always at top */}
            <div className="flex items-center gap-3 md:gap-5 border-b border-border px-4 md:px-5 py-2 md:py-2.5 bg-muted/5">
              <span className="text-[12px] md:text-[13px] font-medium text-muted-foreground">Tone</span>
              <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tones.map((tone) => {
                  const Icon = tone.icon;
                  return (
                    <button
                      key={tone.label}
                      onClick={() => setActiveTone(tone.label)}
                      className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-1 md:py-1.5 text-[11px] md:text-[13px] font-medium transition-all border-b-2 whitespace-nowrap ${
                        activeTone === tone.label
                          ? "border-[#6366f1] text-[#6366f1]"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      {tone.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area - Responsive Layout */}
            <div className="flex flex-col md:flex-row md:max-h-[540px] overflow-hidden">
              {/* Input Area */}
              <div className="relative flex w-full md:w-1/2 flex-col border-b md:border-b-0 md:border-r border-border">
                <div className="flex-1 overflow-y-auto p-4 md:p-5">
                  <textarea
                    ref={textareaRef}
                    className="w-full min-h-[200px] md:min-h-[360px] resize-none bg-transparent text-[13px] md:text-[14px] outline-none border-0 placeholder:text-muted-foreground/60 focus:ring-0 focus:border-0 leading-relaxed"
                    placeholder="Enter your query or paste any complex text here... articles, research papers, technical docs."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-t border-border/50 bg-card">
                  <span className="text-[10px] md:text-[11px] text-muted-foreground">
                    {query.length} characters
                  </span>
                  <div className="flex items-center gap-2 md:gap-2.5">
                    <button
                      onClick={handleTrySample}
                      className="px-2.5 md:px-3.5 py-1 md:py-1.5 text-[11px] md:text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Try Sample
                    </button>
                    <Button
                      variant="default"
                      className="text-[11px] md:text-[13px] px-3 md:px-4 py-1 md:py-1.5"
                      onClick={() => handleSimplify()}
                      disabled={isLoading || !query.trim()}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5 animate-spin" />
                          Simplifying...
                        </>
                      ) : (
                        "Simplify"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Output Area - Show only when there's content or loading */}
              {(response || isLoading) && (
                <div className="relative flex w-full md:w-1/2 flex-col bg-muted/20 min-h-[300px] md:min-h-0">
                  <div className="flex-1 overflow-y-auto p-4 md:p-5">
                    {isLoading && !response ? (
                      <SkeletonLoader />
                    ) : response ? (
                      <div className="whitespace-pre-wrap text-[13px] md:text-[14px] leading-relaxed pb-12 md:pb-14">
                        {response}
                      </div>
                    ) : null}
                  </div>

                  {/* Fixed Bottom Toolbar */}
                  {response && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 md:gap-1.5 border-t border-border bg-card px-4 md:px-5 py-2 md:py-2.5">
                      <button
                        onClick={() => handleSimplify()}
                        disabled={isLoading}
                        className="flex items-center gap-1 md:gap-1.5 rounded-lg px-2 md:px-2.5 py-1 md:py-1.5 text-[11px] md:text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <RefreshCw className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        Regenerate
                      </button>
                      <div className="h-3 md:h-3.5 w-px bg-border"></div>
                      <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-1 md:gap-1.5 rounded-lg px-2 md:px-2.5 py-1 md:py-1.5 text-[11px] md:text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Download className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        Download PDF
                      </button>
                      <div className="h-3 md:h-3.5 w-px bg-border"></div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 md:gap-1.5 rounded-lg px-2 md:px-2.5 py-1 md:py-1.5 text-[11px] md:text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Copy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

     

      {/* Feature Highlights */}
      <section className="py-18 px-6">
        <div className="max-w-5xl mx-auto pl-10">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-18 leading-tight">
            Simplify with confidence
          </h2>

          {/* Feature 1 — Tone matching */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24 pt-10">
            <div className="rounded-2xl overflow-hidden max-w-[270px]">
              <Image
                src="/images/tone.png"
                alt="Match the tone to your audience"
                width={270}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Match the tone to<br />your audience
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Choose from 6 distinct tones — casual, formal, informative, academic, friendly, and confident — to get explanations that fit exactly how you need to communicate.
              </p>
            </div>
          </div>

          {/* Feature 2 — Real-time streaming */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Real-time answers,<br />no waiting
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed  max-w-md">
                Watch your simplified text stream in word by word. Start reading instantly while our AI crafts the perfect explanation — no loading screens, no delays.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden max-w-[270px]">
              <Image
                src="/images/fast.png"
                alt="Real-time answers with AI"
                width={270}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Feature 3 — Works with any content */}
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl overflow-hidden max-w-[270px]">
              <Image
                src="/images/content.png"
                alt="Works with any content type"
                width={270}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Works with any<br />content type
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed  max-w-md">
                From dense research papers to complex legal contracts, our AI handles it all. Paste any text and get a clear, readable explanation in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

       {/* Who Can Use Section */}
       <section className="py-18 px-6  pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Who can use our AI Simplifier?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              { icon: GraduationCap, title: "Students", desc: "Break down complex textbook chapters, research papers, and lecture notes into easy-to-understand summaries." },
              { icon: BookOpen, title: "Educators", desc: "Transform advanced material into accessible lesson content suitable for any grade level or learning ability." },
              { icon: FileText, title: "Researchers", desc: "Quickly digest dense academic papers and extract key insights without spending hours on a single study." },
              { icon: Scale, title: "Legal professionals", desc: "Simplify contracts, legal briefs, and regulatory documents into plain language for clients and colleagues." },
              { icon: Newspaper, title: "Journalists", desc: "Translate complex topics like science, policy, and finance into clear, reader-friendly articles." },
              { icon: Palette, title: "Content creators", desc: "Rewrite technical or niche content into approachable copy for blogs, social media, and newsletters." },
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

          <div className="flex justify-center mt-12">
            <Button variant="default" className="text-[14px] px-5 py-2" onClick={() => textareaRef.current?.focus()}>
              Get Started Free
            </Button>
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
              { q: "Is there a free plan?", a: "Yes! All users who sign up get access to 10 free credits daily, which can be used across all our tools: Simplify, Stealth, Mindmaps, Flashcards, Notes, and Chat." },
              { q: "What kind of text can I simplify?", a: "You can simplify any text — research papers, legal documents, technical manuals, textbook chapters, medical reports, financial filings, and more. If it's text, our AI can break it down into clear, simple language." },
              { q: "How do the tone options work?", a: "We offer 6 tones: Casual, Formal, Informative, Academic, Friendly, and Confident. Each changes the style and vocabulary of the simplified output to match your audience." },
              { q: "What are credits?", a: "Credits are the in-app currency for Conch that allows you to simplify text, humanize content, generate study material, and more. Each action costs 1 to 4 credits." },
              { q: "Can I export my simplified text?", a: "Absolutely. You can copy the simplified text to your clipboard with one click or download it as a PDF for easy sharing with students, colleagues, or clients." },
              { q: "What languages does Conch support?", a: "Conch currently supports multiple languages including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, and Korean." },
              { q: "How is this different from a summarizer?", a: "A summarizer shortens text by removing details. Our Simplifier rewrites the entire text in simpler language while keeping all the important information intact — it's about clarity, not brevity." },
            ].map((faq, i) => (
              <div
                key={i}
                className={`px-5 py-4 cursor-pointer rounded-2xl transition-all ${
                  openFaq === i ? "bg-[#f4f3f8] dark:bg-secondary/40" : "hover:bg-[#f4f3f8]/30 dark:hover:bg-secondary/20"
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
            Ready to simplify?
          </h2>
          <p className="text-[14px] text-muted-foreground mb-7 max-w-md mx-auto">
            Paste any text and see it transformed into clear, simple language instantly.
          </p>
          <Button variant="default" className="text-[14px] px-5 py-2" onClick={() => textareaRef.current?.focus()}>
            Try it now — it&apos;s free
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SimplifyFeature;
