import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { ArrowRight, Sparkles, ChevronDown, Sun, Moon, Edit3 } from 'lucide-react';
export function Navbar({ onStartSurvey, onOpenEditor }) {
    const { theme, setTheme } = useTheme();
    return (<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5 text-left group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5"/>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-sans">
              Smart Forms
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              Products <ChevronDown className="h-3.5 w-3.5 opacity-60"/>
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              Templates <ChevronDown className="h-3.5 w-3.5 opacity-60"/>
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              Integrations <ChevronDown className="h-3.5 w-3.5 opacity-60"/>
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              Resources <ChevronDown className="h-3.5 w-3.5 opacity-60"/>
            </button>
            <button className="hover:text-foreground transition-colors">
              Pricing
            </button>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full h-9 w-9 border border-border/80 text-foreground hover:bg-secondary" aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
            {theme === 'dark' ? (<Sun className="h-4 w-4 text-accent-route"/>) : (<Moon className="h-4 w-4 text-slate-700"/>)}
          </Button>

          {onOpenEditor && (<Button variant="outline" onClick={onOpenEditor} className="rounded-full border-border hover:bg-secondary px-4 py-2 text-sm font-semibold gap-1.5 transition-all">
              <Edit3 className="h-4 w-4 text-primary"/>
              Edit Form
            </Button>)}

          <Button onClick={onStartSurvey} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2 text-sm font-semibold shadow-md gap-1.5 transition-all hover:scale-[1.02]">
            Get started
            <ArrowRight className="h-4 w-4"/>
          </Button>
        </div>
      </div>
    </header>);
}
