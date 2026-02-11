"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/ui/button";
import { useRouter } from "next/navigation";

interface PricingPlansProps {
  showHeader?: boolean;
  onUpgrade?: (planId: string, price: number) => void;
}

const PricingPlans = ({ showHeader = true, onUpgrade }: PricingPlansProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "quarterly" | "monthly">("yearly");
  const router = useRouter();
  const billingPlans = [
    {
      id: "monthly",
      name: "Monthly Plan",
      price: 9.99,
      period: "month",
      savePercent: 0,
      popular: false,
      description: "Pay month to month, cancel anytime",
    },
    {
      id: "quarterly",
      name: "Quarterly Plan",
      price: 7.99,
      period: "month",
      savePercent: 20,
      popular: false,
      description: "Billed every 3 months",
    },
    {
      id: "yearly",
      name: "Yearly Plan",
      price: 3.99,
      period: "month",
      savePercent: 60,
      popular: true,
      description: "Best value - billed annually",
    },
  ];

  const features = [
    "Unlimited AI words",
    "Advanced AI detection bypass",
    "Premium humanization quality",
    "Priority 24/7 support",
    "Unlimited flashcards & notes",
    "Mindmap generation",
    "Citation assistance",
    "All features unlocked",
    "No daily limits",
    "Cancel anytime",
  ];

  const handleUpgrade = () => {
   
    const plan = billingPlans.find(p => p.id === selectedPlan);

    router.push("http://localhost:3000/pricing?plan=" + plan?.id);
    if (plan && onUpgrade) {
      onUpgrade(plan.id, plan.price);
    }
  };

  return (
    <div>
      {showHeader && (
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-[36px] font-medium text-foreground leading-tight mb-4">
            Upgrade to Limitless
          </h2>
          <p className="text-[14px] md:text-[15px] text-[#6366f1] mb-6">
            Unlock your true potential with unlimited credits
          </p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Side - Features */}
          <div className="lg:w-[45%]">
            <div className="bg-card rounded-xl md:rounded-2xl border border-border p-6 md:p-8 sticky top-8">
              <h3 className="text-[18px] md:text-[20px] font-medium text-foreground mb-6">
                Everything Included
              </h3>
              <div className="space-y-3 md:space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-[#6366f1] shrink-0 mt-0.5" />
                    <span className="text-[13px] md:text-[14px] text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Plans */}
          <div className="lg:w-[55%]">
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {billingPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id as typeof selectedPlan)}
                  className={`relative cursor-pointer rounded-xl md:rounded-2xl border-2 p-4 md:p-6 transition-all ${
                    selectedPlan === plan.id
                      ? "border-[#6366f1] bg-[#6366f1]/5 shadow-lg"
                      : "border-border hover:border-[#6366f1]/50 hover:shadow-md bg-card"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-4 md:right-6 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white px-3 md:px-4 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-md">
                      Best Value
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedPlan === plan.id
                          ? "border-[#6366f1] bg-[#6366f1]"
                          : "border-border"
                      }`}>
                        {selectedPlan === plan.id && (
                          <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 md:gap-3">
                          <h3 className="text-[15px] md:text-[16px] font-medium text-foreground">
                            {plan.name}
                          </h3>
                          {plan.savePercent > 0 && (
                            <span className="bg-green-100 text-green-700 px-2 md:px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                              Save {plan.savePercent}%
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] md:text-[13px] text-muted-foreground mt-0.5">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[20px] md:text-[22px] font-medium text-foreground">
                          ${plan.price}
                        </span>
                        <span className="text-muted-foreground text-[11px] md:text-[13px]">/{plan.period}</span>
                      </div>
                      {plan.id !== "monthly" && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          <span className="line-through">$9.99</span> per month
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleUpgrade}
              className="w-full bg-[#6366f1] hover:bg-[#5558e3] text-white py-5 md:py-6 text-[14px] md:text-[15px] font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Upgrade to Limitless - ${billingPlans.find(p => p.id === selectedPlan)?.price}/{billingPlans.find(p => p.id === selectedPlan)?.period}
            </Button>

            <p className="text-center text-[11px] md:text-[13px] text-muted-foreground mt-3 md:mt-4">
              30-day money-back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
