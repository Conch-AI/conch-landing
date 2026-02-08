"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/ui/button";
import Image from "next/image";
import PricingPlans from "../PricingPlans";
import { CheckerFeature } from "./CheckerSidebar";

interface PricingFeatureProps {
  onFeatureSelect?: (feature: CheckerFeature) => void;
}

const PricingFeature = ({ onFeatureSelect }: PricingFeatureProps = {}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.",
    },
    {
      question: "Is there a student discount?",
      answer: "Yes! Students with a valid .edu email address receive an additional 10% off any paid plan.",
    },
    {
      question: "What happens if I exceed my word limit?",
      answer: "Don't worry! We'll notify you when you're close to your limit. You can upgrade anytime to continue using our services.",
    },
  ];

  return (
    <div className="min-h-full bg-background text-foreground overflow-y-auto">
      {/* Hero Section */}
      <section className="pt-8 md:pt-16 pb-12 md:pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <PricingPlans showHeader={true} />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-[25px] font-medium text-foreground mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[13px] md:text-[14px] text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl md:rounded-2xl overflow-hidden transition-all hover:border-[#6366f1]/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 md:p-6 text-left"
                >
                  <span className="text-[14px] md:text-[15px] font-medium text-foreground pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center bg-gradient-to-br from-[#8b5cf6]/10 via-[#6366f1]/10 to-[#6366f1]/5 border border-[#6366f1]/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-[18px] md:text-[20px] font-medium text-foreground mb-3">
              Need a custom plan?
            </h3>
            <p className="text-[13px] md:text-[14px] text-muted-foreground mb-6 max-w-2xl mx-auto">
              Looking for enterprise solutions or have specific requirements? Our team is here to help you find the perfect plan.
            </p>
            <Button className="bg-[#6366f1] hover:bg-[#5558e3] text-white px-6 md:px-8 py-5 md:py-6 text-[13px] md:text-[14px] font-medium rounded-xl shadow-lg hover:shadow-xl transition-all">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-6 pt-12 md:pt-20 pb-8 md:pb-10 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 mb-12 md:mb-20">
            {/* Left - Logo & Social */}
            <div>
              <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                <Image
                  src="https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                  width={25}
                  height={25}
                  alt="Conch"
                  className="md:w-7 md:h-7"
                />
                <span className="text-lg md:text-xl bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent font-semibold">Conch</span>
              </div>
              <p className="text-[13px] md:text-base text-muted-foreground mb-4 md:mb-6">Work smarter, not harder</p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 md:gap-4">
                <a href="https://www.tiktok.com/@getconch.ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/getconch.ai/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://x.com/getconch" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://discord.com/invite/6UGjBseV76" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0 a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.30zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right - Links */}
            <div className="flex gap-16 md:gap-24">
              {/* About */}
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-3 md:mb-5">About</p>
                <div className="flex flex-col gap-2.5 md:gap-4">
                  {onFeatureSelect ? (
                    <button 
                      onClick={() => onFeatureSelect("blog" as CheckerFeature)} 
                      className="text-[13px] md:text-base text-foreground hover:text-[#6366f1] transition-colors text-left"
                    >
                      Blog
                    </button>
                  ) : (
                    <a href="#" className="text-[13px] md:text-base text-foreground hover:text-[#6366f1] transition-colors">Blog</a>
                  )}
                  <a href="/terms" className="text-[13px] md:text-base text-foreground hover:text-[#6366f1] transition-colors">Terms of Service</a>
                  <a href="/privacy" className="text-[13px] md:text-base text-foreground hover:text-[#6366f1] transition-colors">Privacy Policy</a>
                </div>
              </div>
              {/* Support */}
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-3 md:mb-5">Support</p>
                <div className="flex flex-col gap-2.5 md:gap-4">
                  <a href="mailto:help@getconch.ai" className="text-[13px] md:text-base text-foreground hover:text-[#6366f1] transition-colors">Contact Us</a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div>
            <p className="text-[12px] md:text-sm text-muted-foreground">Yofi Tech, LLC • Copyright © 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingFeature;
