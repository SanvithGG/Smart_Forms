import { useState, useEffect, useCallback } from 'react';
import { saveSessionToStorage } from '@/lib/formStore';
import { startBackendSession, submitBackendAnswer } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/components/theme-provider';
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, Sparkles, Home, Bot, Clock, Zap, X, Sun, Moon, Edit3 } from 'lucide-react';
import confetti from 'canvas-confetti';
const KEY_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
export function FormAnswerView({ form, onOpenEditor, onReturnHome }) {
    const isWelcomeEnabled = form.welcomeScreen ? form.welcomeScreen.enabled !== false : true;
    const [hasStarted, setHasStarted] = useState(!isWelcomeEnabled);
    const [currentQuestionId, setCurrentQuestionId] = useState(form.startQuestionId);
    const [history, setHistory] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [showAiModal, setShowAiModal] = useState(false);
    const [backendSessionId, setBackendSessionId] = useState(null);
    // Initialize backend response session when starting form
    useEffect(() => {
        if (hasStarted && !backendSessionId) {
            startBackendSession(form.id).then((res) => {
                if (res?.responseId) {
                    setBackendSessionId(res.responseId);
                }
            });
        }
    }, [hasStarted, form.id, backendSessionId]);
    useEffect(() => {
        const welcomeActive = form.welcomeScreen ? form.welcomeScreen.enabled !== false : true;
        setHasStarted(!welcomeActive);
        setCurrentQuestionId(form.startQuestionId);
        setHistory([]);
        setIsCompleted(false);
        setSelectedOptionId(null);
        setBackendSessionId(null);
    }, [form]);
    const { theme, setTheme } = useTheme();
    const currentNode = form.nodes[currentQuestionId];
    // Select Option Logic
    const handleSelectOption = useCallback((option) => {
        if (!currentNode || selectedOptionId)
            return;
        setSelectedOptionId(option.id);
        // Async send answer to backend
        if (backendSessionId) {
            submitBackendAnswer(backendSessionId, currentNode.id, option.id);
        }
        const answer = {
            id: `ans_${Date.now()}`,
            sessionId: backendSessionId || `sess_${Date.now()}`,
            questionId: currentNode.id,
            questionText: currentNode.questionText,
            optionId: option.id,
            optionText: option.optionText,
            answeredAt: new Date().toISOString(),
        };
        const updatedHistory = [...history, { nodeId: currentNode.id, answer }];
        setTimeout(() => {
            setHistory(updatedHistory);
            setSelectedOptionId(null);
            if (option.nextQuestionId && form.nodes[option.nextQuestionId]) {
                setCurrentQuestionId(option.nextQuestionId);
            }
            else {
                setIsCompleted(true);
                try {
                    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                } catch (e) {
                    // confetti optional
                }
                const finalSession = {
                    id: backendSessionId || `sess_${Date.now()}`,
                    formId: form.id,
                    formTitle: form.title,
                    startedAt: updatedHistory[0]?.answer.answeredAt || new Date().toISOString(),
                    completedAt: new Date().toISOString(),
                    isCompleted: true,
                    pathTaken: updatedHistory.map((h) => h.nodeId),
                    answers: updatedHistory.map((h) => h.answer),
                };
                saveSessionToStorage(finalSession);
            }
        }, 350);
    }, [currentNode, form.id, form.nodes, form.title, history, selectedOptionId, backendSessionId]);
    // Keyboard Shortcuts Listener (A, B, C, D or 1, 2, 3, 4)
    useEffect(() => {
        if (isCompleted || !currentNode || selectedOptionId !== null)
            return;
        function handleKeyDown(e) {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || !currentNode)
                return;
            const key = e.key.toUpperCase();
            const keyIndex = KEY_LABELS.indexOf(key);
            if (keyIndex !== -1 && currentNode.options[keyIndex]) {
                e.preventDefault();
                handleSelectOption(currentNode.options[keyIndex]);
                return;
            }
            const numIndex = parseInt(e.key, 10) - 1;
            if (!isNaN(numIndex) && numIndex >= 0 && currentNode.options[numIndex]) {
                e.preventDefault();
                handleSelectOption(currentNode.options[numIndex]);
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentNode, handleSelectOption, isCompleted, selectedOptionId]);
    function handlePreviousQuestion() {
        if (history.length === 0)
            return;
        const prevHistory = history.slice(0, -1);
        const lastItem = history[history.length - 1];
        setHistory(prevHistory);
        setCurrentQuestionId(lastItem.nodeId);
        setIsCompleted(false);
    }
    function handleRestart() {
        setCurrentQuestionId(form.startQuestionId);
        setHistory([]);
        setIsCompleted(false);
        setSelectedOptionId(null);
        setHasStarted(false);
    }
    const currentStep = history.length + 1;
    const progressPercent = isCompleted ? 100 : Math.min(Math.round((history.length / 3) * 100), 90);
    return (<div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <button onClick={onReturnHome} className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5"/>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-sans">
              Smart Forms
            </span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-accent-route"/> {form.welcomeScreen?.timeToComplete || '~2 min survey'}
            </span>

            {/* Theme Toggle Button */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full h-9 w-9 border border-border/80 text-foreground hover:bg-secondary" aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              {theme === 'dark' ? (<Sun className="h-4 w-4 text-accent-route"/>) : (<Moon className="h-4 w-4 text-slate-700"/>)}
            </Button>

            {onOpenEditor && (<Button variant="outline" size="sm" onClick={onOpenEditor} className="gap-1.5 text-xs font-semibold rounded-full border-border hover:bg-secondary">
                <Edit3 className="h-3.5 w-3.5 text-primary"/>
                Edit Form
              </Button>)}

            <Button variant="ghost" size="sm" onClick={onReturnHome} className="gap-2 text-sm text-muted-foreground hover:text-foreground rounded-full px-3">
              <Home className="h-4 w-4"/>
              Home
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-secondary">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}/>
        </div>
      </header>

      {/* Respondent View Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!hasStarted ? (
        /* Welcome Screen Card */
        <Card className="w-full max-w-2xl border-border bg-card shadow-xl rounded-3xl p-8 sm:p-12 text-center space-y-8 animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Sparkles className="h-8 w-8 text-primary"/>
            </div>

            <div className="space-y-3 max-w-lg mx-auto">
              <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl font-serif leading-tight">
                {form.welcomeScreen?.title || form.title}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {form.welcomeScreen?.subtitle || form.description || 'Please provide accurate details to help us evaluate your response.'}
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Button size="lg" onClick={() => setHasStarted(true)} className="rounded-full bg-[#0F172A] dark:bg-slate-100 text-white dark:text-[#0F172A] hover:bg-[#1E293B] dark:hover:bg-slate-200 px-8 py-3 text-sm font-bold shadow-lg gap-2 cursor-pointer transition-colors">
                {form.welcomeScreen?.buttonText || 'Start Application'}
                <ArrowRight className="h-4 w-4"/>
              </Button>

              {form.welcomeScreen?.timeToComplete && (<p className="text-xs text-muted-foreground font-mono">
                  ⏱ {form.welcomeScreen.timeToComplete}
                </p>)}
            </div>
          </Card>) : isCompleted ? (
        /* Completion Summary Screen */
        <Card className="w-full max-w-2xl border-border bg-card shadow-xl rounded-3xl p-8 sm:p-12 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner">
              <CheckCircle2 className="h-10 w-10"/>
            </div>

            <div className="space-y-3">
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                Response Recorded
              </span>
              <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl font-serif">
                Thank You for Your Feedback!
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Your path was dynamically adapted based on your responses.
              </p>
            </div>

            {/* Answer Summary Path */}
            <div className="rounded-2xl border border-border bg-secondary/40 p-5 text-left space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Your Response Summary ({history.length} steps)
              </h4>
              <div className="space-y-2">
                {history.map((item, idx) => (<div key={item.answer.id} className="flex items-start gap-3 text-xs">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{item.answer.questionText}</p>
                      <p className="text-primary font-medium mt-0.5">➔ {item.answer.optionText}</p>
                    </div>
                  </div>))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button onClick={handleRestart} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 text-sm font-semibold shadow-md gap-2">
                <RotateCcw className="h-4 w-4"/> Retake Survey
              </Button>
              <Button variant="outline" onClick={onReturnHome} className="rounded-full border-border hover:bg-secondary px-6 py-2.5 text-sm font-semibold gap-2">
                <Home className="h-4 w-4"/> Back to Home
              </Button>
            </div>
          </Card>) : currentNode ? (
        /* Clean Respondent Survey Card */
        <div className="w-full max-w-3xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/10 text-primary px-3.5 py-1 text-xs font-bold border border-primary/20 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5"/> Step {currentStep}
              </span>

              {history.length > 0 && (<button onClick={handlePreviousQuestion} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                  <ArrowLeft className="h-3.5 w-3.5"/> Previous Question
                </button>)}
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight font-serif">
                {currentNode.questionText}
              </h1>
              <p className="text-sm text-muted-foreground">
                Select an answer below or press the corresponding key on your keyboard.
              </p>
            </div>

            {/* 4 Choice Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              {currentNode.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const keyShortcut = KEY_LABELS[idx];
                return (<button key={option.id} onClick={() => handleSelectOption(option)} disabled={selectedOptionId !== null} className={`group relative flex flex-col justify-between rounded-3xl border p-5 text-left transition-all duration-500 ease-out ${isSelected
                        ? 'bg-slate-100 dark:bg-white text-slate-900 shadow-2xl scale-[1.02] border-transparent ring-2 ring-white/40'
                        : selectedOptionId !== null
                            ? 'opacity-65 cursor-not-allowed border-border/40 bg-card/60 text-muted-foreground scale-[0.99]'
                            : 'border-border/80 bg-card hover:border-primary/80 hover:bg-secondary/60 hover:scale-[1.01] shadow-xs text-foreground'}`}>
                    <div className="flex items-center justify-between w-full mb-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-extrabold transition-all ${isSelected
                        ? 'bg-slate-900 dark:bg-black text-white shadow-sm'
                        : 'bg-secondary text-foreground border border-border group-hover:border-primary/40'}`}>
                        {keyShortcut}
                      </span>
                      <ArrowRight className={`h-5 w-5 transition-transform duration-200 ${isSelected
                        ? 'translate-x-1 text-slate-900 dark:text-black'
                        : 'text-muted-foreground group-hover:translate-x-1 group-hover:text-primary'}`}/>
                    </div>

                    <span className={`text-base font-bold font-sans leading-snug transition-colors ${isSelected ? 'text-slate-900 dark:text-black' : 'text-foreground'}`}>
                      {option.optionText}
                    </span>
                  </button>);
            })}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground pt-3">
              <span className="rounded-full bg-secondary px-2.5 py-1 font-mono font-bold text-foreground border border-border">
                Key A, B, C, D
              </span>
              <span>or click any option card to navigate</span>
            </div>
          </div>) : null}
      </main>

      {/* Floating AI Assistant Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button onClick={() => setShowAiModal(true)} className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 py-2.5 text-xs font-bold shadow-2xl gap-2 transition-all hover:scale-105">
          <Bot className="h-4 w-4 text-primary"/>
          Need help? Ask AI
        </Button>
      </div>

      {/* AI Help Modal */}
      {showAiModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <Card className="w-full max-w-md border-border bg-card p-6 shadow-2xl space-y-4 rounded-3xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary"/>
                <h3 className="font-bold text-foreground text-base">Smart AI Assistant</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary">
                <X className="h-5 w-5"/>
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              I can assist you in clarifying question options or explaining specific frontend terms like Component Architecture, Hooks, or Hot Reload!
            </p>

            <div className="p-3 rounded-2xl bg-secondary/50 border border-border text-xs space-y-1">
              <p className="font-semibold text-foreground">💡 Tip for this question:</p>
              <p className="text-muted-foreground">
                "{currentNode?.questionText}" is evaluating your core developer preference to customize the next set of questions.
              </p>
            </div>

            <Button onClick={() => setShowAiModal(false)} className="w-full rounded-full bg-primary text-primary-foreground font-semibold text-xs py-2">
              Got it, back to survey
            </Button>
          </Card>
        </div>)}
    </div>);
}
