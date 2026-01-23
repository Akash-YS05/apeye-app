'use client';

import { ArrowRight, Zap, Code2, Shield, Sparkles, Clock, Layers, Github, User, LogOut, Terminal, Menu, X } from 'lucide-react';
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
import { NoiseBackground } from '@/components/ui/noise-background';
import { GoogleGeminiEffect } from '@/components/ui/google-gemini-effect';
import { GoogleGeminiEffectDemo } from '@/components/ui/req-res';
import { GlowingEffectDemoSecond } from '@/components/ui/feature-grid';
import { TextHoverEffectDemo } from '@/components/ui/footer';
import { LightRays } from '@/components/ui/light-rays';
import FloatingLines from '@/components/FloatingLines';
import { Separator } from '@/components/ui/separator';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary">
              <Image src={'/icon.svg'} width={100} height={100} alt='logo'></Image>
            </div>
            <span className="text-2xl sm:text-3xl font-dm-sans tracking-tighter font-bold text-foreground"><a href="#">APEye</a></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-md text-foreground hover:text-foreground transition-colors">
              Features
            </a>
            {/* <a href="#demo" className="text-md text-foreground hover:text-foreground transition-colors">
              Demo
            </a> */}
            <a href="https://github.com/Akash-YS05/apeye-app" className="text-md text-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a href="#contact" className="text-md text-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            {isPending ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded-md hidden sm:block" />
            ) : session ? (
              /* Logged in - Show user menu and Go to App button */
              <>
                <Link href="/app" className="hidden sm:block">
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
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-card/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-md text-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              {/* <a 
                href="#demo" 
                className="text-md text-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Demo
              </a> */}
              <a 
                href="https://github.com/Akash-YS05/apeye-app" 
                className="text-md text-foreground hover:text-foreground transition-colors flex items-center gap-1 py-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              
              {!isPending && !session && (
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">Login</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
              
              {!isPending && session && (
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Link href="/app" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full gap-2">
                      Open App
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Split Layout */}
      <section className="border-b px-4 sm:px-6 lg:px-10">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-[500px] lg:min-h-[600px]">
          {/* Left - Content */}
          <div className="flex flex-col justify-center py-10 sm:py-12 lg:py-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted text-xs font-medium mb-6 sm:mb-8 w-fit">
              <Sparkles className="h-3.5 w-3.5 text-warning" />
              <span className="text-muted-foreground">Fast. Modern. Powerful.</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-dm-sans tracking-tighter leading-[1.1] text-foreground mb-4 sm:mb-6">
              The world is your endpoint<br />
              <span className="text-muted-foreground">Test globally, debug locally.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-6 sm:mb-8">
              A modern, beautiful API client built for developers who value speed 
              and simplicity. Test, debug, and document your APIs with ease.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {session ? (
                <NoiseBackground
                  containerClassName="w-full sm:w-fit p-2 rounded-md"
                  gradientColors={[
                    "rgb(255, 100, 150)",
                    "rgb(100, 150, 255)",
                    "rgb(255, 200, 100)",
                  ]}
                >
                  <Link href="/app">
                    <button className="flex items-center justify-center gap-2 h-12 px-6 w-full sm:w-auto rounded-sm bg-linear-to-r from-neutral-100 via-neutral-100 to-white text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]">
                      Open App
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </NoiseBackground>
              ) : (
                <>
                  {/* Get Started */}
                  <NoiseBackground
                    containerClassName="w-full sm:w-fit p-2 rounded-md"
                    gradientColors={[
                      "rgb(255, 100, 150)",
                      "rgb(100, 150, 255)",
                      "rgb(255, 200, 100)",
                    ]}
                  >
                    <Link href="/register">
                      <button className="flex items-center justify-center gap-2 h-12 px-6 w-full sm:w-auto rounded-sm bg-linear-to-r from-neutral-100 via-neutral-100 to-white text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] cursor-pointer">
                        Get Started for Free
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </NoiseBackground>
                </>
              )}
            </div>
          </div>
          
          {/* Right - Terminal Preview (hidden on mobile, shown on lg+) */}
          <div className="relative border hidden lg:block">
            <Globe/>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 right-8 lg:right-12 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg">
              Try it now - Free forever
            </div>
          </div>
        </div>
      </section>

      {/* Globe Section with Features Headline - visible only on mobile/tablet */}
      <section className="lg:hidden border-b">
        <div className="relative min-h-[450px] sm:min-h-[500px] overflow-hidden">
          {/* Globe positioned to the right */}
          <div className="absolute right-[-20%] sm:right-[-10%] top-1/2 -translate-y-1/2 w-[70%] sm:w-[60%] aspect-square">
            <Globe className="relative w-full h-full" />
          </div>
          
          {/* Text content wrapping around globe */}
          <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-16">
            <div className="max-w-[55%] sm:max-w-[50%]">
              <h2 className="text-3xl sm:text-4xl font-dm-sans tracking-tighter text-foreground mb-4">
                Everything you need to test APIs
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Built with modern technologies for the best developer experience
              </p>
            </div>
          </div>
          
          {/* Floating Badge */}
          <div className="absolute bottom-4 left-4 sm:left-6 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg whitespace-nowrap z-10">
            Try it now - Free forever
          </div>
        </div>
      </section>

      {/* Features Headline - visible only on desktop */}
      <section id="features" className="hidden lg:block py-12 sm:py-16 lg:py-20 border-b px-4 sm:px-6 lg:px-10">
        <div className="container mx-auto px-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-dm-sans tracking-tighter text-foreground mb-4">
            Everything you need to test APIs
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Built with modern technologies for the best developer experience
          </p>
        </div>
      </section>

      <div className='mx-auto p-4 sm:p-6 lg:p-10'>
      <GlowingEffectDemoSecond/>
      </div>

      {/* Features Grid */}
      <section className="border-b">
        <div className="container mx-auto">

          <div className='relative border-t my-4'>
          <p className="p-4 sm:p-6 lg:p-8 font-dm-sans text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed tracking-tight">
            Built with developers in mind, the platform offers a <span className='text-accent-foreground'> clean, intuitive interface</span> that makes API testing effortless and fast. 
            You can organize your requests into collections, making it <span className='text-accent-foreground'>easy to save, reuse, and share</span> complete workflows across projects 
            and teams. <span className='text-accent-foreground'>Security is built in</span> by default - your requests, data, and credentials are handled safely, with no sensitive keys 
            ever stored on our servers. And when it comes to speed, every request is <span className='text-accent-foreground'> optimized for performance</span>, delivering responses in 
            milliseconds so you can <span className='text-accent-foreground'>test, debug, and iterate </span>without breaking your flow.
          </p>

          </div>

        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 border-b px-4 sm:px-6 lg:px-10">
        <div className="container mx-auto px-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-dm-sans tracking-tighter text-foreground mb-4">
            Accurate responses, just one click away.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            See what your APIs will return instantly, improving efficiency.
          </p>
        </div>
      </section>

      <section id="features" className="">
        <div className="container mx-auto flex flex-col gap-8 sm:gap-12 lg:gap-16 py-8 sm:py-12 lg:py-16">
          
          {/* Gemini effect first */}
          <div className="w-full flex justify-center">
            <GoogleGeminiEffectDemo />
          </div>

          {/* Text second */}
          <div className="relative border-t pt-8 sm:pt-10 lg:pt-12">
        <p className="px-4 sm:px-6 lg:px-8 font-dm-sans text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed tracking-tight max-w-4xl mx-auto">
          Every API interaction should feel effortless. Write a request, hit send, and see the response
          appear instantly -  no configuration walls, no waiting, no distractions. The entire workflow is
          designed around speed and clarity, so you always know what you're sending and what you're
          getting back. {" "}
          <span className="text-accent-foreground">
            One click is all it takes to go from request to response
          </span>
          , letting you stay focused on building instead of fighting tools. Whether you're testing,
          debugging, or exploring new endpoints, the platform keeps you moving fast, with everything you
          need right where you expect it.
        </p>
      </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="">
        <div className="relative h-auto min-h-[400px] sm:min-h-[450px] lg:h-100 mx-4 sm:mx-8 lg:mx-20 my-8 sm:my-12 lg:my-20 overflow-hidden rounded-xl">
          <FloatingLines/>
          <div className="relative z-10 px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-dm-sans tracking-tighter text-center mt-8 sm:mt-10 text-foreground mb-4">
                Test any API. Anywhere. Instantly.
              </h2>
              <h3 className="text-lg sm:text-xl lg:text-2xl text-foreground mx-4 sm:mx-8 text-center font-dm-sans tracking-tight">
                  From localhost to production, one platform for everything.
              </h3>
              <div className='border mx-4 sm:mx-16 lg:mx-30 mt-4'></div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 z-10 px-4">
                {session ? (
                  <NoiseBackground
                  containerClassName="w-full sm:w-fit p-2 rounded-md"
                  gradientColors={[
                    "rgb(255, 100, 150)",
                    "rgb(100, 150, 255)",
                    "rgb(255, 200, 100)",
                  ]}
                >
                  <Link href="/app">
                    <button className="flex items-center justify-center gap-2 h-12 px-6 w-full sm:w-auto rounded-sm bg-linear-to-r from-neutral-100 via-neutral-100 to-white text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-slate-700 dark:via-slate-800 dark:to-neutral-800 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]">
                      Open App
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </NoiseBackground>
                ) : (
                  <NoiseBackground
                  containerClassName="w-full sm:w-fit p-2 rounded-md"
                  gradientColors={[
                    "rgb(255, 100, 150)",
                    "rgb(100, 150, 255)",
                    "rgb(255, 200, 100)",
                  ]}
                >
                  <Link href="/register">
                    <button className="flex items-center justify-center gap-2 h-12 px-6 w-full sm:w-auto rounded-sm bg-linear-to-r from-neutral-100 via-neutral-100 to-white text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-slate-700 dark:via-slate-800 dark:to-neutral-800 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] cursor-pointer">
                      Get Started for Free
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </NoiseBackground>
                )}
                <Link href="https://github.com/Akash-YS05/apeye-app" target="_blank" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="h-12 px-8 w-full sm:w-auto cursor-pointer gap-2 shadow-[inset_0_0_4px_rgba(0,0,0,0.1)]">
                    <Github className="h-4 w-4" />
                    Star on GitHub
                  </Button>
                </Link>
              </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <section id='contact'>
        <footer className="">
          <div className="p-0 m-0 leading-none grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden sm:block">
              <TextHoverEffectDemo/>
            </div>
            <div className='lg:border-l p-6 sm:p-8 lg:p-12'>
              {/* Contact Section */}
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Contact
                </h3>
                
                {/* Social Links with Names */}
                <div className="flex flex-col gap-4">
                  <Link 
                    href="https://github.com/Akash-YS05" 
                    target="_blank" 
                    className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors group"
                  >
                    <Github className="h-5 w-5" />
                    <span className="group-hover:underline">GitHub</span>
                  </Link>
                  
                  <Link 
                    href="https://linkedin.com/in/li-akash-pandey" 
                    target="_blank" 
                    className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors group"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span className="group-hover:underline">LinkedIn</span>
                  </Link>
                  
                  <Link 
                    href="https://x.com/akashpandeytwt" 
                    target="_blank" 
                    className="flex items-center gap-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors group"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="group-hover:underline">X (Twitter)</span>
                  </Link>
                </div>
              </div>
              
              {/* Copyright */}
              <div className="mt-8 sm:mt-12 text-sm text-neutral-600 dark:text-neutral-400">
                <p>© {new Date().getFullYear()} APEye. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
