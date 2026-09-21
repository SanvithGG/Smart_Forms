import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  Briefcase,
  UserCheck,
  Code2,
  TrendingUp,
} from 'lucide-react';

/**
 * OnboardingFlow - 3-step setup wizard asking for role, form goal, and team size.
 */
export function OnboardingFlow({ onCompleteOnboarding }) {
  const { theme, setTheme } = useTheme();

  // Current wizard step (1, 2, or 3)
  const [step, setStep] = useState(1);

  // Selected answers for each step
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Available options
  const roles = [
    {
      id: 'businessman',
      label: 'Businessman / Owner',
      desc: 'Growing my business and collecting customer insights',
      icon: Briefcase,
      color: 'text-accent-route bg-accent-route/10',
    },
    {
      id: 'recruiter',
      label: 'Recruiter / HR Specialist',
      desc: 'Screening candidates and evaluating talent applications',
      icon: UserCheck,
      color: 'text-accent-branch bg-accent-branch/10',
    },
    {
      id: 'developer',
      label: 'Developer / Engineer',
      desc: 'Building smart form workflows with APIs and webhooks',
      icon: Code2,
      color: 'text-cyan-500 bg-cyan-500/10',
    },
    {
      id: 'marketer',
      label: 'Marketer / Growth Lead',
      desc: 'Capturing qualified leads and driving campaign conversions',
      icon: TrendingUp,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
  ];

  const goals = [
    {
      id: 'screening',
      label: 'Candidate Screening & Applications',
      desc: 'Automate HR application filtering with smart logic',
    },
    {
      id: 'feedback',
      label: 'Customer Feedback & NPS Surveys',
      desc: 'Understand product satisfaction and feature requests',
    },
    {
      id: 'leads',
      label: 'Lead Generation & Contact Forms',
      desc: 'Collect qualified sales leads and booking info',
    },
    {
      id: 'events',
      label: 'Event Registration & RSVPs',
      desc: 'Manage attendee registrations for webinars and conferences',
    },
  ];

  const teamSizes = [
    'Solo / Freelancer',
    '2 - 10 employees',
    '11 - 50 employees',
    '50+ Enterprise',
  ];

  // Helper functions for button styling (eliminating nested ternaries)
  function getOptionCardClass(isSelected) {
    if (isSelected) {
      return 'border-accent-route bg-accent-route/10 ring-2 ring-accent-route/30 shadow-lg scale-[1.01]';
    }
    return 'border-border bg-card hover:border-accent-route/60 hover:bg-secondary/60 hover:scale-[1.01] shadow-xs';
  }

  function getBadgeClass(isSelected) {
    if (isSelected) {
      return 'bg-accent-route text-white border-transparent';
    }
    return 'bg-secondary text-foreground border-border';
  }

  // Handle advancing to the next step
  function handleNextStep() {
    if (step === 1 && selectedRole) {
      setStep(2);
    } else if (step === 2 && selectedGoal) {
      setStep(3);
    } else if (step === 3 && selectedTeam && selectedRole && selectedGoal) {
      onCompleteOnboarding({
        role: selectedRole.id,
        roleLabel: selectedRole.label,
        goal: selectedGoal.id,
        goalLabel: selectedGoal.label,
        teamSize: selectedTeam,
      });
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-sans">
            Smart Forms
          </span>
          <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold border border-primary/20">
            Welcome Onboarding
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-muted-foreground">
            Step {step} of 3
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Step Progress Indicators */}
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map(function (stepNumber) {
              let widthClass = 'w-6 bg-secondary';
              if (stepNumber === step) {
                widthClass = 'w-12 bg-primary';
              } else if (stepNumber < step) {
                widthClass = 'w-6 bg-emerald-500';
              }

              return (
                <div
                  key={stepNumber}
                  className={'h-2.5 rounded-full transition-all duration-300 ' + widthClass}
                />
              );
            })}
          </div>

          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="space-y-2">
                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider border border-primary/20">
                  Step 1 • Your Role
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight font-serif">
                  What best describes your primary role?
                </h1>
                <p className="text-sm text-muted-foreground">
                  We'll tailor your AI form templates and visual builder workflow based on your team needs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {roles.map(function (role, index) {
                  const isSelected = selectedRole?.id === role.id;
                  const IconComponent = role.icon;
                  const keyLetter = String.fromCharCode(65 + index);

                  return (
                    <button
                      key={role.id}
                      onClick={function () {
                        setSelectedRole({ id: role.id, label: role.label });
                      }}
                      className={
                        'group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer ' +
                        getOptionCardClass(isSelected)
                      }
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div
                          className={
                            'flex h-10 w-10 items-center justify-center rounded-xl font-bold ' +
                            role.color
                          }
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span
                          className={
                            'flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold border ' +
                            getBadgeClass(isSelected)
                          }
                        >
                          {keyLetter}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-foreground font-sans">
                          {role.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {role.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNextStep}
                  disabled={!selectedRole}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-sm font-semibold shadow-md gap-2 cursor-pointer"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: FORM GOAL */}
          {step === 2 && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="space-y-2">
                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider border border-primary/20">
                  Step 2 • Form Goal
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight font-serif">
                  What type of form do you want to build today?
                </h1>
                <p className="text-sm text-muted-foreground">
                  Our AI will generate custom question blocks and logic jumps for this specific goal.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {goals.map(function (goal, index) {
                  const isSelected = selectedGoal?.id === goal.id;
                  const keyLetter = String.fromCharCode(65 + index);

                  return (
                    <button
                      key={goal.id}
                      onClick={function () {
                        setSelectedGoal({ id: goal.id, label: goal.label });
                      }}
                      className={
                        'group relative flex w-full items-center justify-between rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer ' +
                        getOptionCardClass(isSelected)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold border ' +
                            getBadgeClass(isSelected)
                          }
                        >
                          {keyLetter}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-foreground font-sans">
                            {goal.label}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{goal.desc}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-accent-route shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={function () {
                    setStep(1);
                  }}
                  className="rounded-full border-border hover:bg-secondary px-6 text-xs font-semibold cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!selectedGoal}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-sm font-semibold shadow-md gap-2 cursor-pointer"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: TEAM SIZE */}
          {step === 3 && (
            <div className="space-y-6 text-center sm:text-left">
              <div className="space-y-2">
                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider border border-primary/20">
                  Step 3 • Team Size
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight font-serif">
                  How many people are on your team?
                </h1>
                <p className="text-sm text-muted-foreground">
                  Helps us configure workspace sharing and integration permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {teamSizes.map(function (teamOption, index) {
                  const isSelected = selectedTeam === teamOption;
                  const keyLetter = String.fromCharCode(65 + index);

                  return (
                    <button
                      key={teamOption}
                      onClick={function () {
                        setSelectedTeam(teamOption);
                      }}
                      className={
                        'group relative flex items-center justify-between rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer ' +
                        getOptionCardClass(isSelected)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={
                            'flex h-8 w-8 items-center justify-center rounded-xl font-mono text-sm font-bold border ' +
                            getBadgeClass(isSelected)
                          }
                        >
                          {keyLetter}
                        </span>
                        <span className="text-base font-bold text-foreground font-sans">
                          {teamOption}
                        </span>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-accent-route shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={function () {
                    setStep(2);
                  }}
                  className="rounded-full border-border hover:bg-secondary px-6 text-xs font-semibold cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!selectedTeam}
                  className="rounded-full bg-accent-route text-white hover:brightness-110 px-8 py-3 text-sm font-bold shadow-lg gap-2 cursor-pointer"
                >
                  Generate AI Chat Page <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
