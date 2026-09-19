import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
const heroTree = {
    id: 'q1',
    label: 'Do you currently use React in production?',
    children: [
        {
            optionLabel: 'Yes, absolutely',
            child: {
                id: 'q2a',
                label: 'What do you like most about React?',
                children: [
                    { optionLabel: 'Component architecture', child: { id: 'q3a1', label: 'Why is component architecture useful?' } },
                    { optionLabel: 'NPM ecosystem & hooks', child: { id: 'q3a2', label: 'What makes development faster?' } },
                    { optionLabel: 'Hot reload & fast refresh', child: { id: 'q3a3', label: 'How does hot reload help?' } },
                ],
            },
        },
        {
            optionLabel: 'Somewhat / Neutral',
            child: {
                id: 'q2b',
                label: 'What would make you like React more?',
                children: [
                    { optionLabel: 'Simpler state management', child: { id: 'q3b1', label: 'Which state solution do you prefer?' } },
                    { optionLabel: 'Fewer re-render surprises', child: { id: 'q3b2', label: 'Where do re-renders affect performance?' } },
                ],
            },
        },
        {
            optionLabel: 'No, not really',
            child: {
                id: 'q2c',
                label: "Why don't you prefer React?",
                children: [
                    { optionLabel: 'Too complex & bloated', child: { id: 'q3c1', label: 'Which part is most difficult?' } },
                    { optionLabel: 'Prefer Vue / Svelte simplicity', child: { id: 'q3c2', label: 'Which alternative framework do you use?' } },
                ],
            },
        },
        {
            optionLabel: 'Never tried it',
            child: {
                id: 'q2d',
                label: "Why haven't you tried React yet?",
                children: [
                    { optionLabel: 'Never had a chance', child: { id: 'q3d1', label: 'What tech stack do you currently use?' } },
                    { optionLabel: 'Happy with current stack', child: { id: 'q3d2', label: 'Are you open to trying React in the future?' } },
                ],
            },
        },
    ],
};
function findActiveNode(node, depth, path) {
    if (depth >= path.length)
        return null;
    if (node.id === path[depth]) {
        if (depth === path.length - 1)
            return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findActiveNode(child.child, depth + 1, path);
                if (found)
                    return found;
            }
        }
    }
    return null;
}

/* ──────────────────────────────────
   Interactive Tree Visualization
   ────────────────────────────────── */
function InteractiveTreeViz() {
    const [activePath, setActivePath] = useState(['q1']);
    const [hoveredOption, setHoveredOption] = useState(null);
    const currentNode = findActiveNode(heroTree, 0, activePath) || heroTree;
    const depth = activePath.length - 1;
    function selectOption(optionChild) {
        setActivePath((prev) => [...prev, optionChild.id]);
        setHoveredOption(null);
    }
    function goBack() {
        setActivePath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }
    function reset() {
        setActivePath(['q1']);
        setHoveredOption(null);
    }
    const depthColors = [
        'from-primary/20 to-primary/5 border-primary/30',
        'from-accent-route/20 to-accent-route/5 border-accent-route/30',
        'from-accent-branch/20 to-accent-branch/5 border-accent-branch/30',
    ];
    return (<div className="relative mx-auto mt-12 w-full max-w-2xl lg:mt-16">
      {/* Depth indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {[0, 1, 2].map((d) => (<div key={d} className={`h-1.5 rounded-full transition-all duration-500 ${d <= depth ? 'w-8 bg-accent-route' : 'w-4 bg-muted'}`}/>))}
        <span className="ml-3 text-xs text-muted-foreground font-mono">
          Depth {depth + 1}/3
        </span>
      </div>

      {/* Question card */}
      <div className={`rounded-2xl border bg-gradient-to-b p-6 transition-all duration-500 sm:p-8 ${depthColors[depth] || depthColors[0]}`} key={currentNode.id} style={{ animation: 'fade-in-up 0.4s ease-out' }}>
        {/* Breadcrumb */}
        {depth > 0 && (<button onClick={goBack} className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
            ← Back
          </button>)}

        <p className="mb-1 text-xs font-semibold tracking-wider text-accent-route uppercase font-mono">
          Question {depth + 1}
        </p>
        <h3 className="text-xl font-bold text-foreground sm:text-2xl font-serif">
          {currentNode.label}
        </h3>

        {/* Options */}
        {currentNode.children && currentNode.children.length > 0 ? (<div className="mt-6 flex flex-col gap-3">
            {currentNode.children.map((opt) => (<button key={opt.child.id} onClick={() => selectOption(opt.child)} onMouseEnter={() => setHoveredOption(opt.child.id)} onMouseLeave={() => setHoveredOption(null)} className={`group flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-all duration-300 ${hoveredOption === opt.child.id
                    ? 'border-accent-route/50 bg-accent-route/10 shadow-lg shadow-accent-route/10'
                    : 'border-border bg-card/50 hover:border-accent-route/30 hover:bg-accent-route/5'}`}>
                <span className="text-sm font-medium text-foreground">
                  {opt.optionLabel}
                </span>
                <ArrowRight className={`h-4 w-4 text-muted-foreground transition-all duration-300 ${hoveredOption === opt.child.id
                    ? 'translate-x-1 text-accent-route'
                    : ''}`}/>
              </button>))}
          </div>) : (
        /* End state */
        <div className="mt-6 rounded-xl border border-accent-branch/20 bg-accent-branch/5 px-5 py-6 text-center">
            <p className="mb-1 text-sm font-semibold text-accent-branch">
              ✓ End of this decision branch
            </p>
            <p className="mb-4 text-xs text-muted-foreground">
              In a real form, respondent responses are saved securely to your session storage.
            </p>
            <Button size="sm" variant="outline" onClick={reset} className="rounded-full">
              Try another path
            </Button>
          </div>)}
      </div>

      {/* Path visualization below */}
      {depth > 0 && (<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {activePath.map((nodeId, i) => {
                const label = i === 0
                    ? 'Start'
                    : (() => {
                        let parent = heroTree;
                        for (let j = 1; j <= i; j++) {
                            const found = parent.children?.find((c) => c.child.id === activePath[j]);
                            if (found) {
                                if (j === i)
                                    return found.optionLabel;
                                parent = found.child;
                            }
                        }
                        return nodeId;
                    })();
                return (<div key={nodeId} className="flex items-center gap-2">
                {i > 0 && <div className="h-px w-4 bg-accent-route/40"/>}
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${i === activePath.length - 1
                        ? 'bg-accent-route text-white'
                        : 'bg-muted text-muted-foreground'}`}>
                  {label}
                </span>
              </div>);
            })}
        </div>)}
    </div>);
}
export function HeroSection({ onStartSurvey, onOpenEditor }) {
    const handlePrimaryAction = onOpenEditor || onStartSurvey;
    return (<section className="relative min-h-screen overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20" id="hero">
      {/* Radial gradient decoration */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2" aria-hidden="true">
        <div className="h-[600px] w-[800px] rounded-full bg-primary/10 blur-[120px]"/>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-accent-route/30 bg-accent-route/10 px-4 py-1.5 text-xs font-semibold text-accent-route shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-accent-route"/>
          <span>AI-Powered Smart Surveys & Adaptive Forms</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl font-serif" style={{ animationDelay: '0.1s' }}>
          Build <span className="text-accent-route font-serif italic">Smarter</span> Forms
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl font-sans" style={{ animationDelay: '0.2s' }}>
          AI-powered feedback forms that adapt seamlessly to every user.
          Uncover real insights with{' '}
          <span className="font-semibold text-foreground">intelligent adaptive questions</span>.
        </p>

        {/* Action Buttons */}
        <div className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.3s' }}>
          <Button size="lg" onClick={handlePrimaryAction} className="h-12 px-8 text-base font-bold shadow-lg shadow-primary/20 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            Build a Smart Form
            <ArrowRight className="ml-2 h-4 w-4"/>
          </Button>

          <Button variant="outline" size="lg" onClick={onStartSurvey} className="h-12 px-8 text-base font-semibold rounded-full border-border hover:bg-secondary">
            <Play className="mr-2 h-4 w-4 text-accent-route"/>
            Test Live Survey
          </Button>
        </div>

        {/* Interactive Tree Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="mt-14 mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase font-mono">
            Try it — click an option ↓
          </p>
          <InteractiveTreeViz />
        </div>
      </div>
    </section>);
}
