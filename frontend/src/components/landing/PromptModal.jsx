import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Plus, MoreHorizontal, Send, RefreshCw, X } from 'lucide-react';
export function PromptModal({ isOpen, onClose, onGenerateAndOpenEditor }) {
    const [promptText, setPromptText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const sampleChips = [
        '✨ Candidate Screening & Interview Form',
        '✨ Product NPS & Feedback Survey',
        '✨ Client Intake & Lead Gen Form',
        '✨ Tech Stack & Developer Preferences',
    ];
    if (!isOpen)
        return null;
    const handleGenerate = (customText) => {
        const textToUse = customText || promptText || 'Type or paste your form questions.';
        setIsGenerating(true);
        setTimeout(() => {
            const generated = {
                id: `form_ai_${Date.now()}`,
                title: textToUse.length > 40 ? `${textToUse.slice(0, 38)}...` : textToUse,
                description: `AI Generated Smart Form from prompt: "${textToUse}"`,
                status: 'draft',
                startQuestionId: 'q1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                nodes: {
                    q1: {
                        id: 'q1',
                        questionText: 'Do you currently use React in production?',
                        level: 1,
                        isStart: true,
                        options: [
                            { id: 'opt_1a', optionText: 'Yes, absolutely', nextQuestionId: 'q2_yes' },
                            { id: 'opt_1b', optionText: 'Somewhat / Neutral', nextQuestionId: 'q2_neutral' },
                            { id: 'opt_1c', optionText: 'No, not really', nextQuestionId: 'q2_no' },
                            { id: 'opt_1d', optionText: 'Never tried it', nextQuestionId: 'q2_never' },
                        ],
                    },
                    q2_yes: {
                        id: 'q2_yes',
                        questionText: 'What do you like most about React?',
                        level: 2,
                        options: [
                            { id: 'opt_2a', optionText: 'Component-driven architecture', nextQuestionId: null },
                            { id: 'opt_2b', optionText: 'Massive NPM ecosystem & hooks', nextQuestionId: null },
                            { id: 'opt_2c', optionText: 'Instant Hot Reload & Fast Refresh', nextQuestionId: null },
                        ],
                    },
                    q2_neutral: {
                        id: 'q2_neutral',
                        questionText: 'What would make you like React more?',
                        level: 2,
                        options: [
                            { id: 'opt_2d', optionText: 'Simpler state management', nextQuestionId: null },
                            { id: 'opt_2e', optionText: 'Fewer re-render surprises', nextQuestionId: null },
                        ],
                    },
                    q2_no: {
                        id: 'q2_no',
                        questionText: 'Why don’t you prefer React?',
                        level: 2,
                        options: [
                            { id: 'opt_2f', optionText: 'Too complex & bloated', nextQuestionId: null },
                            { id: 'opt_2g', optionText: 'Prefer Vue / Svelte simplicity', nextQuestionId: null },
                        ],
                    },
                    q2_never: {
                        id: 'q2_never',
                        questionText: 'Why haven’t you tried React yet?',
                        level: 2,
                        options: [
                            { id: 'opt_2h', optionText: 'Never had a chance in projects', nextQuestionId: null },
                            { id: 'opt_2i', optionText: 'Happy with current tech stack', nextQuestionId: null },
                        ],
                    },
                },
            };
            setIsGenerating(false);
            onClose();
            onGenerateAndOpenEditor(generated);
        }, 1400);
    };
    const handleStartFromScratch = () => {
        onClose();
        onGenerateAndOpenEditor();
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-primary/20 bg-background/95 p-8 md:p-10 shadow-2xl relative font-sans text-center flex flex-col items-center justify-center">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="Close popup">
          <X className="h-5 w-5"/>
        </button>

        {isGenerating ? (<div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg animate-bounce">
              <RefreshCw className="h-7 w-7 animate-spin"/>
            </div>
            <h4 className="text-xl font-bold text-foreground font-serif">
              Typeform AI is crafting your form...
            </h4>
            <p className="text-sm text-muted-foreground max-w-md">
              Synthesizing question nodes, branching logic map, and launching into editor.
            </p>
          </div>) : (<div className="w-full max-w-xl space-y-8 my-2">
            {/* Tagline */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase font-mono">
                Typeform AI
              </span>
              <h2 className="text-3xl md:text-4xl font-normal text-foreground font-serif tracking-tight">
                What would you like to create?
              </h2>
            </div>

            {/* Prompt Box Container (Matching Typeform AI Picture) */}
            <div className="relative w-full rounded-3xl border-2 border-accent-route/50 dark:border-accent-route/40 bg-card p-5 shadow-lg shadow-accent-route/10 focus-within:border-accent-route focus-within:ring-4 focus-within:ring-accent-route/15 transition-all text-left">
              <textarea rows={3} value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder="Type or paste your form questions." className="w-full resize-none bg-transparent text-base font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-sans"/>

              {/* Bottom Inside Bar with Mic, Plus, Ellipsis on Left & Send Arrow on Right */}
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <button className="hover:text-foreground transition-colors p-1" title="Voice Input">
                    <Mic className="h-4 w-4"/>
                  </button>
                  <button className="hover:text-foreground transition-colors p-1" title="Attach Document / Link">
                    <Plus className="h-4 w-4"/>
                  </button>
                  <button className="hover:text-foreground transition-colors p-1" title="More Options">
                    <MoreHorizontal className="h-4 w-4"/>
                  </button>
                </div>

                <Button size="icon" onClick={() => handleGenerate()} className="rounded-full h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                  <Send className="h-4 w-4"/>
                </Button>
              </div>
            </div>

            {/* Template Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {sampleChips.map((chip, idx) => (<button key={idx} onClick={() => {
                    const text = chip.replace('✨ ', '');
                    setPromptText(text);
                    handleGenerate(text);
                }} className="rounded-full border border-border/80 bg-secondary/50 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:border-accent-route hover:bg-accent-route/10 transition-colors">
                  {chip}
                </button>))}
            </div>

            {/* Bottom Actions: Start from scratch | Sync to CRM */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button variant="outline" onClick={handleStartFromScratch} className="rounded-xl border-border bg-secondary/40 hover:bg-secondary px-6 py-2.5 text-xs font-semibold text-foreground">
                Start from scratch
              </Button>

              <Button variant="outline" onClick={() => handleGenerate('CRM Integration Intake Form')} className="rounded-xl border-border bg-secondary/40 hover:bg-secondary px-6 py-2.5 text-xs font-semibold text-foreground gap-2">
                Sync to CRM
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 rounded-full bg-accent-route text-[9px] font-bold text-white flex items-center justify-center">
                    Hub
                  </span>
                  <span className="h-4 w-4 rounded-full bg-blue-500 text-[9px] font-bold text-white flex items-center justify-center">
                    SF
                  </span>
                </span>
              </Button>
            </div>
          </div>)}
      </div>
    </div>);
}
