"use client";

import { API_BASE_URL } from "@/config";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup?: () => void;
  content: string;
}

const SignupModal = ({ isOpen, onClose, onSignup, content }: SignupModalProps) => {
  const router = useRouter();
  
  if (!isOpen) return null;

  const handleLogin = () => {
    if (onSignup) {
      onSignup();
    }
    router.push(API_BASE_URL + "/sign-up");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90vw] max-w-md bg-background rounded-3xl border border-border shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full hover:bg-muted p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="px-6 md:px-8 py-10 md:py-12 text-center">
          {/* Conch Logo */}
          <div 
                className="w-full flex items-center justify-center gap-1.5 font-bold text-base md:text-lg text-foreground cursor-pointer hover:opacity-80 transition-opacity mb-6 pr-2"
              >
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center">
                  <Image
                    alt="Logo"
                    src={
                      "https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"
                    }
                    width={24}
                    height={24}
                    className="md:w-7 md:h-7"
                  />
                </div>
                <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">Conch</span>
              </div>

          {/* Heading */}
          <h2 className="text-xl md:text-[25px] font-medium text-foreground mb-3">
            Join Conch AI
          </h2>

          {/* Subtitle */}
          <p className="text-[13px] md:text-[14px] text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            {content}
          </p>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl px-5 md:px-6 py-3 md:py-3.5 flex items-center justify-center gap-3 font-medium transition-all shadow-sm hover:shadow-md mb-6"
          >
            <span className="text-[13px] md:text-[14px]">Login Now</span>
          </button>

          {/* Privacy Notice */}
          <p className="text-[11px] md:text-[13px] text-muted-foreground leading-relaxed max-w-md mx-auto">
            We respect your privacy and will never post without permission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
