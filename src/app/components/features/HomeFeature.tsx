"use client";

import { Badge } from "@/app/ui/badge";
import { Button } from "@/app/ui/button";
import { ArrowRight, ChevronDown, FileText, Layers, Lightbulb, Shield, Star, Wand2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CheckerFeature } from "./CheckerSidebar";

interface HomeFeatureProps {
  onFeatureSelect: (feature: CheckerFeature) => void;
}

const HomeFeature = ({ onFeatureSelect }: HomeFeatureProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium text-foreground leading-tight">
              AI Writing That&apos;s
            </h1>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium text-foreground leading-tight mb-6">
              Undetectable
            </h2>
            <p className="text-xl md:text-2xl text-[#6366f1] mb-10">
              Draft papers, generate study sets, and humanize AI text
            </p>

            {/* Social Proof + CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                      <Image
                        src={`https://i.pravatar.cc/100?img=${i + 15}`}
                        alt="User avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-muted-foreground">Loved by 2M+ academics</span>
              </div>
              <Button variant="default" className="" onClick={() => onFeatureSelect("stealth")}>
                Work smarter — it&apos;s free
                <ArrowRight className="ml-2 w-4 h-4 -rotate-45" />
              </Button>
            </div>
          </div>

          {/* Demo Interface Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="flex">
                {/* Left - Text Content */}
                <div className="flex-1 p-8 text-left">
                  <p className="text-muted-foreground text-[15px] leading-relaxed">
                    an oil, canola oil, and sunflower oil, have been linked to various health issues due to
                    n-6 fatty acids. These oils are often heavily processed, leading to the formation of
                    as trans fats and oxidized lipids. Consuming seed oils in excess can contribute to
                    se, and other chronic conditions. It is crucial to limit the intake of these oils and opt
                    ike olive oil or coconut oil for better overall health. While the exact mechanisms by
                    tribute to adverse health outcomes are not yet fully understood, the available
                    udent to moderate their consumption and explore healthier options.{" "}
                    <span className="text-[#6366f1]">(Luis, Ehsaan</span>
                  </p>
                </div>
                {/* Right - Scrollbar indicator */}
                <div className="w-4 bg-secondary/30 flex flex-col items-center py-2">
                  <div className="w-2 h-20 bg-muted-foreground/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      {/* What Does Conch Do Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Write, Study, and Stay Undetectable
            </h2>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Stealth Mode - Large */}
            <button
              onClick={() => onFeatureSelect("stealth")}
              className="group text-left rounded-3xl border border-border bg-card p-7 transition-all hover:border-[#6366f1]/40 hover:shadow-lg hover:shadow-[#6366f1]/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mb-5">
                <Shield className="w-6 h-6 text-[#6366f1]" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">Stealth</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                Use our AI detector/humanizer to check for and bypass detection by GPTZero, Turn It In, and more.
              </p>
              {/* AI Detection Score Visual */}
              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">AI Detection Score</span>
                  <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-md">Before</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/30 overflow-hidden mb-5">
                  <div className="h-full w-[92%] rounded-full bg-red-500"></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">AI Detection Score</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md">After</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/30 overflow-hidden">
                  <div className="h-full w-[3%] rounded-full bg-emerald-500"></div>
                </div>
              </div>
            </button>

            {/* Study - Large */}
            <button
              onClick={() => onFeatureSelect("mindmaps")}
              className="group text-left rounded-3xl border border-border bg-card p-7 transition-all hover:border-[#6366f1]/40 hover:shadow-lg hover:shadow-[#6366f1]/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mb-5">
                <Lightbulb className="w-6 h-6 text-[#6366f1]" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">Study</h3>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                Turn lectures, PDFs, and notes into flashcards, summaries, and mind maps.
              </p>
              {/* Study Tools Preview */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-[15px]">
                  <Layers className="w-5 h-5 text-[#6366f1]" />
                  <span className="text-foreground">Flashcards</span>
                </div>
                <div className="flex items-center gap-3 text-[15px]">
                  <FileText className="w-5 h-5 text-[#6366f1]" />
                  <span className="text-foreground">Notes</span>
                </div>
                <div className="flex items-center gap-3 text-[15px]">
                  <Lightbulb className="w-5 h-5 text-[#6366f1]" />
                  <span className="text-foreground">Mind Maps</span>
                </div>
              </div>
            </button>
          </div>

          {/* Secondary Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Simplify */}
            <button
              onClick={() => onFeatureSelect("simplify")}
              className="group text-left rounded-3xl border border-border bg-card p-6 transition-all hover:border-[#6366f1]/40 hover:shadow-lg hover:shadow-[#6366f1]/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mb-5">
                <Wand2 className="w-6 h-6 text-[#6366f1]" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2.5">Simplify</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Transform complex, jargon-heavy text into clear, easy-to-understand language.
              </p>
            </button>

            {/* Flashcards */}
            <button
              onClick={() => onFeatureSelect("flashcards")}
              className="group text-left rounded-3xl border border-border bg-card p-6 transition-all hover:border-[#6366f1]/40 hover:shadow-lg hover:shadow-[#6366f1]/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6 text-[#6366f1]" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2.5">Flashcards</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Generate study-ready flashcards from any content automatically.
              </p>
            </button>

            {/* Notes */}
            <button
              onClick={() => onFeatureSelect("notes")}
              className="group text-left rounded-3xl border border-border bg-card p-6 transition-all hover:border-[#6366f1]/40 hover:shadow-lg hover:shadow-[#6366f1]/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6 text-[#6366f1]" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2.5">Notes</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                Transform raw content into structured, study-ready notes.
              </p>
            </button>
          </div>
        </div>
      </section>

       {/* Stats Section */}
       <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-secondary/30 border border-border rounded-3xl py-10 px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-border">
              <div className="text-center">
                <p className="text-3xl md:text-4xl text-foreground mb-1">150k+</p>
                <p className="text-sm text-muted-foreground">Monthly Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl text-foreground mb-1">2m+</p>
                <p className="text-sm text-muted-foreground">Happy Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl text-foreground mb-1 flex items-center justify-center gap-1">
                  4.7 <Star className="w-6 h-6 text-muted-foreground fill-muted-foreground" />
                </p>
                <p className="text-sm text-muted-foreground">App Store rating</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl text-foreground mb-1">10+</p>
                <p className="text-sm text-muted-foreground">Languages available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-secondary/30 text-muted-foreground border-0 mb-6 px-4 py-1.5 rounded-full font-normal text-sm">
              <span className="w-2 h-2 rounded-full bg-[#6366f1] mr-2 inline-block"></span>
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-medium text-foreground">
              Got Questions?
            </h2>
          </div>

          <div className="space-y-1">
            {/* FAQ Item 1 */}
            <div
              className={`px-6 py-5 cursor-pointer rounded-2xl transition-all ${
                openFaq === 0 ? "bg-secondary/30" : "hover:bg-secondary/20"
              }`}
              onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
            >
              <div className="flex items-center justify-between">
                <p className="text-[17px] text-foreground">Is there a free plan?</p>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-4 ${openFaq === 0 ? "rotate-180" : ""}`} />
              </div>
              {openFaq === 0 && (
                <p className="text-muted-foreground leading-relaxed mt-4 text-[15px]">
                  Yes! All users who sign up get access to 10 free credits daily, which can be used across all our
                  tools: Write (research paper assistant), Study (mind maps, notes, and flash cards from
                  anything), Stealth (humanize AI-written text), and Chat.
                </p>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div
              className={`px-6 py-5 cursor-pointer rounded-2xl transition-all ${
                openFaq === 1 ? "bg-secondary/30" : "hover:bg-secondary/20"
              }`}
              onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
            >
              <div className="flex items-center justify-between">
                <p className="text-[17px] text-foreground">Is the content from Conch original?</p>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-4 ${openFaq === 1 ? "rotate-180" : ""}`} />
              </div>
              {openFaq === 1 && (
                <p className="text-muted-foreground leading-relaxed mt-4 text-[15px]">
                  The content that Conch generates is original content that doesn&apos;t repeat itself and passes
                  plagiarism tests with 99.99% original content that is free and clear for publication.
                </p>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div
              className={`px-6 py-5 cursor-pointer rounded-2xl transition-all ${
                openFaq === 2 ? "bg-secondary/30" : "hover:bg-secondary/20"
              }`}
              onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
            >
              <div className="flex items-center justify-between">
                <p className="text-[17px] text-foreground">What are credits?</p>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-4 ${openFaq === 2 ? "rotate-180" : ""}`} />
              </div>
              {openFaq === 2 && (
                <p className="text-muted-foreground leading-relaxed mt-4 text-[15px]">
                  Credits are the in-app currency for Conch that allows you to write, research, generate study
                  material, and humanize AI-written text. Each actions costs 1 to 4 credits.
                </p>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div
              className={`px-6 py-5 cursor-pointer rounded-2xl transition-all ${
                openFaq === 3 ? "bg-secondary/30" : "hover:bg-secondary/20"
              }`}
              onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
            >
              <div className="flex items-center justify-between">
                <p className="text-[17px] text-foreground">What languages does Conch support?</p>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-4 ${openFaq === 3 ? "rotate-180" : ""}`} />
              </div>
              {openFaq === 3 && (
                <p className="text-muted-foreground leading-relaxed mt-4 text-[15px]">
                  Conch currently supports multiple languages including English, Spanish, French, German, Italian,
                  Portuguese, Dutch, Russian, Chinese, Japanese, and Korean.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-2">
            Save 10+ Hours a Week
          </h2>
          <h3 className="text-4xl md:text-5xl font-medium text-[#6366f1] mb-10">
            & Pass Any AI Detection Test
          </h3>
          <Button variant="default" className="" onClick={() => onFeatureSelect("stealth")}>
            Try Now - No Credit Card Required
            <ArrowRight className="ml-2 w-5 h-5 -rotate-45" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pt-20 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
            {/* Left - Logo & Social */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/images/logos/logo.png"
                  width={28}
                  height={28}
                  alt="Conch"
                />
                <span className="text-xl text-[#6366f1]">Conch</span>
              </div>
              <p className="text-muted-foreground mb-6">Work smarter, not harder</p>

              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right - Links */}
            <div className="flex gap-24">
              {/* About */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">About</p>
                <div className="flex flex-col gap-4">
                  <a href="#" className="text-foreground hover:text-[#6366f1] transition-colors">Blog</a>
                  <a href="#" className="text-foreground hover:text-[#6366f1] transition-colors">Terms of Service</a>
                  <a href="#" className="text-foreground hover:text-[#6366f1] transition-colors">Privacy Policy</a>
                </div>
              </div>
              {/* Support */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-5">Support</p>
                <div className="flex flex-col gap-4">
                  <a href="#" className="text-foreground hover:text-[#6366f1] transition-colors">Contact Us</a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div>
            <p className="text-sm text-muted-foreground">Yofi Tech, LLC • Copyright © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeFeature;
