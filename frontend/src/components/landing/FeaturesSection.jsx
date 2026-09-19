import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, GitBranch, BarChart3, Zap, Shield, Globe } from "lucide-react";
const features = [
    {
        icon: <Brain className="h-6 w-6"/>,
        title: "AI Question Builder",
        description: "Generate complete branching forms from a single text prompt. Our AI understands context and creates intelligent question trees.",
        gradient: "from-accent-route/20 via-accent-route/10 to-transparent",
    },
    {
        icon: <GitBranch className="h-6 w-6"/>,
        title: "Branching Logic",
        description: "Every answer leads to a different question. Build decision trees that go 3 levels deep to uncover specific, actionable insights.",
        gradient: "from-primary/20 via-blue-500/10 to-transparent",
    },
    {
        icon: <BarChart3 className="h-6 w-6"/>,
        title: "Insights Dashboard",
        description: "AI automatically summarizes responses and surfaces the most critical pain points. See patterns humans might miss.",
        gradient: "from-cyan-500/20 via-teal-500/10 to-transparent",
    },
    {
        icon: <Zap className="h-6 w-6"/>,
        title: "Lightning Fast",
        description: "Forms load instantly. No lag between questions. Respondents enjoy a smooth, native-app-like experience.",
        gradient: "from-accent-route/20 via-accent-route/10 to-transparent",
    },
    {
        icon: <Shield className="h-6 w-6"/>,
        title: "Privacy First",
        description: "All data is encrypted end-to-end. GDPR compliant by default. Your respondents' data stays secure.",
        gradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    },
    {
        icon: <Globe className="h-6 w-6"/>,
        title: "Share Anywhere",
        description: "Embed in websites, share via link, or distribute through email. Works beautifully on every device.",
        gradient: "from-accent-branch/20 via-accent-branch/10 to-transparent",
    },
];
function TiltCard({ feature }) {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState("");
    function handleMouseMove(e) {
        const card = cardRef.current;
        if (!card)
            return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    }
    function handleMouseLeave() {
        setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    }
    return (<Card ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="group relative overflow-hidden border-border/50 bg-card/50 transition-all duration-300 ease-out hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5" style={{ transform, transition: "transform 0.15s ease-out" }}>
      {/* Gradient background */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}/>

      <CardContent className="relative p-6 sm:p-8">
        <div className="mb-4 inline-flex rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
          {feature.icon}
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </CardContent>
    </Card>);
}
export function FeaturesSection() {
    return (<section id="features" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/4 blur-[100px]"/>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wider text-primary uppercase">
            Features
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need to{" "}
            <span className="text-accent-route font-heading">understand users</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Smart Forms gives you the tools to ask the right questions,
            at the right time, to the right people.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (<TiltCard key={feature.title} feature={feature}/>))}
        </div>
      </div>
    </section>);
}
