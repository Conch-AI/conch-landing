"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Check,
  FileText,
  MessageSquare,
  BookOpen,
  Sparkles,
  Shield,
  Chrome,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [inputText, setInputText] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/50 backdrop-blur-xl rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            <Button className="bg-primary hover:bg-conch-accent-hover text-primary-foreground font-medium">
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="bg-conch-accent-light text-primary border-primary/20 mb-6">
            AI DETECTOR, CHECKER & HUMANIZER
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            Undetectable AI
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Write and humanize AI papers, reports, and blogs. Bypass AI detection. All with one click.
          </p>

          {/* Interactive Demo Area */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-card rounded-2xl border border-border p-1">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                <span className="ml-3 text-xs text-muted-foreground">Try the humanizer</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your AI-generated text here to humanize it..."
                className="w-full bg-transparent p-6 text-foreground placeholder-muted-foreground resize-none h-32 focus:outline-none text-sm"
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">{inputText.length}/500 characters free</span>
                <Button className="bg-primary hover:bg-conch-accent-hover text-primary-foreground font-medium">
                  Humanize Text
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-primary fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Loved by 2M+ academics</span>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-border"></div>

            <Button variant="outline" className="border-border bg-secondary/50 hover:bg-secondary text-foreground">
              <Chrome className="mr-2 w-4 h-4" />
              Add to Chrome — Free
            </Button>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 px-6 border-y border-border bg-secondary/20">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Working with industry leaders</h3>
          <p className="text-muted-foreground mb-10">
            We&apos;re a proud partner of these globally recognized brands:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70">
            {/* Google Cloud */}
            <div className="flex items-center gap-2 text-foreground">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02-.055.013 0 0-3.875 2.551-3.922 8.11-.247 10.941l.006-.007-.007.03a6.717 6.717 0 0 0 4.077 1.356h5.173l.03.03h5.192c6.687.053 9.376-8.605 3.835-12.35a9.365 9.365 0 0 0-8.825-6.893zm6.746 8.747a5.457 5.457 0 0 1-1.091 6.386l.004-.005H6.896a2.813 2.813 0 0 1-.005-5.627h.005l.027-.03h1.464a6.1 6.1 0 0 1 .67-1.939l.03-.03-1.027-1.027a2.811 2.811 0 0 1 3.979-3.979l.03.03 1.027 1.027a6.1 6.1 0 0 1 1.939-.67V4.81a2.813 2.813 0 0 1 5.626 0v.005l.03.027v1.464a6.1 6.1 0 0 1 1.939.67l1.027-1.027a2.811 2.811 0 0 1 3.979 3.979l-1.027 1.027a6.1 6.1 0 0 1 .67 1.939h1.464l.03.03a2.813 2.813 0 0 1 0 5.627h-.005l-.027.03h-1.464a6.1 6.1 0 0 1-.67 1.939l1.027 1.027a2.811 2.811 0 0 1-3.979 3.979l-1.027-1.027a6.1 6.1 0 0 1-1.939.67v1.464l-.03.03a2.813 2.813 0 0 1-5.627 0v-.005l-.03-.027V18.54a6.1 6.1 0 0 1-1.939-.67l-1.027 1.027a2.811 2.811 0 0 1-3.979-3.979l1.027-1.027a6.1 6.1 0 0 1-.67-1.939H4.81l-.03-.03a2.813 2.813 0 0 1 0-5.627h.005l.027-.03h1.464z" />
              </svg>
              <span className="font-semibold">Google Cloud</span>
            </div>
            {/* PayPal */}
            <div className="flex items-center gap-2 text-foreground">
              <span className="font-bold text-xl">PayPal</span>
            </div>
            {/* Amplitude */}
            <div className="flex items-center gap-2 text-foreground">
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background text-xs font-bold">A</span>
              </div>
              <span className="font-semibold">Amplitude</span>
            </div>
            {/* Chargebee */}
            <div className="flex items-center gap-2 text-foreground">
              <span className="font-semibold">chargebee</span>
            </div>
            {/* Customer.io */}
            <div className="flex items-center gap-2 text-foreground">
              <span className="font-semibold">customer.io</span>
            </div>
            {/* Hootsuite */}
            <div className="flex items-center gap-2 text-foreground">
              <span className="font-semibold">Hootsuite</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-transparent to-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-conch-accent-light text-primary border-primary/20 mb-4">
              FEATURES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to write smarter</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From AI detection bypass to intelligent study tools, Conch has you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Feature 1 - Humanizer */}
            <Card className="bg-card border-border hover:border-primary/30 transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-conch-accent-light flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <Badge className="w-fit bg-conch-accent-light text-primary border-primary/20 mb-2">
                  AI HUMANIZER
                </Badge>
                <CardTitle className="text-2xl">Undetectable AI Writing</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Write and humanize AI papers, reports, and blogs. Bypass AI detection with our advanced humanization engine that maintains your original meaning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-background rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">AI Detection Score</span>
                    <span className="text-xs text-primary">After Humanization</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-red-500/20 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-red-500 mt-1 block">85% AI Detected</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-[5%] bg-primary rounded-full"></div>
                      </div>
                      <span className="text-xs text-primary mt-1 block">5% AI Detected</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 - Citation Assistant */}
            <Card className="bg-card border-border hover:border-primary/30 transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-conch-accent-light flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <Badge className="w-fit bg-conch-accent-light text-primary border-primary/20 mb-2">
                  AI ESSAY ASSISTANT
                </Badge>
                <CardTitle className="text-2xl">Say Goodbye to Citation Frustration</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Struggling with writer&apos;s block? Conch&apos;s AI-powered text editor helps you write, cite, and edit with confidence. Save hours on your next paper.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-background rounded-xl p-4 border border-border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Auto-generate citations in APA, MLA, Chicago</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Detect and fix grammar issues</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Research assistant built-in</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 - Chat with Files */}
            <Card className="bg-card border-border hover:border-primary/30 transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-conch-accent-light flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <Badge className="w-fit bg-conch-accent-light text-primary border-primary/20 mb-2">
                  CONCH CHAT
                </Badge>
                <CardTitle className="text-2xl">Chat With Any File</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Join millions of students, researchers and professionals to instantly answer questions and understand research with AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-background rounded-xl p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="bg-secondary rounded-lg p-3 text-sm text-foreground">
                        &quot;What are the key findings from this research paper?&quot;
                      </div>
                      <div className="bg-conch-accent-light rounded-lg p-3 text-sm text-primary">
                        &quot;The paper identifies 3 main conclusions...&quot;
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 - Study Tools */}
            <Card className="bg-card border-border hover:border-primary/30 transition-all group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-conch-accent-light flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <Badge className="w-fit bg-conch-accent-light text-primary border-primary/20 mb-2">
                  CONCH STUDY
                </Badge>
                <CardTitle className="text-2xl">Create Notes, Mind Maps & Flashcards</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Upload any file, video, or live recording and generate the study material you need so you can focus on the actual studying.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-background rounded-xl p-4 border border-border">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-secondary rounded-lg p-3 text-center">
                      <FileText className="w-5 h-5 text-primary mx-auto mb-1" />
                      <span className="text-xs text-muted-foreground">Notes</span>
                    </div>
                    <div className="bg-secondary rounded-lg p-3 text-center">
                      <Sparkles className="w-5 h-5 text-primary mx-auto mb-1" />
                      <span className="text-xs text-muted-foreground">Mind Maps</span>
                    </div>
                    <div className="bg-secondary rounded-lg p-3 text-center">
                      <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
                      <span className="text-xs text-muted-foreground">Flashcards</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">2M+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">Documents Processed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99%</div>
              <div className="text-muted-foreground">Bypass Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-conch-accent-light text-primary border-primary/20 mb-4">
              PRICING
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Start free, upgrade when ready</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Try Conch free with generous limits. Upgrade for unlimited access.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-card border-border relative">
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Perfect for trying out Conch
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full border-border bg-secondary/50 hover:bg-secondary">
                  Get Started
                </Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    500 words/day humanization
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    5 AI chat messages/day
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Basic citation generator
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Chrome extension
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-card border-primary/30 relative ring-1 ring-primary/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground border-0">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pro</CardTitle>
                <CardDescription className="text-muted-foreground">
                  For students and professionals
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-primary hover:bg-conch-accent-hover text-primary-foreground font-medium">
                  Start Free Trial
                </Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Unlimited humanization
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Unlimited AI chat
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Advanced citation tools
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Chat with PDFs & files
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Study tools & flashcards
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Priority support
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="bg-card border-border relative">
              <CardHeader>
                <CardTitle className="text-xl">Team</CardTitle>
                <CardDescription className="text-muted-foreground">
                  For teams and organizations
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/user/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full border-border bg-secondary/50 hover:bg-secondary">
                  Contact Sales
                </Button>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Team workspace
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Admin dashboard
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    SSO & security
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    Dedicated support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/20 via-card to-card rounded-3xl border border-primary/20 p-12 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to write smarter?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join over 2 million students and professionals who use Conch to write better, faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-primary hover:bg-conch-accent-hover text-primary-foreground font-medium px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-border bg-secondary/50 hover:bg-secondary px-8 py-6 text-lg">
                <Chrome className="mr-2 w-5 h-5" />
                Add to Chrome
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center font-bold text-primary-foreground">
                  <Image alt="Logo" src={"https://framerusercontent.com/images/A9DsIoq6hkJgbGBX8cIcdcQcNk.png?scale-down-to=512"} width={38} height={38} />
                </div>
                <span className="font-semibold text-lg">Conch</span>
              </Link>
              <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                The AI writing assistant that helps you write, humanize, and research with confidence.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">AI Humanizer</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">AI Chat</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Study Tools</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Chrome Extension</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Docs</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Status</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Conch AI. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Made with care for students everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
