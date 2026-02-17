import React from 'react'
import {
    FileText,
    Layers,
    Lightbulb,
    MessageSquare,
    Mic,
    Shield,
    Wand2,
} from "lucide-react";
import { cn } from '@/lib/utils';
export type FeatureType = "home" | "stealth" | "simplify" | "mindmaps" | "flashcards" | "notes" | "blog" | "pricing" | "chat" | "podcast";

export const navigation = [
    { name: "Simplify", feature: "simplify" as FeatureType, icon: Wand2 },
    { name: "Stealth Mode", feature: "stealth" as FeatureType, icon: Shield },
    { name: "Mindmaps", feature: "mindmaps" as FeatureType, icon: Lightbulb },
    { name: "Flashcards", feature: "flashcards" as FeatureType, icon: Layers },
    { name: "Notes", feature: "notes" as FeatureType, icon: FileText },
    { name: "Chat", feature: "chat" as FeatureType, icon: MessageSquare },
    { name: "Podcast", feature: "podcast" as FeatureType, icon: Mic },
];
const FeatureNavbar = ({ activeFeature, setActiveFeature }: { activeFeature: FeatureType, setActiveFeature: (feature: FeatureType) => void }) => {


    return (
        <div className="flex-1 md:flex-none overflow-y-auto overflow-x-hidden py-2">
            <nav className="px-1.5 flex flex-col space-y-1">
                {navigation.map((item) => {
                    const isActive = activeFeature === item.feature;
                    return (
                        <button
                            key={item.name}
                            onClick={() => setActiveFeature(item.feature)}
                            className="group w-full flex flex-col items-center gap-1 px-2 py-3 text-[11px] rounded-xl transition-all relative"
                        >
                            <div className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center transition-all",
                                isActive
                                    ? "bg-white shadow-sm"
                                    : "bg-transparent group-hover:bg-white/50"
                            )}>
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 shrink-0 transition-colors",
                                        isActive
                                            ? "text-[#6366f1]"
                                            : "text-gray-500 group-hover:text-[#6366f1]"
                                    )}
                                />
                            </div>
                            <span className={cn(
                                "transition-colors text-center leading-tight text-gray-900",
                                isActive
                                    ? "font-medium"
                                    : "font-normal"
                            )}>
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    )
}

export default FeatureNavbar;