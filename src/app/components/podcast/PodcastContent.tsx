"use client";

import { useState } from "react";
import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Headphones,
  Mic,
  Pause,
  Play,
  Users,
  Volume2,
} from "lucide-react";
import { VOICE_PERSONALITIES, VoiceItem } from "./PodcastHostVoices";

interface PodcastContentProps {
  voices: VoiceItem[];
  previewVoiceId: string | null;
  onVoicePreview: (voiceId: string, previewUrl?: string | null) => void;
  onScrollToTop?: () => void;
}

const FAQS = [
  { q: "What file types can I use?", a: "You can upload PDF, DOCX, PPTX, and TXT files. Up to 3 files per podcast, with a maximum size of 10MB each." },
  { q: "How long does generation take?", a: "Typically 1-3 minutes depending on document length and number of hosts. You'll see real-time progress during generation." },
  { q: "How many free podcasts do I get?", a: "Guest users get 2 free podcast generations. Sign up for Conch to get more credits and access all features." },
  { q: "Can I choose different languages?", a: "Yes! We support 9 languages including English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, and Chinese." },
  { q: "Can I download the podcast?", a: "Yes, every generated podcast can be downloaded as an MP3 file for offline listening." },
  { q: "How many hosts can I have?", a: "You can configure 1 to 4 hosts, each with their own unique voice and name. More hosts create more dynamic conversations." },
];

const DEFAULT_VOICES = [
  { voiceId: "echo", name: "Echo", previewImageUrl: null, previewUrl: null, color: "#4F46E5", description: "Deep & Resonant", gender: "male" },
  { voiceId: "nova", name: "Nova", previewImageUrl: null, previewUrl: null, color: "#EC4899", description: "Bright & Energetic", gender: "female" },
  { voiceId: "fable", name: "Fable", previewImageUrl: null, previewUrl: null, color: "#059669", description: "Expressive & British", gender: "male" },
  { voiceId: "shimmer", name: "Shimmer", previewImageUrl: null, previewUrl: null, color: "#8B5CF6", description: "Clear & Melodic", gender: "female" },
  { voiceId: "onyx", name: "Onyx", previewImageUrl: null, previewUrl: null, color: "#1F2937", description: "Authoritative & Bold", gender: "male" },
  { voiceId: "coral", name: "Coral", previewImageUrl: null, previewUrl: null, color: "#F97316", description: "Expressive & Warm", gender: "female" },
];

const PodcastContent = ({ voices, previewVoiceId, onVoicePreview, onScrollToTop }: PodcastContentProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const displayVoices = voices.length > 0 ? voices.slice(0, 6) : DEFAULT_VOICES;

  return (
    <>
      {/* Voice Hosts Showcase */}
      <section className="relative px-4 md:px-8 pb-14 md:pb-18 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.06)_0%,_transparent_65%)]" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6366f1]/8 px-3.5 py-1.5 mb-3">
              <Volume2 className="w-3.5 h-3.5 text-[#6366f1]" />
              <span className="text-[12px] font-semibold text-[#6366f1] tracking-wide">Preview Voices</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2 leading-tight">
              Meet the AI Voices
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Click any voice to hear a preview. Choose from {voices.length || 6} distinct personalities for your podcast hosts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {displayVoices.map((voice, i) => {
              const personality = VOICE_PERSONALITIES[voice.voiceId] || VOICE_PERSONALITIES.echo;
              const hex = voice.color || personality.hex;
              const isPlaying = previewVoiceId === voice.voiceId;

              return (
                <div
                  key={voice.voiceId}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer hero-voice-card transition-all duration-300 ${
                    isPlaying
                      ? "ring-2 ring-[#6366f1] shadow-xl shadow-[#6366f1]/15 scale-[1.02]"
                      : "shadow-md hover:shadow-lg hover:scale-[1.01]"
                  }`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onClick={() => onVoicePreview(voice.voiceId, voice.previewUrl)}
                >
                  <div className="aspect-[3/4] relative">
                    {voice.previewImageUrl ? (
                      <img
                        src={voice.previewImageUrl}
                        alt={voice.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                          isPlaying ? "scale-105" : "group-hover:scale-105"
                        }`}
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(160deg, ${hex}50 0%, ${hex}20 40%, rgba(20,20,20,0.95) 100%)` }}
                      />
                    )}
                    <div className={`absolute inset-0 transition-all duration-300 ${
                      isPlaying
                        ? "bg-gradient-to-t from-black/90 via-black/50 to-black/20"
                        : "bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    }`} />

                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      <div className={`flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 ${
                        isPlaying
                          ? "w-12 h-12 bg-[#6366f1] shadow-lg shadow-[#6366f1]/40"
                          : "w-10 h-10 bg-white/20 group-hover:bg-white/30"
                      }`}>
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-white" fill="currentColor" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                        )}
                      </div>
                    </div>

                    {isPlaying && (
                      <div className="absolute bottom-12 left-3 right-3 flex items-end justify-center gap-[3px] h-6">
                        {[0.4, 0.8, 0.5, 0.9, 0.6, 0.7, 0.4, 0.8, 0.5, 0.7, 0.6, 0.9].map((h, j) => (
                          <div
                            key={j}
                            className="w-[3px] rounded-full bg-white animate-waveform"
                            style={{
                              height: `${h * 100}%`,
                              animationDelay: `${j * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-medium text-white/70 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5 capitalize">
                        {voice.gender || personality.description.split(" ")[0]}
                      </span>
                    </div>

                    {isPlaying && (
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 bg-[#6366f1] rounded-full px-2 py-0.5">
                          <div className="relative">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-60" />
                          </div>
                          <span className="text-[8px] font-bold text-white uppercase tracking-wider">Live</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-[13px] font-bold text-white leading-tight">{voice.name || voice.voiceId}</div>
                      <div className="text-[10px] text-white/50 leading-tight mt-0.5">{personality.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[12px] text-muted-foreground/60 mt-5">
            Click any voice card to preview · All voices available when generating
          </p>
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
            <div className="rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
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
            <div className="order-1 md:order-2 rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex flex-col gap-3">
                {(() => {
                  const voiceCards = voices.length > 0
                    ? voices.slice(0, 2).map((v) => ({
                        name: v.name,
                        desc: v.description,
                        imageUrl: v.previewImageUrl,
                        color: v.color || VOICE_PERSONALITIES[v.voiceId]?.hex || "#6366f1",
                      }))
                    : [
                        { name: "Echo", desc: "Deep & Resonant", imageUrl: null, color: "#4F46E5" },
                        { name: "Nova", desc: "Bright & Energetic", imageUrl: null, color: "#EC4899" },
                      ];

                  return voiceCards.map((v) => (
                    <div key={v.name} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-100 dark:border-gray-700">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={v.name} className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: v.color }}>
                          {v.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-[12px] font-medium text-foreground">{v.name}</p>
                        <p className="text-[10px] text-muted-foreground">{v.desc}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="rounded-2xl overflow-hidden max-w-[300px] mx-auto md:mx-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <Headphones className="w-4 h-4 text-[#6366f1]" />
                  <span className="text-[11px] font-medium text-foreground">Full Player Controls</span>
                </div>
                <div className="flex items-center gap-3 justify-center py-2">
                  <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <span className="text-[9px] text-gray-500">-15</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center">
                    <span className="text-white text-[12px]">&#9654;</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <span className="text-[9px] text-gray-500">+15</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 relative">
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
            <Badge className="bg-[#f4f3f8] dark:bg-gray-800 text-muted-foreground border-0 mb-5 px-3.5 py-1.5 rounded-full font-normal text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mr-1.5 inline-block"></span>
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-[40px] font-medium text-foreground">
              Got Questions?
            </h2>
          </div>

          <div className="space-y-1">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`px-5 py-4 cursor-pointer rounded-2xl transition-all duration-200 ${
                  openFaq === i
                    ? "bg-[#f4f3f8] dark:bg-gray-800 border-l-2 border-l-[#6366f1]"
                    : "hover:bg-[#f4f3f8]/40 dark:hover:bg-gray-800/30 border-l-2 border-l-transparent"
                }`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-[15px] transition-colors ${openFaq === i ? "text-foreground font-medium" : "text-foreground"}`}>{faq.q}</p>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-300 flex-shrink-0 ml-3.5 ${openFaq === i ? "rotate-180 text-[#6366f1]" : ""}`} />
                </div>
                {openFaq === i && (
                  <p className="text-muted-foreground leading-relaxed mt-3 text-[13px]">
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
          {onScrollToTop && (
            <Button
              variant="default"
              className="text-[14px] px-5 py-2"
              onClick={onScrollToTop}
            >
              Try it now — it&apos;s free
              <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </section>
    </>
  );
};

export default PodcastContent;
