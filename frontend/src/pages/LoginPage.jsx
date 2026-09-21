import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { loginUser, registerUser } from '@/lib/authStore';
import {
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * LoginPage - Handles Sign In, Sign Up, and 1-Click Demo Login.
 * After successful login, redirects to the Workspace Dashboard (/workspace).
 */
export function LoginPage({ onLoginSuccess, onBackToLanding }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle standard form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (isSignUp && !displayName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const res = await registerUser({ displayName, email, password });
        if (res.success) {
          toast.success(`Welcome to Smart Forms, ${res.user.displayName}!`);
          onLoginSuccess(res.user);
        }
      } else {
        const res = await loginUser({ email, password });
        if (res.success) {
          toast.success(`Welcome back, ${res.user.displayName}!`);
          onLoginSuccess(res.user);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // 1-Click Demo Login for quick testing without typing
  async function handleDemoLogin() {
    setIsLoading(true);
    setErrorMsg('');
    setEmail('demo@smartforms.dev');
    setPassword('password123');

    try {
      const res = await loginUser({
        email: 'demo@smartforms.dev',
        password: 'password123',
      });
      if (res.success) {
        toast.success('Logged in with Demo Account!');
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setErrorMsg('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 w-[500px] h-[400px] bg-accent-route/10 rounded-full blur-[120px]" />

      {/* Top Header Navigation */}
      <header className="px-6 py-5 flex items-center justify-between z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-foreground font-sans">
            Smart Forms
          </span>
        </div>
      </header>

      {/* Centered Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-route/10 border border-accent-route/20 text-accent-route text-xs font-bold font-mono">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Secure Authentication</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-serif tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isSignUp
                ? 'Sign up to build intelligent, branching forms'
                : 'Enter your credentials to access your workspace'}
            </p>
          </div>

          {/* 1-Click Quick Demo Login Button */}
          <div className="p-3.5 rounded-2xl border border-primary/20 bg-primary/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Instant Preview
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">1-Click Login</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Skip typing credentials to jump straight into your workspace.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full rounded-xl border-primary/30 hover:bg-primary/10 text-primary font-bold text-xs h-9 cursor-pointer gap-1.5 transition-all shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Log In as Demo Creator
            </Button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-border/70 w-full" />
            <span className="bg-card px-3 text-[11px] font-mono text-muted-foreground uppercase">
              Or with email
            </span>
            <div className="border-t border-border/70 w-full" />
          </div>

          {/* Form Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Sign In / Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => toast.info('For testing, use password123')}
                    className="text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs h-10 shadow-md gap-2 cursor-pointer transition-all mt-2"
            >
              {isLoading ? (
                'Processing...'
              ) : isSignUp ? (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Sign In to Workspace <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle between Sign in and Sign up */}
          <div className="text-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                }}
                className="font-bold text-primary hover:underline cursor-pointer transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center text-[11px] text-muted-foreground font-mono z-10">
        Smart Forms &copy; 2026 &bull; AI-Powered Adaptive Forms
      </footer>
    </div>
  );
}
