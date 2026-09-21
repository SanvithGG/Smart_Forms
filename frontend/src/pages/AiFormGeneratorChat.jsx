import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import {
  Sparkles,
  Send,
  Bot,
  ArrowRight,
  Sun,
  Moon,
  Wand2,
  CheckCircle2,
  Layers,
  X,
} from 'lucide-react';

/**
 * Determine the initial prompt text based on the user's chosen role during onboarding
 */
function getDefaultPrompt(role) {
  if (role === 'recruiter') {
    return 'Build a candidate screening form for Senior React Developer with experience, portfolio link, and salary expectation';
  }
  if (role === 'businessman') {
    return 'Create a customer satisfaction survey with product feedback, rating scale, and follow-up logic';
  }
  if (role === 'marketer') {
    return 'Design a high-converting lead generation form for digital agency services';
  }
  return 'Create an interactive developer preference survey on React vs Vue vs Angular with branching logic';
}

/**
 * AiFormGeneratorChat - Conversational AI generator for creating forms from a text prompt.
 */
export function AiFormGeneratorChat({ profile, onLaunchBuilder }) {
  const { theme, setTheme } = useTheme();

  const userRole = profile?.roleLabel || 'Professional';
  const userGoal = profile?.goalLabel || 'Custom Survey';

  // Input prompt state
  const [promptText, setPromptText] = useState(function () {
    return getDefaultPrompt(profile?.role);
  });

  // Loading and result states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState(null);

  const sampleChips = [
    '✨ Candidate Screening & Interview Form',
    '✨ Product NPS & Feedback Survey',
    '✨ Client Intake & Lead Gen Form',
    '✨ Tech Stack & Developer Preferences',
  ];

  // Handler to simulate generating an AI form from prompt text
  function handleGenerate() {
    if (!promptText.trim()) {
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with a brief timeout
    setTimeout(function () {
      let formTitle = promptText;
      if (promptText.length > 40) {
        formTitle = promptText.slice(0, 38) + '...';
      }

      const generated = {
        id: 'form_ai_' + Date.now(),
        title: formTitle,
        description: 'AI Generated Form tailored for ' + userRole + ' (' + userGoal + ')',
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

      setGeneratedForm(generated);
      setIsGenerating(false);
    }, 1600);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-sans">
            Smart Forms
          </span>
          <span className="rounded-full bg-accent-branch text-white px-2.5 py-0.5 text-xs font-bold shadow-xs">
            AI Form Creator Chat
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline-block">
            Tailored for: <strong className="text-foreground">{userRole}</strong>
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={function () {
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
            className="rounded-full h-9 w-9 border border-border/80 text-foreground hover:bg-secondary cursor-pointer"
            aria-label={'Switch to ' + (theme === 'dark' ? 'Light' : 'Dark') + ' Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-accent-route" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Chat Canvas */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col space-y-8">
        {/* Intro Message */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-bold border border-primary/20">
            <Bot className="h-4 w-4" /> AI Assistant Ready
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl font-serif leading-tight">
            What type of form do you want to create?
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Describe your form requirement below. Our AI will automatically generate the question
            structure, choices, and logic map routes for your <strong>{userRole}</strong> profile.
          </p>
        </div>

        {/* Prompt Input Box */}
        <div className="w-full max-w-3xl mx-auto space-y-4">
          <div className="relative rounded-3xl border border-border bg-card p-3 shadow-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <textarea
              rows={3}
              value={promptText}
              onChange={function (e) {
                setPromptText(e.target.value);
              }}
              placeholder="e.g. Build a 4-step candidate application form for Senior Full Stack Developer..."
              className="w-full resize-none bg-transparent px-3 py-2 text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-sans"
            />

            <div className="flex items-center justify-between border-t border-border/60 pt-3 px-2">
              <span className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-primary" /> Natural Language AI Generator
              </span>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !promptText.trim()}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-xs font-bold shadow-md gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    Generate Form <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Prompt Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {sampleChips.map(function (chip, index) {
              return (
                <button
                  key={index}
                  onClick={function () {
                    setPromptText(chip.replace('✨ ', ''));
                  }}
                  className="rounded-full border border-border/80 bg-secondary/40 px-3.5 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generating Indicator Card */}
        {isGenerating && (
          <div className="w-full max-w-3xl mx-auto rounded-3xl border border-primary/40 bg-primary/5 p-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg animate-bounce">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground font-sans">
              AI is crafting your form questions & logic map...
            </h3>
            <p className="text-xs text-muted-foreground">
              Synthesizing branching paths, choice cards, and end screens tailored for {userRole}.
            </p>
          </div>
        )}

        {/* Generated Form Preview Modal */}
        {generatedForm && !isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl border border-primary/30 bg-card p-6 md:p-8 shadow-2xl space-y-6 overflow-y-auto flex flex-col justify-between relative font-sans">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-md">
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground font-serif">
                      Form Generated Successfully! 🎉
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {Object.keys(generatedForm.nodes).length} Question Nodes • Complete Logic Branching Map
                    </p>
                  </div>
                </div>

                <button
                  onClick={function () {
                    setGeneratedForm(null);
                  }}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  title="Close popup"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Question list preview */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" /> Question Blocks & Branching Options
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {Object.values(generatedForm.nodes).map(function (node) {
                    return (
                      <div
                        key={node.id}
                        className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-muted-foreground">
                            Level {node.level} • {node.id}
                          </span>
                          {node.isStart && (
                            <span className="rounded-full bg-accent-route/10 text-accent-route px-2.5 py-0.5 text-[9px] font-bold border border-accent-route/20">
                              ROOT QUESTION
                            </span>
                          )}
                        </div>
                        <h5 className="text-sm font-bold text-foreground font-serif">
                          {node.questionText}
                        </h5>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {node.options.map(function (option, optIdx) {
                            return (
                              <span
                                key={option.id || optIdx}
                                className="rounded-lg bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground border border-border/60 shadow-xs"
                              >
                                {option.optionText}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <Button
                  variant="outline"
                  onClick={function () {
                    setGeneratedForm(null);
                  }}
                  className="rounded-full border-border text-xs font-semibold px-5 h-9 hover:bg-secondary cursor-pointer"
                >
                  Edit Prompt
                </Button>

                <Button
                  onClick={function () {
                    const formToLaunch = generatedForm;
                    setGeneratedForm(null);
                    onLaunchBuilder(formToLaunch);
                  }}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-9 text-xs font-bold shadow-md gap-2 cursor-pointer"
                >
                  🚀 Open in Typeform Builder <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
