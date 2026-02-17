"use client";

import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import Footer from "@/app/components/ui/Footer";
import { CheckerFeature } from "./CheckerSidebar";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileText,
  GraduationCap,
  MessageSquare,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SignupModal from "../SignupModal";
import { useAppContext } from "@/context/AppContext";
import { Session } from "@/context/SessionContext";
import ChatUploadArea from "../chat/ChatUploadArea";
import ChatHeader from "../chat/ChatHeader";
import ChatPresetQuestions from "../chat/ChatPresetQuestions";
import ChatMessage from "../chat/ChatMessage";
import ChatInput from "../chat/ChatInput";

interface ChatFeatureProps {
  onFeatureSelect?: (feature: CheckerFeature) => void;
  session: Session;
  handleLoggedIn: () => void;
}

interface ChatEntry {
  question: string;
  response: string;
}

const ChatFeature = ({ onFeatureSelect, session, handleLoggedIn }: ChatFeatureProps) => {
  const { checkLimit, incrementUsage } = useAppContext();
  const [documentText, setDocumentText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai/chat/parse-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errorMsg = "Failed to parse file";
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {
          // Server returned non-JSON (e.g. HTML error page)
          errorMsg = `Server error (${res.status}). Check the terminal for details.`;
        }
        setUploadError(errorMsg);
        return;
      }

      const data = await res.json();
      setDocumentText(data.text);
      setFileName(data.fileName);
      setChatHistory([]);
      setSuggestions([]);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchSuggestions = (history: ChatEntry[]) => {
    fetch("/api/ai/chat/stream-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generateSuggestions: true,
        documentText,
        chatHistory: history,
      }),
    })
      .then((r) => r.json())
      .then((d) => setSuggestions(d.suggestions || []))
      .catch(() => setSuggestions([]))
      .finally(() => setIsLoadingSuggestions(false));
  };

  const handleSendMessage = async (question: string) => {
    // if (session?.isLoggedIn) {
    //   handleLoggedIn();
    //   return;
    // }

    if (!checkLimit("chat")) {
      setShowSignupModal(true);
      return;
    }

    setIsStreaming(true);
    // Add entry with empty response (will stream in)
    const newEntry: ChatEntry = { question, response: "" };
    setChatHistory((prev) => [...prev, newEntry]);

    try {
      const res = await fetch("/api/ai/chat/stream-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          documentText,
          chatHistory: chatHistory,
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
          setChatHistory((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = { ...last, response: last.response + text };
            return updated;
          });
        }
      }

      incrementUsage("chat");

      // Fetch follow-up suggestions from the same chat endpoint
      setIsLoadingSuggestions(true);
      setChatHistory((prev) => {
        fetchSuggestions(prev);
        return prev;
      });
    } catch (error) {
      console.error("Chat stream error:", error);
      setChatHistory((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = {
          ...last,
          response: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewChat = () => {
    setChatHistory([]);
  };

  const handleUploadNew = () => {
    setDocumentText("");
    setFileName(null);
    setChatHistory([]);
    setUploadError(null);
    setSuggestions([]);
  };

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-6 md:pt-7 pb-3 md:pb-4 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center" ref={topRef}>
          <h1 className="text-xl sm:text-2xl md:text-[36px] font-medium tracking-tight mb-2 md:mb-3 text-foreground leading-tight">
            Chat with your documents
          </h1>
          <p className="text-xs sm:text-sm md:text-[14px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload any document and ask AI-powered questions. Get instant answers from your PDFs, Word docs, and presentations.
          </p>
        </div>
      </section>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatHeader
              fileName={fileName}
              onNewChat={handleNewChat}
              onUploadNew={handleUploadNew}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(false)}
            />

            <div ref={isFullscreen ? chatContainerRef : undefined} className={`flex-1 min-h-0 overflow-y-auto ${
              chatHistory.length > 0 ? "bg-gradient-to-b from-gray-50/30 to-white" : ""
            }`}>
              {!documentText ? (
                <ChatUploadArea
                  onFileSelected={handleFileUpload}
                  isUploading={isUploading}
                />
              ) : chatHistory.length === 0 ? (
                <ChatPresetQuestions onSelect={handleSendMessage} suggestions={suggestions} isLoadingSuggestions={isLoadingSuggestions} />
              ) : (
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                  {chatHistory.map((entry, i) => (
                    <ChatMessage
                      key={i}
                      question={entry.question}
                      response={entry.response}
                      isStreaming={isStreaming && i === chatHistory.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>

            {uploadError && (
              <div className="px-4 py-2.5 bg-red-50/80 border-t border-red-100/60">
                <p className="text-[12px] text-red-500 font-medium">{uploadError}</p>
              </div>
            )}

            {documentText && chatHistory.length > 0 && !isStreaming && (
              <div className="max-w-4xl mx-auto w-full">
                <ChatPresetQuestions onSelect={handleSendMessage} compact suggestions={suggestions} isLoadingSuggestions={isLoadingSuggestions} />
              </div>
            )}

            {documentText && (
              <div className="max-w-4xl mx-auto w-full">
                <ChatInput
                  onSend={handleSendMessage}
                  disabled={!documentText || isStreaming}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Section */}
      <section className={`px-4 md:px-8 pb-10 md:pb-14 ${isFullscreen ? "hidden" : ""}`}>
        <div className="max-w-5xl mx-auto relative">
          {/* Ambient glow behind card */}
          {documentText && (
            <div className="absolute -inset-4 bg-gradient-to-b from-[#6366f1]/[0.04] via-transparent to-transparent rounded-3xl pointer-events-none" />
          )}
          <div className={`relative bg-white rounded-2xl md:rounded-[20px] border overflow-hidden flex flex-col transition-all duration-500 ease-out ${
            documentText
              ? "min-h-[560px] max-h-[75vh] border-gray-200/80 shadow-xl shadow-gray-200/40"
              : "min-h-[380px] max-h-[460px] border-gray-200 shadow-lg shadow-gray-100/60"
          }`}>
            <ChatHeader
              fileName={fileName}
              onNewChat={handleNewChat}
              onUploadNew={handleUploadNew}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(true)}
            />

            {/* Content Area */}
            <div ref={!isFullscreen ? chatContainerRef : undefined} className={`flex-1 min-h-0 overflow-y-auto ${
              chatHistory.length > 0 ? "bg-gradient-to-b from-gray-50/30 to-white" : ""
            }`}>
              {!documentText ? (
                <ChatUploadArea
                  onFileSelected={handleFileUpload}
                  isUploading={isUploading}
                />
              ) : chatHistory.length === 0 ? (
                <ChatPresetQuestions onSelect={handleSendMessage} suggestions={suggestions} isLoadingSuggestions={isLoadingSuggestions} />
              ) : (
                <div className="p-4 md:p-5">
                  {chatHistory.map((entry, i) => (
                    <ChatMessage
                      key={i}
                      question={entry.question}
                      response={entry.response}
                      isStreaming={isStreaming && i === chatHistory.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="px-4 py-2.5 bg-red-50/80 border-t border-red-100/60">
                <p className="text-[12px] text-red-500 font-medium">{uploadError}</p>
              </div>
            )}

            {/* Compact suggestions above input when chat has messages */}
            {documentText && chatHistory.length > 0 && !isStreaming && (
              <ChatPresetQuestions onSelect={handleSendMessage} compact suggestions={suggestions} isLoadingSuggestions={isLoadingSuggestions} />
            )}

            {/* Input bar */}
            {documentText && (
              <ChatInput
                onSend={handleSendMessage}
                disabled={!documentText || isStreaming}
              />
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights — Alternating Image + Text */}
      <section className="py-18 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-18 leading-tight">
            Understand documents instantly
          </h2>

          {/* Feature 1 — Upload any format */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24 pt-10">
            <div className="rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6366f1]/12 to-[#8b5cf6]/8 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#6366f1]" />
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { label: "PDF", color: "#ef4444" },
                    { label: "DOCX", color: "#3b82f6" },
                    { label: "PPTX", color: "#f97316" },
                  ].map((ft) => (
                    <span key={ft.label} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white" style={{ backgroundColor: ft.color }}>
                      {ft.label}
                    </span>
                  ))}
                </div>
                <div className="w-full space-y-2 mt-1">
                  <div className="h-2 rounded-full bg-gray-100 w-full" />
                  <div className="h-2 rounded-full bg-gray-100 w-4/5" />
                  <div className="h-2 rounded-full bg-gray-100 w-3/5" />
                </div>
              </div>
            </div>
            <div className="max-w-[270px] md:max-w-md mx-auto md:mx-0">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Upload any document<br />format
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Drop in PDFs, Word documents, or PowerPoint presentations. Our AI extracts and analyzes text from all major document formats instantly.
              </p>
            </div>
          </div>

          {/* Feature 2 — Real-time streaming */}
          <div className="grid md:grid-cols-2 gap-14 items-center mb-24">
            <div className="order-2 md:order-1 max-w-[270px] md:max-w-md mx-auto md:mx-0">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Real-time answers,<br />no waiting
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Watch answers stream in word by word as the AI analyzes your document. Start reading instantly while it crafts detailed, context-aware responses.
              </p>
            </div>
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <div className="bg-gradient-to-br from-[#6366f1] to-[#7c3aed] text-white rounded-2xl rounded-br-sm px-3.5 py-2.5 max-w-[80%]">
                    <p className="text-[11px] leading-relaxed">What are the key findings?</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#6366f1]/12 to-[#8b5cf6]/8 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-[#6366f1]" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                    <p className="text-[11px] text-gray-600 leading-relaxed">The study reveals three major findings regarding<span className="inline-block w-[2px] h-[11px] bg-[#6366f1]/70 animate-pulse ml-0.5 align-middle rounded-full" /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 — Smart follow-ups */}
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col gap-3">
                <p className="text-[11px] text-gray-500 text-center mb-1">Suggested follow-ups</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {["What methodology was used?", "Summarize conclusions", "Compare with prior research"].map((q) => (
                    <span key={q} className="px-2.5 py-1.5 rounded-lg border border-gray-100 bg-white text-[10px] text-gray-500 hover:border-[#6366f1]/30 hover:text-gray-700 transition-colors">
                      {q}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white border border-gray-100 px-3 py-2 mt-1">
                  <div className="h-1.5 rounded-full bg-gray-100 flex-1" />
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center">
                    <ArrowRight className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-[270px] md:max-w-md mx-auto md:mx-0">
              <h3 className="text-2xl md:text-[25px] font-medium text-foreground mb-3.5 leading-snug">
                Smart follow-up<br />suggestions
              </h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                After each answer, the AI suggests relevant follow-up questions based on your document and conversation. Dive deeper without having to think of the next question.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Use Section */}
      <section className="py-18 px-6 pt-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-medium text-center text-foreground mb-14 leading-tight">
            Who can use Document Chat?
          </h2>

          <div className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {[
              { icon: GraduationCap, title: "Students", desc: "Quickly understand complex textbook chapters, research papers, and study materials by asking questions directly." },
              { icon: BookOpen, title: "Researchers", desc: "Analyze academic papers efficiently. Extract key findings, methodologies, and conclusions in seconds." },
              { icon: FileText, title: "Professionals", desc: "Digest lengthy reports, contracts, and business documents without reading every page. Get straight to the answers." },
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
              { q: "What file types are supported?", a: "You can upload PDF, DOCX, and PPTX files. Legacy .doc and .ppt formats are not supported \u2014 please convert them to their modern equivalents first." },
              { q: "Is there a file size limit?", a: "Yes, the maximum file size is 10MB. For larger documents, try splitting them into smaller sections." },
              { q: "How many free messages do I get?", a: "Guest users get 3 free chat messages. Sign up for Conch to get more credits and access all features." },
              { q: "Is my document stored?", a: "No. Your document is processed in-session only and is not stored on our servers. Once you close the tab or upload a new document, the previous content is gone." },
              { q: "Can the AI answer questions not in the document?", a: "The AI focuses on answering based on the document content. If the answer isn't in the document, it will let you know rather than making something up." },
              { q: "Does it support multiple languages?", a: "Yes! The AI can analyze documents and answer questions in multiple languages including English, Spanish, French, German, Chinese, Japanese, and more." },
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
            Ready to chat with your docs?
          </h2>
          <p className="text-[14px] text-muted-foreground mb-7 max-w-md mx-auto">
            Upload a document and start asking questions instantly.
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
        content="You've reached your free chat limit. Sign up for Conch to continue chatting with your documents."
      />

      <Footer onFeatureSelect={onFeatureSelect as (feature: CheckerFeature) => void} />
    </div>
  );
};

export default ChatFeature;
