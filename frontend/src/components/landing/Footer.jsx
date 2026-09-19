import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
export function Footer({ onStartSurvey }) {
    return (<footer className="border-t border-border bg-card text-foreground">
      {/* Bottom CTA Banner */}
      <div className="border-b border-border/60 py-16 text-center">
        <div className="mx-auto max-w-4xl px-6 space-y-6">
          <h2 className="text-4xl font-extrabold sm:text-5xl font-serif">
            Simplify form creation today.
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-lg">
            Create adaptive forms that respondents actually enjoy filling out.
          </p>
          <div className="pt-2">
            <Button size="lg" onClick={onStartSurvey} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-semibold shadow-md gap-2">
              Get started for free
              <ArrowRight className="h-5 w-5"/>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4"/>
          </div>
          <span className="font-bold text-foreground font-sans">Smart Forms</span>
          <span>© {new Date().getFullYear()} Smart Forms Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#security" className="hover:text-foreground transition-colors">Security</a>
        </div>
      </div>
    </footer>);
}
