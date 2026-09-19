import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
const demoNodes = {
    start: {
        id: "start",
        question: "How would you describe your experience with our product?",
        options: [
            { label: "Loving it so far", nextId: "positive" },
            { label: "It's okay, could be better", nextId: "neutral" },
            { label: "Pretty frustrated", nextId: "negative" },
        ],
    },
    positive: {
        id: "positive",
        question: "That's great to hear! What stands out the most?",
        options: [
            { label: "The intuitive interface", nextId: "end_interface" },
            { label: "Speed and performance", nextId: "end_speed" },
            { label: "The branching logic feature", nextId: "end_branching" },
        ],
    },
    neutral: {
        id: "neutral",
        question: "What would make the biggest improvement for you?",
        options: [
            { label: "Better onboarding", nextId: "end_onboarding" },
            { label: "More templates", nextId: "end_templates" },
            { label: "Team collaboration tools", nextId: "end_collab" },
        ],
    },
    negative: {
        id: "negative",
        question: "Sorry to hear that. What's causing the most friction?",
        options: [
            { label: "Confusing navigation", nextId: "end_nav" },
            { label: "Missing features I need", nextId: "end_features" },
            { label: "Too slow / buggy", nextId: "end_bugs" },
        ],
    },
    // End states
    end_interface: { id: "end_interface", question: "Thanks! We'll keep polishing the UI.", options: [] },
    end_speed: { id: "end_speed", question: "Thanks! Performance is a top priority.", options: [] },
    end_branching: { id: "end_branching", question: "Thanks! Branching logic is our pride.", options: [] },
    end_onboarding: { id: "end_onboarding", question: "Thanks! We're improving the onboarding flow.", options: [] },
    end_templates: { id: "end_templates", question: "Thanks! More templates are coming soon.", options: [] },
    end_collab: { id: "end_collab", question: "Thanks! Team features are on our roadmap.", options: [] },
    end_nav: { id: "end_nav", question: "Thanks! We're simplifying the navigation.", options: [] },
    end_features: { id: "end_features", question: "Thanks! Tell us what features you need.", options: [] },
    end_bugs: { id: "end_bugs", question: "Thanks! We're squashing bugs daily.", options: [] },
};
export function LiveDemo() {
    const [currentId, setCurrentId] = useState("start");
    const [history, setHistory] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const node = demoNodes[currentId];
    const isEnd = node.options.length === 0;
    const progress = isEnd ? 100 : Math.round((history.length / 3) * 100);
    function selectOption(label, nextId) {
        setSelectedOption(label);
        setTimeout(() => {
            setHistory((h) => [...h, { nodeId: currentId, chosenLabel: label }]);
            setCurrentId(nextId);
            setSelectedOption(null);
        }, 300);
    }
    function reset() {
        setCurrentId("start");
        setHistory([]);
        setSelectedOption(null);
    }
    return (<section id="demo" className="relative py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wider text-primary uppercase">
            Interactive Demo
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Experience it <span className="text-accent-route font-heading">yourself</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            This is exactly how your users will interact with a Smart Form.
            Click through and watch the branching unfold.
          </p>
        </div>

        {/* Demo card */}
        <div className="mx-auto max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 shadow-2xl shadow-black/20">
            {/* Demo header bar */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  S
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Product Feedback
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {isEnd ? "Complete" : `Q${history.length + 1} of 3`}
                </Badge>
                {history.length > 0 && (<button onClick={reset} className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Restart demo">
                    <RotateCcw className="h-3.5 w-3.5"/>
                  </button>)}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full bg-muted">
              <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}/>
            </div>

            {/* Question area */}
            <div className="p-6 sm:p-8" key={node.id} style={{ animation: "fade-in-up 0.35s ease-out" }}>
              {isEnd ? (<div className="py-6 text-center">
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary"/>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">
                    {node.question}
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Your feedback path:
                  </p>
                  {/* Show path taken */}
                  <div className="mb-6 flex flex-col gap-2">
                    {history.map((h, i) => (<div key={i} className="inline-flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                          Q{i + 1}
                        </span>
                        <ArrowRight className="h-3 w-3"/>
                        <span className="font-medium text-foreground">
                          {h.chosenLabel}
                        </span>
                      </div>))}
                  </div>
                  <Button size="sm" onClick={reset}>
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5"/>
                    Try another path
                  </Button>
                </div>) : (<>
                  <h3 className="mb-6 text-lg font-bold text-foreground sm:text-xl">
                    {node.question}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {node.options.map((opt) => (<button key={opt.nextId} onClick={() => selectOption(opt.label, opt.nextId)} disabled={selectedOption !== null} className={`group flex items-center justify-between rounded-xl border px-5 py-4 text-left transition-all duration-300 ${selectedOption === opt.label
                    ? "border-accent-route bg-accent-route/10 shadow-md shadow-accent-route/10"
                    : selectedOption !== null
                        ? "cursor-not-allowed opacity-40"
                        : "border-border bg-background hover:border-accent-route/40 hover:bg-accent-route/5"}`}>
                        <span className="text-sm font-medium text-foreground">
                          {opt.label}
                        </span>
                        <ArrowRight className={`h-4 w-4 transition-all duration-300 ${selectedOption === opt.label
                    ? "translate-x-1 text-accent-route"
                    : "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-accent-route"}`}/>
                      </button>))}
                  </div>
                </>)}
            </div>
          </div>

          {/* Caption */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Every answer determines the next question — no flat surveys, only meaningful conversations.
          </p>
        </div>
      </div>
    </section>);
}
