"use client";

import Footer from "@/app/components/ui/Footer";
import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clipboard as ClipboardIcon,
  Copy,
  Download,
  FileText,
  GraduationCap,
  Layers,
  Lightbulb,
  Palette,
  PenLine,
  Plus,
  RefreshCw,
  StickyNote,
  Upload
} from "lucide-react";
import { useRef, useState } from "react";
import SignupModal from "../SignupModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const NotesFeature = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState("Untitled Notes");
  const [headings, setHeadings] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      textareaRef.current?.focus();
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  // TipTap Editor (matching StudyTipTap setup)
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "tiptap-heading",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "tiptap-highlight",
        },
      }),
      Placeholder.configure({
        placeholder: "Your generated notes will appear here...",
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        },
      }),
      ListItem,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px]",
      },
    },
    onUpdate: ({ editor }) => {
      // Extract headings from content
      extractHeadings(editor.getHTML());
    },
  });

  // Extract headings from HTML content
  const extractHeadings = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const h1Elements = doc.querySelectorAll("h1, h2");
    const newHeadings: string[] = [];
    h1Elements.forEach((el) => {
      const text = el.textContent?.trim();
      if (text && text.length > 0) {
        newHeadings.push(text);
      }
    });
    setHeadings(newHeadings);
  };

  const sampleTexts = [
    "The Industrial Revolution, which took place from the 18th to 19th centuries, was a period during which predominantly agrarian, rural societies in Europe and America became industrial and urban. Prior to the Industrial Revolution, which began in Britain in the late 1700s, manufacturing was often done in people's homes, using hand tools or basic machines.",
    "Quantum computing is a type of computation that harnesses the collective properties of quantum states, such as superposition, interference, and entanglement, to perform calculations. The devices that perform quantum computations are known as quantum computers.",
    "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, such as through variations in the solar cycle. But since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas.",
  ];

  const generateNotes = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);

    try {
      // Limit text to 10000 characters for guest endpoint
      const textToSend = inputText.slice(0, 10000);
      if (inputText.length > 10000) {
        console.warn("Text truncated to 10000 characters for notes generation");
      }

      const res = await fetch(`${API_BASE_URL}/guest/generate-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: textToSend,
          // Optional: topic and levelOfDetail can be added later if needed
        }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          fullContent += text;
        }
      }
      
      // Try to parse as JSON (API might return JSON with title and notes)
      let notesHtml = fullContent;
      try {
        // Try to parse the full content as JSON
        const jsonData = JSON.parse(fullContent);
        if (jsonData.title) {
          setTitle(jsonData.title);
        }
        if (jsonData.notes) {
          notesHtml = jsonData.notes;
        }
      } catch {
        // If not JSON, treat as HTML and extract title from first h1 tag
        const titleMatch = fullContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
        if (titleMatch) {
          const titleText = titleMatch[1].replace(/<[^>]*>/g, "").trim();
          if (titleText) {
            setTitle(titleText);
          }
        }
      }
      
      // Set the notes content in the editor
      editor?.commands.setContent(notesHtml);
      setHasGenerated(true);
    } catch (error) {
      console.error("Error generating notes:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleTrySample = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setInputText(randomText);
  };

  const handleCopy = () => {
    if (editor) {
      navigator.clipboard.writeText(editor.getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!editor) return;
    const blob = new Blob([editor.getHTML()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addNewHeading = () => {
    if (!editor) return;
    const romanNumeral = convertToRoman(headings.length + 1);
    editor.commands.insertContent({
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: `${romanNumeral}. New Section` }],
    });
    editor.commands.focus("end");
  };

  const convertToRoman = (num: number) => {
    const romanNumerals: Record<string, number> = {
      M: 1000, CM: 900, D: 500, CD: 400, C: 100,
      XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1,
    };
    let roman = "";
    for (const key in romanNumerals) {
      while (num >= romanNumerals[key]) {
        roman += key;
        num -= romanNumerals[key];
      }
    }
    return roman;
  };

  const scrollToHeading = (index: number) => {
    const headingElements = document.getElementsByClassName("tiptap-heading");
    const headingElement = headingElements[index] as HTMLElement;
    if (headingElement) {
      headingElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const SkeletonLoader = () => (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2">
        <StickyNote className="w-4 h-4 text-[#6366f1] animate-pulse" />
        <span className="text-sm text-muted-foreground">Generating your notes...</span>
      </div>
      <div className="space-y-4">
        <div className="animate-pulse h-8 w-2/3 rounded bg-[#6366f1]/10"></div>
        <div className="animate-pulse h-6 w-1/2 rounded bg-[#6366f1]/10"></div>
        <div className="space-y-2">
          <div className="animate-pulse h-4 w-full rounded bg-[#6366f1]/10"></div>
          <div className="animate-pulse h-4 w-5/6 rounded bg-[#6366f1]/10"></div>
          <div className="animate-pulse h-4 w-4/5 rounded bg-[#6366f1]/10"></div>
        </div>
        <div className="animate-pulse h-6 w-1/3 rounded bg-[#6366f1]/10 mt-6"></div>
        <div className="space-y-2">
          <div className="animate-pulse h-4 w-full rounded bg-[#6366f1]/10"></div>
          <div className="animate-pulse h-4 w-3/4 rounded bg-[#6366f1]/10"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-6 md:pt-7 pb-3 md:pb-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-[36px] font-medium tracking-tight mb-2 md:mb-3 text-foreground leading-tight">
            Transform content into organized notes
          </h1>
          <p className="text-xs sm:text-sm md:text-[14px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered note generation from any source. Create structured, easy-to-review study notes instantly.
          </p>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="px-4 md:px-8 pb-10 md:pb-14">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Top Bar - Title & Actions */}
            {hasGenerated && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border gap-2">
                <div className="flex items-center gap-2 md:gap-3 flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base md:text-xl font-bold bg-transparent border-none outline-none flex-1 text-foreground"
                    placeholder="Untitled Notes"
                  />
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Button variant="default" size="sm" className="text-[11px] md:text-sm">
                    <Layers className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Flashcards
                  </Button>
                  <Button variant="default" size="sm" className="text-[11px] md:text-sm">
                    <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Mindmaps
                  </Button>
                </div>
              </div>
            )}

            {/* Content Area */}
            {!hasGenerated ? (
              /* Input View - Clean QuillBot Style */
              <div className="p-4 md:p-5 min-h-[300px] md:min-h-[400px] flex flex-col">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const text = event.target?.result as string;
                        setInputText(text);
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="hidden"
                />

                {/* Top Section: Instruction + Buttons */}
                <div className="mb-3">
                  <p className="text-[12px] md:text-sm text-muted-foreground mb-2 md:mb-3">
                    To generate notes, add text, or upload a file (.docx)
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <button
                      onClick={handlePaste}
                      className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-sm font-medium text-[#8b5cf6] border border-[#8b5cf6]/30 rounded-full hover:bg-[#8b5cf6]/5 transition-colors"
                    >
                      <ClipboardIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      Paste text
                    </button>
                    <button
                      onClick={() => setShowSignupModal(true)}
                      className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8b5cf6] border border-[#8b5cf6]/30 rounded-full hover:bg-[#8b5cf6]/5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload file
                    </button>
                    <button
                      onClick={handleTrySample}
                      className="px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Try sample
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Start typing or paste your content here..."
                  className="flex-1 w-full min-h-[180px] md:min-h-[280px] bg-transparent text-foreground placeholder-muted-foreground/50 resize-none focus:outline-none border-0 focus:border-0 focus:ring-0 text-[13px] md:text-base leading-relaxed"
                />

                {/* Bottom Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                  <span className="text-[11px] md:text-sm text-muted-foreground">
                    {inputText.split(/\s+/).filter(Boolean).length}/25000 words
                  </span>
                  <Button
                    onClick={generateNotes}
                    disabled={isLoading || !inputText.trim()}
                    variant={inputText.trim() ? "default" : "outline"}
                    className="text-[10px] md:text-sm px-2.5 md:px-4 py-1 md:py-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-2.5 h-2.5 md:w-4 md:h-4 mr-0.5 md:mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate notes"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Notes View - Split Layout with Headings */
              <div className="flex flex-col md:flex-row" style={{ minHeight: "400px" }}>
                {/* Headings Sidebar */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border p-3 md:p-4 bg-muted/10 overflow-y-auto md:h-[700px]">
                  <button
                    onClick={addNewHeading}
                    className="flex items-center gap-2 text-sm text-[#6366f1] hover:text-[#6366f1]/80 mb-4 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add heading
                  </button>

                  {/* Title */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground line-clamp-2">{title}</p>
                  </div>

                  {/* Headings List */}
                  <div className="space-y-1">
                    {headings.map((heading, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToHeading(index)}
                        className="flex items-start gap-2 w-full text-left py-1.5 px-2 rounded-md hover:bg-muted transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 mt-1 text-muted-foreground group-hover:text-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground line-clamp-2">
                          {heading}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 flex flex-col md:h-[700px] overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between px-4 md:px-6 py-2 md:py-3 border-b border-border/50 bg-muted/10 shrink-0 gap-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>{editor?.storage.characterCount?.words() || 0} words</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Export
                      </button>
                      <button
                        onClick={() => {
                          setHasGenerated(false);
                          editor?.commands.setContent("");
                          setHeadings([]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        New
                      </button>
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-[300px] md:min-h-0">
                    {isLoading ? (
                      <SkeletonLoader />
                    ) : (
                      <EditorContent
                        editor={editor}
                        className="h-full [&_.ProseMirror]:min-h-[400px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:pr-4
                          [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:text-foreground
                          [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:text-foreground
                          [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-medium [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-4
                          [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_p]:leading-relaxed
                          [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ul]:space-y-2
                          [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:mb-4
                          [&_.ProseMirror_li]:mb-2 [&_.ProseMirror_li]:leading-relaxed
                          [&_.ProseMirror_mark]:px-1 [&_.ProseMirror_mark]:py-0.5 [&_.ProseMirror_mark]:rounded
                          [&_.ProseMirror_mark[data-color='#fef08a']]:bg-yellow-200 [&_.ProseMirror_mark[data-color='#fef08a']]:dark:bg-yellow-800
                          [&_.ProseMirror_mark[data-color='#bfdbfe']]:bg-blue-200 [&_.ProseMirror_mark[data-color='#bfdbfe']]:dark:bg-blue-800
                          [&_.ProseMirror_mark[data-color='#fecaca']]:bg-red-200 [&_.ProseMirror_mark[data-color='#fecaca']]:dark:bg-red-800
                          [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-[#6366f1]/30 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic
                          [&_.ProseMirror_hr]:my-6 [&_.ProseMirror_hr]:border-border"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
        {/* Signup Modal */}
        <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />

      {/* Who Can Use Section */}
      <section className="py-18 px-6 lg:pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Who can use AI Notes?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              { icon: GraduationCap, title: "Students", desc: "Turn textbook chapters and lecture recordings into organized, highlighted study notes in seconds." },
              { icon: BookOpen, title: "Educators", desc: "Generate structured lesson summaries and handouts from any source material for your students." },
              { icon: FileText, title: "Researchers", desc: "Distill dense academic papers into clear, structured notes with key terms automatically highlighted." },
              { icon: PenLine, title: "Writers", desc: "Organize research materials and source content into well-structured reference notes for your projects." },
              { icon: Palette, title: "Professionals", desc: "Convert meeting transcripts, training materials, and reports into actionable, organized notes." },
              { icon: Lightbulb, title: "Lifelong learners", desc: "Transform any online article, course material, or book into study-ready notes with smart formatting." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3.5">
                    <Icon className="w-4.5 h-4.5 text-[#6366f1]" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 md:py-18 px-4 md:px-6 pt-8 md:pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-[36px] font-medium text-center text-foreground mb-12 md:mb-18 leading-tight">
            From raw content to study-ready notes
          </h2>

          {/* Feature 1 — Smart formatting */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center mb-16 md:mb-24">
            <div className="rounded-xl md:rounded-2xl bg-secondary/40 border border-border p-5 md:p-7">
              <div className="space-y-2 md:space-y-3">
                <div className="text-base md:text-lg font-semibold text-foreground">I. Introduction</div>
                <div className="ml-3 md:ml-4 space-y-1.5 md:space-y-2">
                  <div className="flex items-start gap-1.5 md:gap-2">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#6366f1] mt-1.5 md:mt-2 shrink-0"></span>
                    <span className="text-[12px] md:text-sm text-muted-foreground">Key concept with <span className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">highlighted terms</span></span>
                  </div>
                  <div className="flex items-start gap-1.5 md:gap-2">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#6366f1] mt-1.5 md:mt-2 shrink-0"></span>
                    <span className="text-[12px] md:text-sm text-muted-foreground">Supporting detail with context</span>
                  </div>
                </div>
                <div className="text-base md:text-lg font-semibold text-foreground mt-3 md:mt-4">II. Key Findings</div>
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl lg:text-[25px] font-medium text-foreground mb-2.5 md:mb-3.5 leading-snug">
                Smart formatting with<br />key term highlighting
              </h3>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed max-w-md">
                AI automatically structures content with headings, bullet points, and color-coded highlights for key terms — making review fast and effective.
              </p>
            </div>
          </div>

          {/* Feature 2 — Rich text editor */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center mb-16 md:mb-24">
            <div className="order-2 md:order-1">
              <h3 className="text-xl md:text-2xl lg:text-[25px] font-medium text-foreground mb-2.5 md:mb-3.5 leading-snug">
                Full rich text<br />editing power
              </h3>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Edit every detail with a built-in rich text editor. Add headings, format text, create lists, and customize highlights — your notes, your way.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-xl md:rounded-2xl bg-secondary/40 border border-border p-5 md:p-7">
              <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6">
                {["Bold", "Italic", "Highlight", "H1", "H2", "List"].map((t, i) => (
                  <span key={t} className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium ${i === 2 ? "bg-[#6366f1] text-[#ffffff]" : "bg-muted text-muted-foreground"}`}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[12px] md:text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Full editing toolbar with formatting, headings, lists, and color-coded highlights...
              </p>
            </div>
          </div>

          {/* Feature 3 — Export anywhere */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
            <div className="rounded-xl md:rounded-2xl bg-secondary/40 border border-border p-5 md:p-7">
              <div className="space-y-2 md:space-y-3">
                {[
                  { label: "Copy to clipboard", color: "bg-blue-500" },
                  { label: "Download as HTML", color: "bg-emerald-500" },
                  { label: "Export to PDF", color: "bg-amber-500" },
                  { label: "Convert to Flashcards", color: "bg-violet-500" },
                  { label: "Generate Mindmap", color: "bg-rose-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 md:gap-3 py-1.5 md:py-2 px-2 md:px-3 rounded-lg">
                    <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.color}`}></span>
                    <span className="text-[12px] md:text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl lg:text-[25px] font-medium text-foreground mb-2.5 md:mb-3.5 leading-snug">
                Export anywhere,<br />study everywhere
              </h3>
              <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed max-w-md">
                Copy notes to clipboard, download as HTML, export to PDF, or convert directly into flashcards and mindmaps for a complete study workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Generate notes in just 3 easy steps:
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Paste your content", desc: "Drop in any source material — textbook chapters, articles, transcripts, or research papers." },
              { step: "2", title: "Generate notes", desc: "Our AI structures the content into organized notes with headings, bullet points, and highlights." },
              { step: "3", title: "Review and export", desc: "Edit the notes to your liking, then copy, download, or convert to flashcards and mindmaps." },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-12 h-12 rounded-lg bg-[#6366f1] flex items-center justify-center mb-4">
                  <span className="text-xl font-semibold text-[#ffffff]">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-sm text-[14px] text-muted-foreground leading-relaxed max-w-md">{item.desc}</p>
              </div>
            ))}
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
              { q: "Is there a free plan?", a: "Yes! All users who sign up get access to 10 free credits daily, which can be used across all our tools including Notes." },
              { q: "What kind of content can I generate notes from?", a: "Any text — textbook chapters, lecture transcripts, research papers, articles, meeting notes, and more. Our AI structures it all into organized notes." },
              { q: "Can I edit the generated notes?", a: "Absolutely. You get a full rich text editor with headings, bold, italic, lists, highlights, and more. Customize every detail." },
              { q: "What are credits?", a: "Credits are the in-app currency for Conch that allows you to generate notes, simplify text, create flashcards, and more. Each action costs 1 to 4 credits." },
              { q: "Can I convert notes to flashcards?", a: "Yes! With one click you can convert your generated notes into a flashcard set or a visual mindmap for a complete study workflow." },
              { q: "What export formats are supported?", a: "You can copy to clipboard, download as HTML, export to PDF, or convert directly into flashcards and mindmaps." },
              { q: "Does it highlight key terms?", a: "Yes! Our AI automatically identifies and highlights key terms using color-coded highlights — yellow, blue, and red — making review fast and effective." },
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
            Start taking smarter notes
          </h2>
          <p className="text-[14px] text-muted-foreground mb-7 max-w-md mx-auto">
            Join students and professionals who save hours with AI note generation.
          </p>
          <Button variant="default" className="text-[14px] px-5 py-2" onClick={() => textareaRef.current?.focus()}>
            Generate Free Notes
            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotesFeature;
