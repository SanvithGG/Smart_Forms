import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { ArrowRight, Sparkles, ChevronDown, Sun, Moon, LogIn, Edit3 } from 'lucide-react';

/**
 * Navbar - Main header for the landing page with navigation links,
 * theme toggle, Log in button, and Get started CTA.
 */
export function Navbar({ onLogin, onStartSurvey, onOpenEditor }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-sans">
              Smart Forms
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              Products <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              Templates <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              Integrations <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              Resources <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            <button className="hover:text-foreground transition-colors cursor-pointer">
              Pricing
            </button>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full h-9 w-9 border border-border/80 text-foreground hover:bg-secondary cursor-pointer"
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-accent-route" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </Button>

          {/* Log In button leading to /login */}
          <Button
            variant="ghost"
            onClick={onLogin}
            className="rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-all cursor-pointer"
          >
            <LogIn className="h-4 w-4 mr-1.5 sm:hidden" />
            <span>Log in</span>
          </Button>

          {/* Get started button */}
          <Button
            onClick={onLogin || onStartSurvey}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 text-sm font-semibold shadow-md gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
