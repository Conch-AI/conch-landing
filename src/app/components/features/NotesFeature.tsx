"use client";

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
import Image from "next/image";
import { useRef, useState } from "react";

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
      generateSampleNotes();
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleNotes = () => {
    const sampleContent = `
      <h1>Solving Equations and Functions: A High School Algebra Primer</h1>
      <h2>Introduction to Quadratic Equations</h2>
      <ul class="list-disc">
        <li>Quadratic equations are second-degree polynomial equations of the form <mark data-color="#fef08a">ax^2 + bx + c = 0</mark>, where <mark data-color="#fef08a">a</mark>, <mark data-color="#bfdbfe">b</mark>, and <mark data-color="#fecaca">c</mark> are constants.</li>
        <li>There are three main methods to solve quadratic equations: <mark data-color="#fef08a">factoring</mark>, <mark data-color="#fef08a">completing the square</mark>, and using the <mark data-color="#fef08a">quadratic formula</mark>.</li>
        <li>The <mark data-color="#fef08a">quadratic formula</mark> is <mark data-color="#fef08a">x = (-b ± √(b^2 - 4ac)) / (2a)</mark>, which can be used to find the two solutions (or roots) of a quadratic equation.</li>
        <li>Quadratic equations can have real, complex, or no solutions depending on the values of <mark data-color="#bfdbfe">a</mark>, <mark data-color="#bfdbfe">b</mark>, and <mark data-color="#fecaca">c</mark>.</li>
        <li>Graphing quadratic equations reveals their <mark data-color="#fef08a">parabolic</mark> shape and the relationship between their solutions and their graph.</li>
      </ul>
      <h2>Solving Linear Equations</h2>
      <ul class="list-disc">
        <li>Linear equations are first-degree polynomial equations of the form <mark data-color="#fef08a">ax + b = 0</mark>, where <mark data-color="#bfdbfe">a</mark> and <mark data-color="#bfdbfe">b</mark> are constants.</li>
        <li>To solve a linear equation, the goal is to isolate the variable <mark data-color="#fef08a">x</mark> by performing inverse operations to both sides of the equation.</li>
        <li>Common methods for solving linear equations include addition, subtraction, multiplication, and division.</li>
      </ul>
      <h2>Introduction to Functions</h2>
      <ul class="list-disc">
        <li>A <mark data-color="#fef08a">function</mark> is a relation that assigns exactly one output value to each input value.</li>
        <li>Functions can be represented as equations, graphs, tables, or verbal descriptions.</li>
        <li>The <mark data-color="#fef08a">domain</mark> is the set of all possible input values, while the <mark data-color="#fef08a">range</mark> is the set of all possible output values.</li>
      </ul>
      <h2>Applications of Quadratic Equations</h2>
      <ul class="list-disc">
        <li>Quadratic equations model many real-world phenomena including projectile motion, area optimization, and revenue modeling.</li>
        <li>The vertex form <mark data-color="#fef08a">y = a(x-h)² + k</mark> is particularly useful for identifying maximum and minimum values.</li>
      </ul>
    `;

    setTitle("Solving Equations and Functions: A High School Algebra Primer");
    editor?.commands.setContent(sampleContent);
    setHasGenerated(true);
    extractHeadings(sampleContent);
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
    <div className="min-h-full bg-background text-foreground overflow-y-auto">
      {/* Hero Section */}
      <section className="pt-8 pb-4 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl md:text-[40px] font-medium tracking-tight mb-3 text-foreground leading-tight">
            Transform content into organized notes
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered note generation from any source. Create structured, easy-to-review study notes instantly.
          </p>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
            {/* Top Bar - Title & Actions */}
            {hasGenerated && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-bold bg-transparent border-none outline-none flex-1 text-foreground"
                    placeholder="Untitled Notes"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="default" size="sm" className="">
                    <Layers className="w-4 h-4" />
                    Flashcards
                  </Button>
                  <Button variant="default" size="sm" className="">
                    <Lightbulb className="w-4 h-4" />
                    Mindmaps
                  </Button>
                </div>
              </div>
            )}

            {/* Content Area */}
            {!hasGenerated ? (
              /* Input View - Clean QuillBot Style */
              <div className="p-5 min-h-[400px] flex flex-col">
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
                  <p className="text-sm text-muted-foreground mb-3">
                    To generate notes, add text, or upload a file (.docx)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePaste}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#6366f1] border border-[#6366f1]/30 rounded-full hover:bg-[#6366f1]/5 transition-colors"
                    >
                      <ClipboardIcon className="w-3.5 h-3.5" />
                      Paste text
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#6366f1] border border-[#6366f1]/30 rounded-full hover:bg-[#6366f1]/5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload file
                    </button>
                    <button
                      onClick={handleTrySample}
                      className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                  className="flex-1 w-full min-h-[280px] bg-transparent text-foreground placeholder-muted-foreground/50 resize-none focus:outline-none border-0 focus:border-0 focus:ring-0 text-base leading-relaxed"
                />

                {/* Bottom Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                  <span className="text-sm text-muted-foreground">
                    {inputText.split(/\s+/).filter(Boolean).length}/25000 words
                  </span>
                  <Button
                    onClick={generateNotes}
                    disabled={isLoading || !inputText.trim()}
                    variant={inputText.trim() ? "default" : "outline"}
                    className=""
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
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
              <div className="flex" style={{ height: "700px" }}>
                {/* Headings Sidebar */}
                <div className="w-64 border-r border-border p-4 bg-muted/10 overflow-y-auto h-full">
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
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-muted/10 shrink-0">
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
                  <div className="flex-1 overflow-y-auto p-6 min-h-0">
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

      {/* Who Can Use Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-medium text-center text-foreground mb-16 leading-tight">
            Who can use AI Notes?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-12 gap-y-14">
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
                  <div className="w-11 h-11 rounded-xl  bg-secondary  flex items-center justify-center mb-4">
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

      {/* Feature Highlights */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-medium text-center text-foreground mb-20 leading-tight">
            From raw content to study-ready notes
          </h2>

          {/* Feature 1 — Smart formatting */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-28">
            <div className="rounded-2xl bg-secondary/40 border border-border p-8">
              <div className="space-y-3">
                <div className="text-lg font-semibold text-foreground">I. Introduction</div>
                <div className="ml-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mt-2 shrink-0"></span>
                    <span className="text-sm text-muted-foreground">Key concept with <span className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">highlighted terms</span></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mt-2 shrink-0"></span>
                    <span className="text-sm text-muted-foreground">Supporting detail with context</span>
                  </div>
                </div>
                <div className="text-lg font-semibold text-foreground mt-4">II. Key Findings</div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-[28px] font-medium text-foreground mb-4 leading-snug">
                Smart formatting with<br />key term highlighting
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                AI automatically structures content with headings, bullet points, and color-coded highlights for key terms — making review fast and effective.
              </p>
            </div>
          </div>

          {/* Feature 2 — Rich text editor */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-28">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-[28px] font-medium text-foreground mb-4 leading-snug">
                Full rich text<br />editing power
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Edit every detail with a built-in rich text editor. Add headings, format text, create lists, and customize highlights — your notes, your way.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl bg-secondary/40 border border-border p-8">
              <div className="flex gap-2 mb-6">
                {["Bold", "Italic", "Highlight", "H1", "H2", "List"].map((t, i) => (
                  <span key={t} className={`px-2 py-1 rounded text-xs font-medium ${i === 2 ? "bg-[#6366f1] text-[#ffffff]" : "bg-muted text-muted-foreground"}`}>
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Full editing toolbar with formatting, headings, lists, and color-coded highlights...
              </p>
            </div>
          </div>

          {/* Feature 3 — Export anywhere */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="rounded-2xl bg-secondary/40 border border-border p-8">
              <div className="space-y-3">
                {[
                  { label: "Copy to clipboard", color: "bg-blue-500" },
                  { label: "Download as HTML", color: "bg-emerald-500" },
                  { label: "Export to PDF", color: "bg-amber-500" },
                  { label: "Convert to Flashcards", color: "bg-violet-500" },
                  { label: "Generate Mindmap", color: "bg-rose-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 py-2 px-3 rounded-lg">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-[28px] font-medium text-foreground mb-4 leading-snug">
                Export anywhere,<br />study everywhere
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Copy notes to clipboard, download as HTML, export to PDF, or convert directly into flashcards and mindmaps for a complete study workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-medium text-center text-foreground mb-16 leading-tight">
            Generate notes in just 3 easy steps:
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Paste your content", desc: "Drop in any source material — textbook chapters, articles, transcripts, or research papers." },
              { step: "2", title: "Generate notes", desc: "Our AI structures the content into organized notes with headings, bullet points, and highlights." },
              { step: "3", title: "Review and export", desc: "Edit the notes to your liking, then copy, download, or convert to flashcards and mindmaps." },
            ].map((item) => (
              <div key={item.step}>
                <div className="w-14 h-14 rounded-lg bg-[#6366f1] flex items-center justify-center mb-5">
                  <span className="text-xl font-semibold text-[#ffffff]">{item.step}</span>
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
      </section>

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
            Start taking smarter notes
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join students and professionals who save hours with AI note generation.
          </p>
          <Button variant="default" className="" onClick={() => textareaRef.current?.focus()}>
            Generate Free Notes
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pt-16 pb-8 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image src="/images/logos/logo.png" width={28} height={28} alt="Conch" />
                <span className="text-xl font-semibold text-foreground">Conch</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Work smarter, not harder</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></a>
              </div>
            </div>
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
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Simplify</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Stealth Mode</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Flashcards</a>
                  <a href="#" className="text-sm text-foreground hover:text-[#6366f1] transition-colors">Mindmaps</a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">Yofi Tech, LLC &middot; Copyright &copy; 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotesFeature;
