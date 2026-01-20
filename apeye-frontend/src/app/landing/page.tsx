'use client';

import { ArrowRight, Zap, Code2, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              APEye
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Modern API Testing Tool</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Test APIs at the{' '}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
              speed of thought
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A lightning-fast, beautiful API testing platform built for modern developers.
            Test, debug, and document your APIs with ease.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Testing Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Screenshot Mockup */}
        <div className="max-w-6xl mx-auto mt-20 animate-fade-in">
          <div className="relative rounded-xl overflow-hidden border shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 pointer-events-none" />
            <div className="bg-card p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-3">
                <div className="h-10 bg-muted rounded-md animate-pulse" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-32 bg-muted rounded-md animate-pulse" />
                  <div className="h-32 bg-muted rounded-md animate-pulse delay-75" />
                  <div className="h-32 bg-muted rounded-md animate-pulse delay-150" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything you need to test APIs
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features in a beautiful, intuitive interface
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Built for speed. Send requests and get responses in milliseconds.
              </p>
            </div>

            <div className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Developer First</h3>
              <p className="text-muted-foreground">
                Syntax highlighting, smart autocomplete, and powerful collections.
              </p>
            </div>

            <div className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and secure. We never store your API keys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-2xl border bg-gradient-to-br from-primary/10 to-purple-500/10">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to supercharge your API testing?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of developers testing APIs with APEye.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">APEye</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 APEye. Built with ❤️ for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}