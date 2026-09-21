import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Sparkles, Layers, Share2, BarChart3, Sun, Moon, Eye, Send, Edit2, CheckCircle2, GitBranch } from 'lucide-react';
export function TypeformNavbar({ activeTab, onTabChange, formTitle, onTitleChange, onOpenAiChat, onOpenPreview, isPublished = false, onPublish, onBackToWorkspace, }) {
    const { theme, setTheme } = useTheme();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const tabs = [
        { id: 'create', label: 'Create', icon: Layers },
        { id: 'workflow', label: 'Workflow & Pipeline', icon: GitBranch },
        { id: 'share', label: 'Share', icon: Share2 },
        { id: 'results', label: 'Results', icon: BarChart3 },
    ];
    return (<header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md px-4 py-1.5 h-12 flex items-center justify-between font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Left: Logo & Form Title Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs shrink-0">
          <Sparkles className="h-4 w-4"/>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span onClick={onBackToWorkspace} className="hover:text-foreground cursor-pointer transition-colors">Forms</span>
          <span>&gt;</span>
          {isEditingTitle ? (<input type="text" autoFocus value={formTitle} onChange={(e) => onTitleChange(e.target.value)} onBlur={() => setIsEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)} className="rounded border border-primary bg-background px-2 py-0.5 text-xs font-bold text-foreground focus:outline-none"/>) : (<button onClick={() => setIsEditingTitle(true)} className="group flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-bold text-foreground hover:bg-secondary transition-colors">
              <span className="truncate max-w-[180px] sm:max-w-[260px]">{formTitle}</span>
              <Edit2 className="h-3 w-3 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"/>
            </button>)}

          {isPublished && (<span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[9px] font-bold border border-emerald-500/20 flex items-center gap-1 animate-in fade-in duration-300">
              <CheckCircle2 className="h-2.5 w-2.5"/> Published
            </span>)}
        </div>
      </div>

      {/* Center: Workspace Navigation Tabs */}
      <nav className="flex items-center gap-1 rounded-full border border-border/80 bg-secondary/50 p-1 shadow-2xs">
        {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (<button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${isActive
                    ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-[#0F172A] border border-[#0F172A] dark:border-slate-100 shadow-2xs font-bold'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-foreground hover:bg-[#F5F6F1] dark:hover:bg-slate-800/80 font-semibold'}`}>
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white dark:text-[#0F172A]' : 'text-[#64748B] dark:text-slate-400'}`}/>
              {tab.label}
            </button>);
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {onOpenAiChat && (<Button variant="outline" size="sm" onClick={onOpenAiChat} className="rounded-full bg-[#F5F3FF] dark:bg-[#2E1065] border border-[#DDD6FE] dark:border-[#5B21B6] text-[#7C3AED] dark:text-[#DDD6FE] hover:bg-purple-100 dark:hover:bg-purple-900/60 text-xs font-semibold gap-1.5 h-8 px-3.5 shadow-2xs transition-colors">
            <Sparkles className="h-3.5 w-3.5 text-[#7C3AED] dark:text-[#DDD6FE]"/> AI Assistant
          </Button>)}

        <Button variant="outline" size="sm" onClick={onOpenPreview} className="rounded-full border-border hover:bg-[#F5F6F1] dark:hover:bg-slate-800 text-xs font-semibold gap-1.5 h-8 px-3.5">
          <Eye className="h-3.5 w-3.5 text-[#6366F1] dark:text-indigo-400"/> Preview
        </Button>

        <Button size="sm" onClick={() => {
            if (onPublish)
                onPublish();
        }} className="rounded-full bg-[#0F172A] dark:bg-slate-100 text-white dark:text-[#0F172A] hover:bg-[#1E293B] dark:hover:bg-slate-200 text-xs font-bold gap-1.5 h-8 px-4 shadow-sm transition-colors">
          <Send className="h-3 w-3"/> Publish
        </Button>

        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full h-8 w-8 border border-border/80 text-foreground hover:bg-[#F5F6F1] dark:hover:bg-slate-800" aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
          {theme === 'dark' ? (<Sun className="h-4 w-4 text-indigo-400"/>) : (<Moon className="h-4 w-4 text-slate-700"/>)}
        </Button>
      </div>
    </header>);
}
