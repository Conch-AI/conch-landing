"use client";

import {
    BookOpen,
    Chrome,
    FileText,
    Home,
    MessageSquare,
    Shield,
    Menu,
    Zap,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PricingModal } from "@/components/pricing-modal";
import Image from "next/image";

const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Humanizer", href: "#", icon: Shield },
    { name: "Chat", href: "#", icon: MessageSquare },
    { name: "Study", href: "#", icon: BookOpen },
    { name: "Write", href: "#", icon: FileText }
];

export const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    return (
        <>
            <div className={cn(
                "flex flex-col h-screen bg-transparent text-sidebar-foreground transition-all duration-300 mt-2",
                isCollapsed ? "w-16" : "w-64"
            )}>
                <div className="p-4 flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 font-bold text-xl text-foreground">
                            <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                                <Image alt="Logo" src={"https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"} width={38} height={38} />
                            </div>
                            <span>Conch</span>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mx-auto">
                            C
                        </div>
                    )}
                    {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
                            isCollapsed && "hidden"
                        )}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button> */}
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-2 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group transition-colors"
                            >
                                <item.icon className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-8 px-2">
                        <Link
                            href="#"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-conch-accent-light text-primary hover:bg-primary/20 group transition-colors"
                        >
                            <Chrome className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span>Get Chrome Extension</span>}
                        </Link>
                    </div>
                </div>

                {!isCollapsed && (
                    <div className="p-4">
                        <div className="bg-gradient-to-br from-primary/10 via-card to-card rounded-xl p-4 border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <p className="text-xs font-medium text-foreground">Free Plan</p>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                                <div className="h-full w-1/3 bg-primary rounded-full"></div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">167/500 words used today</p>
                            <Button
                                onClick={() => setIsPricingOpen(true)}
                                className="w-full bg-primary hover:bg-conch-accent-hover text-primary-foreground text-xs font-medium h-9"
                            >
                                <Zap className="w-3 h-3 mr-1" />
                                Upgrade to Limitless
                            </Button>
                        </div>
                    </div>
                )}

                {isCollapsed && (
                    <div className="p-2 pb-4">
                        <Button
                            onClick={() => setIsPricingOpen(true)}
                            size="icon"
                            className="w-full bg-primary hover:bg-conch-accent-hover text-primary-foreground"
                        >
                            <Zap className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            <PricingModal
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
            />
        </>
    );
};
