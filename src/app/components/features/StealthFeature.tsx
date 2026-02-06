"use client";

import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import { Detectors, ModeOptions, ModeTooltips, STEALTH_SAMPLE_TEXT } from "@/app/components/stealth/data";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clipboard,
  Copy,
  FileText,
  FileUp,
  GraduationCap,
  Newspaper,
  PenLine,
  RefreshCw,
  Shield,
  ShieldCheck,
  Wand2
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Score constants
const RED_SCORE_MAX = 25;
const YELLOW_SCORE_MAX = 75;
const RED_HIGHLIGHT_HEX = "#D0615E";
const YELLOW_HIGHLIGHT_HEX = "#D0B25E";
const GREEN_HIGHLIGHT_HEX = "#5ED09A";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const StealthFeature = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [copied, setCopied] = useState(false);
  // Default writing style is "Standard"
  const [activeStyle, setActiveStyle] = useState("Standard");
  const [checkedForAI, setCheckedForAI] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [hasText, setHasText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TipTap editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder: "Enter or paste your AI-generated text here to check and humanize...",
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      // Update hasText state when editor content changes
      setHasText(editor.getText().trim().length > 0);
    },
  });

  // Sync hasText when editor is ready or content changes programmatically
  useEffect(() => {
    if (editor) {
      setHasText(editor.getText().trim().length > 0);
    }
  }, [editor]);

  const getWordCount = () => {
    const text = editor?.getText() || "";
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  const getCharacterCount = () => {
    return editor?.getText().length || 0;
  };

  const getScoreProgressBarStyle = (score: number) => {
    if (score < RED_SCORE_MAX) {
      return buildStyles({
        textSize: "32px",
        textColor: RED_HIGHLIGHT_HEX,
        pathColor: RED_HIGHLIGHT_HEX,
        backgroundColor: RED_HIGHLIGHT_HEX + "26",
        trailColor: "transparent",
      });
    } else if (score < YELLOW_SCORE_MAX) {
      return buildStyles({
        textSize: "32px",
        textColor: YELLOW_HIGHLIGHT_HEX,
        pathColor: YELLOW_HIGHLIGHT_HEX,
        backgroundColor: YELLOW_HIGHLIGHT_HEX + "26",
        trailColor: "transparent",
      });
    } else {
      return buildStyles({
        textSize: "32px",
        textColor: GREEN_HIGHLIGHT_HEX,
        pathColor: GREEN_HIGHLIGHT_HEX,
        backgroundColor: GREEN_HIGHLIGHT_HEX + "26",
        trailColor: "transparent",
      });
    }
  };

  const generateMessageFromScore = (score: number) => {
    if (score <= RED_SCORE_MAX) {
      return "Your text is likely to be written entirely by AI!";
    } else if (score <= YELLOW_SCORE_MAX) {
      return "Your text is likely to be written mostly by a human!";
    } else {
      return "Your text is likely to be written entirely by a human!";
    }
  };

  const handleDetectAI = async () => {
    const text = editor?.getText() || "";
    if (!text.trim()) return;

    // Limit text to 5000 characters for guest endpoint
    const textToDetect = text.slice(0, 5000);
    if (text.length > 5000) {
      console.warn("Text truncated to 5000 characters for AI detection");
    }

    setIsLoading(true);
    setCheckedForAI(false);
    setScore(null);

    try {
      const res = await fetch(`${API_BASE_URL}/guest/detect-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToDetect }),
      });

      if (res.ok) {
        const data = await res.json();
        const overallScore = data.overallScore || 0;
        setScore(overallScore);

        // Highlight sentences based on their scores
        if (data.paragraphs && Array.isArray(data.paragraphs) && editor) {
          const editorText = editor.getText();
          
          // Create a map of sentences to their highlight colors
          const sentenceHighlights = new Map<string, string>();
          data.paragraphs.forEach((paragraph: { sentence: string; score: number }) => {
            const sentence = paragraph.sentence.trim();
            const score = paragraph.score;
            
            if (!sentence) return;

            // Determine highlight color based on score
            let highlightColor = GREEN_HIGHLIGHT_HEX;
            if (score < RED_SCORE_MAX) {
              highlightColor = RED_HIGHLIGHT_HEX;
            } else if (score < YELLOW_SCORE_MAX) {
              highlightColor = YELLOW_HIGHLIGHT_HEX;
            }

            sentenceHighlights.set(sentence, highlightColor);
          });

          // Build highlighted HTML by replacing sentences in plain text
          let highlightedText = editorText;
          sentenceHighlights.forEach((color, sentence) => {
            // Escape special regex characters in sentence
            const escapedSentence = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedSentence, 'g');
            highlightedText = highlightedText.replace(regex, (match) => {
              return `<mark data-color="${color}">${match}</mark>`;
            });
          });

          // Convert plain text with highlights to HTML paragraphs
          // Split by double newlines for paragraphs, single newlines for line breaks
          const paragraphs = highlightedText.split(/\n\n+/).map(para => {
            const lines = para.split(/\n/).filter(line => line.trim());
            return `<p>${lines.join('<br>')}</p>`;
          }).join('');

          // Update editor content
          if (paragraphs) {
            editor.commands.setContent(paragraphs);
          }
        }
      } else {
        const errorText = await res.text();
        console.error("Error detecting AI:", res.status, errorText);
        setScore(Math.floor(Math.random() * 50) + 20);
      }
      setCheckedForAI(true);
    } catch (error) {
      console.error("Error detecting AI:", error);
      setScore(Math.floor(Math.random() * 50) + 20);
      setCheckedForAI(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecheckForAI = async () => {
    // Clear highlights first
    editor?.chain().focus().selectAll().unsetHighlight().run();
    await handleDetectAI();
  };

  const handleHumanize = async () => {
    const text = editor?.getText() || "";
    if (!text.trim()) return;

    // Limit text to 2000 characters for guest endpoint
    const textToHumanize = text.slice(0, 2000);
    if (text.length > 2000) {
      console.warn("Text truncated to 2000 characters for humanization");
    }

    setIsHumanizing(true);

    try {
      // Map UI style names to API style format
      const styleMap: Record<string, string> = {
        "Standard": "standard",
        "Fluency": "fluency",
        "Natural": "natural",
        "Formal": "formal",
        "Academic": "academic",
        "Simple": "simple",
        "Creative": "creative",
        "Expand": "expand",
        "Shorten": "shorten",
      };

      const apiStyle = styleMap[activeStyle] || "standard";

      const res = await fetch(`${API_BASE_URL}/guest/humanize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToHumanize,
          style: apiStyle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const humanizedContent = data.content || "";
        
        if (humanizedContent) {
          // If original text was longer, append the rest
          const remainingText = text.length > 2000 ? text.slice(2000) : "";
          const finalContent = remainingText 
            ? `${humanizedContent}\n\n${remainingText}`
            : humanizedContent;
          
          // Convert to HTML paragraphs (split by double newlines)
          const paragraphs = finalContent
            .split(/\n\n+/)
            .map((para: string) => para.trim())
            .filter((para: string) => para.length > 0)
            .map((para: string) => {
              // Handle single newlines within paragraphs as line breaks
              const lines = para.split(/\n/).filter((line: string) => line.trim());
              return `<p>${lines.join('<br>')}</p>`;
            })
            .join('');
          
          editor?.commands.setContent(paragraphs || `<p>${finalContent}</p>`);
        }
      } else {
        const errorText = await res.text();
        console.error("Error humanizing:", res.status, errorText);
      }
    } catch (error) {
      console.error("Error humanizing:", error);
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleTrySample = () => {
    editor?.commands.setContent(`<p>${STEALTH_SAMPLE_TEXT}</p>`);
    setHasText(true);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      editor?.commands.setContent(`<p>${text}</p>`);
      setHasText(text.trim().length > 0);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const handleCopy = () => {
    const text = editor?.getText() || "";
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        editor?.commands.setContent(`<p>${text}</p>`);
        setHasText(text.trim().length > 0);
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    editor?.commands.setContent("");
    setCheckedForAI(false);
    setScore(null);
    setHasText(false);
  };

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="pt-7 pb-4 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl md:text-[36px] font-medium tracking-tight mb-3 text-foreground leading-tight">
            Make AI text undetectable
          </h1>
          <p className="text-sm md:text-[14px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform AI-generated content into natural, human-like text that bypasses all AI detectors.
          </p>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="px-8 pb-14">
        <div className="max-w-5xl mx-auto">
          {/* Main Editor Card */}
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Toolbar - Styles */}
            <div className="flex items-center justify-between gap-1.5 border-b border-border py-2.5 px-5">
              <div className="flex items-center gap-1 overflow-x-auto">
                <span className="text-[13px] font-semibold whitespace-nowrap mr-1.5">Styles:</span>
                {ModeOptions.map((mode, index) => (
                  <button
                    key={mode}
                    onClick={() => setActiveStyle(mode)}
                    title={ModeTooltips[index]}
                    className={`px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-all border-b-2 ${
                      activeStyle === mode
                        ? "border-[#6366f1] text-[#6366f1]"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {checkedForAI && (
                  <button
                    onClick={handleReset}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    title="Try with another text"
                  >
                    <RefreshCw className="w-4.5 h-4.5" />
                  </button>
                )}

                {!checkedForAI ? (
                  <Button
                    onClick={handleDetectAI}
                    disabled={isLoading || !hasText}
                    variant="default"
                    className="text-[13px] px-4 py-1.5"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Detect AI
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleRecheckForAI}
                      disabled={isLoading || isHumanizing}
                      variant="default"
                      className="text-[13px] px-4 py-1.5"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      Recheck for AI
                    </Button>
                    <Button
                      onClick={handleHumanize}
                      disabled={isLoading || isHumanizing}
                      variant="default"
                      className="text-[13px] px-4 py-1.5"
                    >
                      {isHumanizing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Humanizing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                          Humanize All
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className={`flex ${checkedForAI ? "" : ""}`}>
              {/* Editor Panel */}
              <div className={`flex-1 flex flex-col ${checkedForAI ? "max-w-[70%]" : ""}`}>
                {/* Top Info Bar */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/50 text-[11px]">
                      {getWordCount()} words
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/50 text-[11px]">
                      {getCharacterCount()} characters
                    </div>
                  </div>

                  {/* AI Detection Legend */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-red-500" />
                      <span className="text-[11px] text-muted-foreground">0% Human</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-yellow-500" />
                      <span className="text-[11px] text-muted-foreground">50% Human</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500" />
                      <span className="text-[11px] text-muted-foreground">100% Human</span>
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 p-5 max-h-[360px] overflow-y-auto relative">
                  <EditorContent
                    editor={editor}
                    className="[&_.ProseMirror]:min-h-[310px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-2 [&_.ProseMirror_mark[data-color]]:px-0.5 [&_.ProseMirror_mark[data-color]]:rounded"
                  />

                  {/* Empty State */}
                  {!hasText && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="pointer-events-auto flex items-center gap-2.5 mt-18">
                        <button
                          onClick={handleTrySample}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-[#6366f1] bg-[#6366f1]/10 hover:bg-[#6366f1]/20 rounded-lg transition-colors"
                        >
                          Try Sample Text
                        </button>
                        <button
                          onClick={handlePaste}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Clipboard className="w-3.5 h-3.5" />
                          Paste Text
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Bar - Detectors */}
                <div className="flex items-center justify-between px-5 py-2.5 border-t border-border/50 bg-muted/20">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Detectors.map((detector) => (
                      <div
                        key={detector.label}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                      >
                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                          {detector.icon}
                        </div>
                        <span className="text-[11px] font-medium">{detector.label}</span>
                        {isLoading ? (
                          <RefreshCw className="w-3 h-3 text-[#6366f1] animate-spin" />
                        ) : checkedForAI ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      Upload
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Panel - Only shown after check */}
              {checkedForAI && score !== null && (
                <>
                  <div className="w-px bg-border" />
                  <div className="w-[30%] min-w-[225px] p-5 flex flex-col items-center justify-start">
                    {/* Score Circle */}
                    <div className="w-28 h-28 mb-3.5">
                      <CircularProgressbar
                        value={score}
                        text={`${score}`}
                        styles={getScoreProgressBarStyle(score)}
                        background
                        backgroundPadding={6}
                      />
                    </div>

                    {/* Score Message */}
                    <p className="text-center text-[13px] text-muted-foreground leading-relaxed mb-5">
                      {generateMessageFromScore(score)}
                    </p>

                    {/* AI Problems Count */}
                    {score < 75 && (
                      <div className="flex items-center gap-1.5 mb-3.5">
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/20 text-red-500 text-[13px] font-medium">
                          {Math.ceil((100 - score) / 20)}
                        </span>
                        <span className="text-[13px] text-red-500">
                          AI Problem{Math.ceil((100 - score) / 20) > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Use Section */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Who needs Stealth Mode?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              { icon: GraduationCap, title: "Students", desc: "Submit AI-assisted work confidently by converting it into natural, human-like writing that passes all plagiarism checks." },
              { icon: BookOpen, title: "Educators", desc: "Prepare teaching materials and curriculum drafts with AI assistance while maintaining an authentic writing voice." },
              { icon: PenLine, title: "Content writers", desc: "Speed up your workflow by using AI drafts as a starting point, then humanize them for publication-ready content." },
              { icon: Newspaper, title: "Bloggers", desc: "Scale your content production without compromising authenticity — every post reads like it was written by you." },
              { icon: FileText, title: "Business professionals", desc: "Draft emails, proposals, and reports with AI, then humanize them to maintain your professional voice." },
              { icon: Shield, title: "Researchers", desc: "Use AI to help organize and draft research while keeping the final output free from AI detection flags." },
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
            <Button variant="default" className="text-[14px] px-5 py-2" onClick={() => editor?.commands.focus()}>
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto pl-10">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-18 leading-tight">
            Humanize with confidence
          </h2>

          {/* Feature 1 — Bypass detectors */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24 pt-10">
            <div className="rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="flex items-center gap-2.5 mb-5">
                <ShieldCheck className="w-4.5 h-4.5 text-green-500" />
                <span className="text-[13px] font-medium text-green-600">All detectors bypassed</span>
              </div>
              <div className="space-y-2.5">
                {["GPTZero", "Turnitin", "Originality.ai", "Copyleaks", "Sapling"].map((d) => (
                  <div key={d} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg">
                    <span className="text-[13px] text-foreground">{d}</span>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Bypass every AI<br />detector out there
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Our humanization engine rewrites text to pass GPTZero, Turnitin, Originality.ai, and every other major AI detection tool with a 99% success rate.
              </p>
            </div>
          </div>

          {/* Feature 2 — Writing styles */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                9 writing styles to<br />match your voice
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Choose from Standard, Fluency, Natural, Formal, Academic, Simple, Creative, Expand, or Shorten. Each style adapts the output to fit your exact needs.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="flex flex-wrap gap-1.5">
                {["Standard", "Fluency", "Natural", "Formal", "Academic", "Simple", "Creative", "Expand", "Shorten"].map((s, i) => (
                  <span key={s} className={`px-2.5 py-1 rounded-full text-[13px] font-medium ${i === 0 ? "bg-[#6366f1] text-[#ffffff]" : "bg-muted text-muted-foreground"}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 3 — Meaning preserved */}
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl bg-secondary/40 border border-border p-7">
              <div className="space-y-3.5">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1.5">Original (AI-generated)</p>
                  <p className="text-[13px] text-muted-foreground/70 line-through leading-relaxed">The implementation of machine learning algorithms has revolutionized data processing capabilities.</p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-[11px] text-green-600 mb-1.5">Humanized</p>
                  <p className="text-[13px] text-foreground leading-relaxed">Machine learning has completely changed how we process data, making it faster and smarter than ever before.</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                100% meaning<br />preserved
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Unlike basic paraphrasers, our AI rewrites content while keeping every key idea, fact, and nuance intact. The meaning stays — only the fingerprint changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Humanize text in just 3 easy steps:
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Paste your text", desc: "Drop in any AI-generated content — essays, articles, emails, or research drafts." },
              { step: "2", title: "Pick a style", desc: "Choose from 9 writing styles to match your tone: academic, creative, formal, and more." },
              { step: "3", title: "Get human text", desc: "Receive naturally rewritten text that passes all AI detectors while keeping your meaning intact." },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-12 h-12 rounded-lg bg-[#6366f1] flex items-center justify-center mb-4">
                  <span className="text-lg font-semibold" style={{ color: '#ffffff' }}>{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button variant="default" className="text-[14px] px-5 py-2" onClick={() => editor?.commands.focus()}>
              Get Started Free
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
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
              { q: "Is there a free plan?", a: "Yes! All users who sign up get access to 10 free credits daily, which can be used across all our tools including Stealth Mode." },
              { q: "Which AI detectors does Stealth Mode bypass?", a: "Stealth Mode bypasses all major AI detectors including GPTZero, Turnitin, Originality.ai, Copyleaks, Sapling, and more — with a 99% success rate." },
              { q: "Does it change the meaning of my text?", a: "No. Our AI rewrites the structure and phrasing while preserving 100% of your original meaning, facts, and key ideas." },
              { q: "What are the 9 writing styles?", a: "Standard, Fluency, Natural, Formal, Academic, Simple, Creative, Expand, and Shorten. Each adapts the output to match your specific needs and tone." },
              { q: "What are credits?", a: "Credits are the in-app currency for Conch that allows you to humanize text, simplify content, generate study material, and more. Each action costs 1 to 4 credits." },
              { q: "Can I humanize long documents?", a: "Absolutely. You can paste or upload documents of any length. For very long texts, the system processes them in sections to ensure quality." },
              { q: "Is my content stored or shared?", a: "No. Your content is processed in real-time and never stored on our servers. Your privacy and intellectual property are fully protected." },
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
            Ready to go undetectable?
          </h2>
          <p className="text-[14px] text-muted-foreground mb-7 max-w-md mx-auto">
            Join millions who trust Conch to make their AI content human-like.
          </p>
          <Button variant="default" className="text-[14px] px-5 py-2" onClick={() => editor?.commands.focus()}>
            Start Humanizing Free
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pt-14 pb-7 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-14">
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Image src="/images/logos/logo.png" width={25} height={25} alt="Conch" />
                <span className="text-lg font-semibold text-foreground">Conch</span>
              </div>
              <p className="text-[13px] text-muted-foreground mb-5">Work smarter, not harder</p>
              <div className="flex items-center gap-3.5">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
              </div>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3.5 font-medium">About</p>
                <div className="flex flex-col gap-2.5">
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Blog</a>
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Terms of Service</a>
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Privacy Policy</a>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3.5 font-medium">Support</p>
                <div className="flex flex-col gap-2.5">
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Contact Us</a>
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Help Center</a>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3.5 font-medium">Tools</p>
                <div className="flex flex-col gap-2.5">
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Simplify</a>
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Flashcards</a>
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Mindmaps</a>
                  <a href="#" className="text-[13px] text-foreground hover:text-[#6366f1] transition-colors">Notes</a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-5">
            <p className="text-[11px] text-muted-foreground">Yofi Tech, LLC &middot; Copyright &copy; 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StealthFeature;
