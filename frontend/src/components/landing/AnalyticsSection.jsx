import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, MessageSquare, Sparkles } from "lucide-react";
const painPoints = [
    { label: "Hooks are confusing for beginners", value: 65, change: "+12%", color: "bg-primary" },
    { label: "Project setup takes too long", value: 48, change: "+8%", color: "bg-violet-500" },
    { label: "State management is overwhelming", value: 37, change: "+5%", color: "bg-cyan-500" },
    { label: "Build times could be faster", value: 24, change: "+3%", color: "bg-accent-route" },
];
const stats = [
    { icon: <Users className="h-5 w-5"/>, label: "Total Responses", value: 2847, suffix: "" },
    { icon: <MessageSquare className="h-5 w-5"/>, label: "Completion Rate", value: 82, suffix: "%" },
    { icon: <TrendingUp className="h-5 w-5"/>, label: "Avg. Depth Reached", value: 2.7, suffix: "" },
];
/* ──────────────────────────────────
   Count-up hook
   ────────────────────────────────── */
function useCountUp(target, duration = 1500) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started) {
                setStarted(true);
            }
        }, { threshold: 0.3 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);
    useEffect(() => {
        if (!started)
            return;
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;
        let current = 0;
        let step = 0;
        const interval = setInterval(() => {
            step++;
            current = Math.min(current + increment, target);
            // Ease-out
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Number((target * eased).toFixed(target % 1 === 0 ? 0 : 1)));
            if (step >= steps) {
                setCount(target);
                clearInterval(interval);
            }
        }, stepDuration);
        return () => clearInterval(interval);
    }, [started, target, duration]);
    return { count, ref };
}
/* ──────────────────────────────────
   Animated bar
   ────────────────────────────────── */
function AnimatedBar({ value, color }) {
    const [width, setWidth] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => setWidth(value), 100);
            }
        }, { threshold: 0.3 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [value]);
    return (<div ref={ref} className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`} style={{ width: `${width}%` }}/>
    </div>);
}
function StatCard({ stat }) {
    const { count, ref } = useCountUp(stat.value);
    return (<Card className="border-border/50 bg-card/60">
      <CardContent className="p-5" ref={ref}>
        <div className="mb-2 flex items-center gap-2 text-muted-foreground">
          {stat.icon}
          <span className="text-xs font-medium">{stat.label}</span>
        </div>
        <p className="text-3xl font-extrabold tracking-tight text-foreground">
          {typeof stat.value === "number" && stat.value % 1 !== 0
            ? count.toFixed(1)
            : Math.round(count)}
          {stat.suffix}
        </p>
      </CardContent>
    </Card>);
}
export function AnalyticsSection() {
    return (<section id="analytics" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/4 blur-[120px]"/>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wider text-primary uppercase">
            Analytics
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Insights that{" "}
            <span className="text-accent-route font-heading">actually matter</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            No more sifting through spreadsheets. AI surfaces the patterns
            and pain points that need your attention.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Pain points — main area */}
          <div className="rounded-2xl border border-border/50 bg-card/60 p-6 sm:p-8 lg:col-span-3">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
              <TrendingUp className="h-5 w-5 text-primary"/>
              Top Pain Points
            </h3>

            <div className="space-y-5">
              {painPoints.map((point) => (<div key={point.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {point.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {point.value}%
                      </span>
                      <span className="text-xs text-primary">{point.change}</span>
                    </div>
                  </div>
                  <AnimatedBar value={point.value} color={point.color}/>
                </div>))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Stats cards */}
            {stats.map((stat) => (<StatCard key={stat.label} stat={stat}/>))}

            {/* AI summary */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary"/>
                  <span className="text-xs font-semibold text-primary uppercase">
                    AI Summary
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  "Most users struggle with <strong>Hooks</strong> and
                  <strong> project setup</strong>. Consider adding guided
                  tutorials and starter templates to reduce initial friction."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>);
}
