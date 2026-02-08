"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup?: () => void;
}

const SignupModal = ({ isOpen, onClose, onSignup }: SignupModalProps) => {
  if (!isOpen) return null;

  const handleGoogleSignup = () => {
    if (onSignup) {
      onSignup();
    }
    // Add your Google OAuth logic here
    console.log("Google signup clicked");
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
                className="flex items-center gap-1.5 font-bold text-base md:text-lg text-foreground cursor-pointer hover:opacity-80 transition-opacity md:pl-4 justify-center mb-6"
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
            Sign up or sign in with your Google account to get started.
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-muted border border-border rounded-xl px-5 md:px-6 py-3 md:py-3.5 flex items-center justify-center gap-3 text-foreground font-medium transition-all shadow-sm hover:shadow-md mb-6"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-[13px] md:text-[14px]">Continue with Google</span>
          </button>

          {/* Privacy Notice */}
          <p className="text-[11px] md:text-[13px] text-muted-foreground leading-relaxed max-w-md mx-auto">
            We only use your Google account to create your Conch AI profile. We respect your privacy and will never post without permission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
