import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
/* ──────────────────────────────────
   Pre-built demo prompts & generated trees
   ────────────────────────────────── */
const demoPrompts = [
    {
        prompt: "I want to know why users leave my app",
        tree: [
            {
                q: "When did you decide to stop using the app?",
                options: ["Within first week", "After a month", "After a specific incident"],
            },
            {
                q: "What was the main reason for leaving?",
                options: ["Found a better alternative", "Missing features", "Too complicated"],
            },
            {
                q: "What would bring you back?",
                options: ["Simpler interface", "Lower price", "Specific feature"],
            },
        ],
    },
    {
        prompt: "Understand what features developers want next",
        tree: [
            {
                q: "What's your biggest productivity blocker?",
                options: ["Slow build times", "Debugging issues", "Documentation gaps"],
            },
            {
                q: "Which area needs the most improvement?",
                options: ["API design", "Developer tools", "Error messages"],
            },
            {
                q: "How would you prioritize new features?",
                options: ["Performance first", "New integrations", "Better DX"],
            },
        ],
    },
    {
        prompt: "Find out why customers don't complete checkout",
        tree: [
            {
                q: "At which step did you consider leaving?",
                options: ["Cart page", "Payment details", "Shipping options"],
            },
            {
                q: "What concerned you the most?",
                options: ["Total price", "Delivery time", "Trust / security"],
            },
            {
                q: "What would have helped you complete the purchase?",
                options: ["Discount code", "Free shipping", "Guest checkout"],
            },
        ],
    },
];
const placeholderSuggestions = [
    "Why do users leave my app?",
    "What features should we build next?",
    "Why don't customers complete checkout?",
];
export function AISection() {
    const [inputValue, setInputValue] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedTree, setGeneratedTree] = useState(null);
    const [revealedCount, setRevealedCount] = useState(0);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const timeoutRef = useRef(undefined);
    // Rotate placeholder text
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((i) => (i + 1) % placeholderSuggestions.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    function handleGenerate() {
        if (isGenerating)
            return;
        // Find a matching demo or use the first one
        const query = inputValue.toLowerCase();
        const match = demoPrompts.find((d) => d.prompt.toLowerCase().includes(query.split(" ").slice(0, 3).join(" "))) || demoPrompts[Math.floor(Math.random() * demoPrompts.length)];
        setIsGenerating(true);
        setGeneratedTree(null);
        setRevealedCount(0);
        // Simulate generation delay
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedTree(match.tree);
            // Reveal questions one by one
            let count = 0;
            const reveal = () => {
                count++;
                setRevealedCount(count);
                if (count < match.tree.length) {
                    timeoutRef.current = setTimeout(reveal, 400);
                }
            };
            timeoutRef.current = setTimeout(reveal, 200);
        }, 1800);
    }
    function handleQuickPrompt(prompt) {
        setInputValue(prompt);
        setGeneratedTree(null);
        setRevealedCount(0);
    }
    return (<section id="ai" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 bottom-0 h-[400px] w-[500px] rounded-full bg-accent-branch/5 blur-[100px]"/>
        <div className="absolute top-0 left-0 h-[300px] w-[400px] rounded-full bg-primary/5 blur-[100px]"/>
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wider text-primary uppercase">
            AI Magic
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Describe it.{" "}
            <span className="text-accent-route font-heading">We build it.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Just tell us what you want to learn from your users.
            Our AI generates the perfect branching question tree.
          </p>
        </div>

        {/* Input area */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border/50 bg-card/60 p-6 sm:p-8">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Describe your form goal
            </label>
            <div className="flex gap-3">
              <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={placeholderSuggestions[placeholderIndex]} className="h-12 flex-1 bg-background text-base" onKeyDown={(e) => e.key === "Enter" && handleGenerate()}/>
              <Button onClick={handleGenerate} isDisabled={isGenerating} className="h-12 px-6 shadow-lg shadow-primary/20">
                {isGenerating ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<>
                    <Sparkles className="mr-1.5 h-4 w-4"/>
                    Generate
                  </>)}
              </Button>
            </div>

            {/* Quick prompt chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {placeholderSuggestions.map((p) => (<button key={p} onClick={() => handleQuickPrompt(p)} className="rounded-full border border-border/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground">
                  {p}
                </button>))}
            </div>
          </div>

          {/* Generated tree output */}
          {(isGenerating || generatedTree) && (<div className="mt-8 space-y-4">
              {isGenerating && (<div className="flex items-center justify-center gap-3 py-8">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-primary/20 border-t-primary"/>
                    <Sparkles className="absolute inset-0 m-auto h-4 w-4 text-primary"/>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    AI is building your question tree...
                  </span>
                </div>)}

              {generatedTree &&
                generatedTree.map((q, i) => (<div key={i} className={`transition-all duration-500 ${i < revealedCount
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"}`}>
                    <div className="rounded-xl border border-border/50 bg-card/60 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                          Question {i + 1}
                        </span>
                      </div>
                      <p className="mb-3 font-semibold text-foreground">
                        {q.q}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => (<span key={opt} className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            {opt}
                            <ArrowRight className="h-3 w-3"/>
                          </span>))}
                      </div>
                    </div>
                    {/* Connector line */}
                    {i < generatedTree.length - 1 && (<div className="mx-auto h-4 w-px bg-border/50"/>)}
                  </div>))}
            </div>)}
        </div>
      </div>
    </section>);
}
