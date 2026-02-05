"use client";

import { X, Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/app/ui/button";
import { Badge } from "@/app/ui/badge";
import { cn } from "@/lib/utils";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Yearly Plan",
    price: 12,
    period: "month",
    badge: "Save 60%",
    badgeColor: "bg-primary text-primary-foreground",
    popular: true,
  },
  {
    name: "Quarterly Plan",
    price: 21,
    period: "month",
    badge: "Save 30%",
    badgeColor: "bg-primary/20 text-primary",
    popular: false,
  },
  {
    name: "Monthly Plan",
    price: 30,
    period: "month",
    badge: null,
    badgeColor: "",
    popular: false,
  },
];

const features = [
  "Unlimited access to Write, Stealth, Study, Chat",
  "Unlimited AI commands",
  "Unlimited journal & web citations",
];

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upgrade to Limitless</h2>
          <p className="text-muted-foreground">
            Unlock your true potential with unlimited credits
          </p>
        </div>

        {/* Features */}
        <div className="px-8 pb-6">
          <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="px-8 pb-6 space-y-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer hover:border-primary/50",
                plan.popular 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                  : "border-border bg-secondary/30 hover:bg-secondary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                  plan.popular ? "border-primary" : "border-muted-foreground"
                )}>
                  {plan.popular && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{plan.name}</span>
                    {plan.badge && (
                      <Badge className={cn("text-xs", plan.badgeColor)}>
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground text-sm"> / {plan.period}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 space-y-3">
          <Button className="w-full bg-primary hover:bg-conch-accent-hover text-primary-foreground font-medium py-6 text-base">
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            No thanks, I&apos;ll continue with the free plan
          </button>
        </div>
      </div>
    </div>
  );
}
