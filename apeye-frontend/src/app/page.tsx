'use client';

import { ArrowRight, Zap, Code2, Shield, Sparkles, Clock, Layers, Github, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useEffect, useState } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { Globe } from '@/components/ui/globe';
import { AnimatedListDemo } from '@/components/ui/feature-list';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">APEye</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </a>
            <a href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {isPending ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded-md" />
            ) : session ? (
              /* Logged in - Show user menu and Go to App button */
              <>
                <Link href="/app">
                  <Button size="sm" className="gap-2">
                    Open App
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{session.user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/app" className="cursor-pointer">
                        <Zap className="h-4 w-4 mr-2" />
                        Go to App
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              /* Not logged in - Show login/register buttons */
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Split Layout */}
      <section className="border-b">
        <div className="container mx-auto grid lg:grid-cols-[3fr_2fr] min-h-[600px]">
          {/* Left - Content */}
          <div className="flex flex-col justify-center py-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted text-xs font-medium mb-8 w-fit">
              <Sparkles className="h-3.5 w-3.5 text-warning" />
              <span className="text-muted-foreground">Fast. Modern. Powerful.</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-6xl font-dm-sans tracking-tighter leading-[1.1] text-foreground mb-6">
              The world is your endpoint<br />
              <span className="text-muted-foreground">Test globally, debug locally.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg mb-8">
              A modern, beautiful API client built for developers who value speed 
              and simplicity. Test, debug, and document your APIs with ease.
            </p>
            
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/app">
                  <Button size="lg" className="gap-2 h-12 px-6">
                    Open App
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="gap-2 h-12 px-6">
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="h-12 px-6">
                      View Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center font-dm-sans gap-8 mt-12 pt-8 border-t">
              <div>
                <div className="text-2xl font-bold text-foreground">10ms</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Free & Open</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">Unlimited</div>
                <div className="text-sm text-muted-foreground">Requests</div>
              </div>
            </div>
          </div>
          
          {/* Right - Terminal Preview */}
          <div className="relative border">
            <Globe/>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 right-8 lg:right-12 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg">
              Try it now - Free forever
            </div>
          </div>
        </div>
        {/* </div> */}
      </section>

      {/* Features Headline */}
      <section className="py-20 border-b">
        <div className="container mx-auto px-3">
          <h2 className="text-4xl md:text-6xl font-dm-sans tracking-tighter text-foreground mb-4">
            Everything you need to test APIs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Built with modern technologies for the best developer experience
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-b">
        <div className="container mx-auto grid lg:grid-cols-2">
          <div>
          <AnimatedListDemo/>
          </div>
          <div className='relative border-l my-4'>
          <p className="p-8 font-dm-sans text-xl text-muted-foreground leading-relaxed tracking-tight">
            Built with developers in mind, the platform offers a <span className='text-accent-foreground'> clean, intuitive interface</span> that makes API testing effortless and fast. 
            You can organize your requests into collections, making it <span className='text-accent-foreground'>easy to save, reuse, and share</span> complete workflows across projects 
            and teams. <span className='text-accent-foreground'>Security is built in</span> by default - your requests, data, and credentials are handled safely, with no sensitive keys 
            ever stored on our servers. And when it comes to speed, every request is <span className='text-accent-foreground'> optimized for performance</span>, delivering responses in 
            milliseconds so you can <span className='text-accent-foreground'>test, debug, and iterate </span>without breaking your flow.
          </p>

          </div>

        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                See it in action
              </h2>
              <p className="text-lg text-muted-foreground">
                A clean, intuitive interface that gets out of your way
              </p>
            </div>

            {/* App Screenshot/Preview */}
            <div className="relative rounded-xl border bg-card shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-info/5 pointer-events-none" />
              
              {/* Simulated App UI */}
              <div className="p-6">
                {/* Top Bar */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-muted/50 flex-1">
                    <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded">GET</span>
                    <span className="text-sm text-muted-foreground font-mono flex-1">https://api.example.com/users</span>
                  </div>
                  <Button size="sm">Send</Button>
                </div>

                {/* Content Area */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 p-4 rounded-lg bg-muted/30 border">
                    <div className="text-xs font-medium text-muted-foreground mb-3">Collections</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded bg-accent text-sm">
                        <Layers className="h-4 w-4 text-info" />
                        <span>User API</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded text-sm text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        <span>Auth API</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 p-4 rounded-lg bg-[var(--code-bg)] border font-mono text-xs">
                    <div className="text-muted-foreground mb-2">Response</div>
                    <pre className="text-foreground">
{`{
  "data": [...],
  "pagination": {
    "page": 1,
    "total": 100
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to supercharge your API testing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join developers who test APIs faster and smarter with APEye.
            </p>
            <div className="flex items-center justify-center gap-4">
              {session ? (
                <Link href="/app">
                  <Button size="lg" className="gap-2 h-12 px-8">
                    Open App
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button size="lg" className="gap-2 h-12 px-8">
                    Get Started for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="https://github.com" target="_blank">
                <Button size="lg" variant="outline" className="h-12 px-8 gap-2">
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">APEye</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Docs</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              2026 APEye. Built for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
