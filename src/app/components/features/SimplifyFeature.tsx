"use client";

import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
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
    <div className="min-h-full bg-background text-foreground overflow-y-auto">
      {/* Hero Section */}
      <section className="pt-8 pb-4 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl md:text-[40px] font-medium tracking-tight mb-3 text-foreground leading-tight">
            Make anything easy to understand
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform complex topics into clear, simple explanations with AI-powered simplification.
          </p>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Main Editor Card */}
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Top Tone Selector */}
            <div className="flex items-center gap-6 border-b border-border px-6 py-3">
              <span className="text-sm font-medium text-muted-foreground">Tone</span>
              <div className="flex items-center gap-1">
                {tones.map((tone) => {
                  const Icon = tone.icon;
                  return (
                    <button
                      key={tone.label}
                      onClick={() => setActiveTone(tone.label)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all border-b-2 ${
                        activeTone === tone.label
                          ? "border-[#6366f1] text-[#6366f1]"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tone.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split View Content */}
            <div className="flex max-h-[600px] overflow-hidden">
              {/* Left Input Area */}
              <div className="relative flex w-1/2 flex-col border-r border-border">
                <div className="flex-1 overflow-y-auto p-6">
                  <textarea
                    ref={textareaRef}
                    className="w-full min-h-[400px] resize-none bg-transparent text-base outline-none border-0 placeholder:text-muted-foreground/60 focus:ring-0 focus:border-0 leading-relaxed"
                    placeholder="Enter your query or paste any complex text here... articles, research papers, technical docs."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-card">
                  <span className="text-xs text-muted-foreground">
                    {query.length} characters
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTrySample}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Try Sample
                    </button>
                    <Button
                      variant="default"
                      className=""
                      onClick={() => handleSimplify()}
                      disabled={isLoading || !query.trim()}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Simplifying...
                        </>
                      ) : (
                        "Simplify"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Output Area */}
              <div className="relative flex w-1/2 flex-col bg-muted/20">
                <div className="flex-1 overflow-y-auto p-6">
                  {isLoading && !response ? (
                    <SkeletonLoader />
                  ) : response ? (
                    <div className="whitespace-pre-wrap text-base leading-relaxed pb-16">
                      {response}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-14 h-14 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-4">
                        <Lightbulb className="w-7 h-7 text-[#6366f1]" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Simplified text will appear here
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Press Enter or click Simplify
                      </p>
                    </div>
                  )}
                </div>

                {/* Fixed Bottom Toolbar */}
                {response && (
                  <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 border-t border-border bg-card px-6 py-3">
                    <button
                      onClick={() => handleSimplify()}
                      disabled={isLoading}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                      Regenerate
                    </button>
                    <div className="h-4 w-px bg-border"></div>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <div className="h-4 w-px bg-border"></div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* Feature Highlights */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-medium text-center text-foreground mb-20 leading-tight">
            Simplify with confidence
          </h2>

          {/* Feature 1 — Tone matching */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-28">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="/images/tone.png"
                alt="Match the tone to your audience"
                width={420}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-[28px] font-medium text-foreground mb-4 leading-snug">
                Match the tone to<br />your audience
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose from 6 distinct tones — casual, formal, informative, academic, friendly, and confident — to get explanations that fit exactly how you need to communicate.
              </p>
            </div>
          </div>

          {/* Feature 2 — Real-time streaming */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-28">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-[28px] font-medium text-foreground mb-4 leading-snug">
                Real-time answers,<br />no waiting
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Watch your simplified text stream in word by word. Start reading instantly while our AI crafts the perfect explanation — no loading screens, no delays.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden">
              <Image
                src="/images/fast.png"
                alt="Real-time answers with AI"
                width={420}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Feature 3 — Works with any content */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src="/images/content.png"
                alt="Works with any content type"
                width={420}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-[28px] font-medium text-foreground mb-4 leading-snug">
                Works with any<br />content type
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                From dense research papers to complex legal contracts, our AI handles it all. Paste any text and get a clear, readable explanation in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

       {/* Who Can Use Section */}
       <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-medium text-center text-foreground mb-16 leading-tight">
            Who can use our AI Simplifier?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-12 gap-y-14">
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
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-14">
            <Button variant="default" className="" onClick={() => textareaRef.current?.focus()}>
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      
      {/* <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-medium text-center text-foreground mb-16 leading-tight">
            Simplify any text in just 3 easy steps:
          </h2>
          <div className="grid md:grid-cols-3 gap-12 justify-items-center">
            {[
              { step: "1", title: "Paste your text", desc: "Drop in any complex content — articles, papers, docs, or even just a confusing paragraph." },
              { step: "2", title: "Pick a tone", desc: "Select the style that matches your audience: casual for friends, academic for research, formal for work." },
              { step: "3", title: "Get your answer", desc: "Read the simplified version instantly, then copy to clipboard or download as a PDF." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-lg bg-[#6366f1] flex items-center justify-center mb-5 mx-auto">
                  <span className="text-xl font-semibold" style={{ color: '#ffffff' }}>{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-14">
            <Button variant="default" className="" onClick={() => textareaRef.current?.focus()}>
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-[#f4f3f8] text-muted-foreground border-0 mb-6 px-4 py-1.5 rounded-full font-normal text-sm">
              <span className="w-2 h-2 rounded-full bg-[#6366f1] mr-2 inline-block"></span>
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-medium text-foreground">
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
                className={`px-6 py-5 cursor-pointer rounded-2xl transition-all ${
                  openFaq === i ? "bg-[#f4f3f8] dark:bg-secondary/40" : "hover:bg-[#f4f3f8]/30 dark:hover:bg-secondary/20"
                }`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[17px] text-foreground">{faq.q}</p>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground/50 transition-transform duration-200 flex-shrink-0 ml-4 ${openFaq === i ? "rotate-180" : ""}`} />
                </div>
                {openFaq === i && (
                  <p className="text-muted-foreground leading-relaxed mt-4 text-[15px]">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-[40px] font-medium text-foreground mb-3 leading-tight">
            Ready to simplify?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Paste any text and see it transformed into clear, simple language instantly.
          </p>
          <Button variant="default" className="" onClick={() => textareaRef.current?.focus()}>
            Try it now — it&apos;s free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pt-16 pb-8 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            {/* Logo & tagline */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/images/logos/logo.png" width={28} height={28} alt="Conch" />
                <span className="text-xl font-semibold text-foreground">Conch</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Work smarter, not harder</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
              </div>
            </div>

            {/* Footer links */}
            <div className="flex gap-20">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium">About</p>
                <div className="flex flex-col gap-3">
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Blog</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Terms of Service</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Privacy Policy</a>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium">Support</p>
                <div className="flex flex-col gap-3">
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Contact Us</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Help Center</a>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium">Tools</p>
                <div className="flex flex-col gap-3">
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Stealth Mode</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Flashcards</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Mindmaps</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Notes</a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">Yofi Tech, LLC &middot; Copyright &copy; 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimplifyFeature;
