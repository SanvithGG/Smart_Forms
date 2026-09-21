import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Users,
  Settings,
  Lock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Send,
  Trash2,
  Edit3,
  Eye,
  Copy,
  Puzzle,
  Palette,
  FolderOpen,
  LogOut,
} from 'lucide-react';
import {
  getFormsFromStorage,
  getSessionsFromStorage,
  deleteFormFromStorage,
  saveFormToStorage,
} from '@/lib/formStore';
import { getStoredUser, clearStoredAuth } from '@/lib/authStore';
import { checkBackendHealth, fetchFormFromBackend } from '@/lib/api';
import { CreateFormModal } from '@/components/workspace/CreateFormModal';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

/**
 * WorkspaceDashboard - Main workspace dashboard listing forms, stats, and search.
 */
export function WorkspaceDashboard({ onOpenForm, onOpenPreview, onLogout }) {
  // ==========================================
  // 1. STATE VARIABLES
  // ==========================================
  const [forms, setForms] = useState([]);
  const [formListVersion, setFormListVersion] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState('forms');
  const [activeWorkspace, setActiveWorkspace] = useState('my-workspace');
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({ private: true });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [aiInput, setAiInput] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const currentUser = getStoredUser() || { displayName: 'Demo Creator', email: 'demo@smartforms.dev' };
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    message: 'Checking backend...',
  });

  // ==========================================
  // 2. EFFECTS (HEALTH CHECK & DATA LOADING)
  // ==========================================

  // Check Spring Boot backend health and sync default form periodically
  useEffect(function () {
    let isMounted = true;

    async function checkHealth() {
      const status = await checkBackendHealth();
      if (isMounted) {
        setBackendStatus(status);
      }

      if (status.online) {
        const backendForm = await fetchFormFromBackend('react-feedback-survey');
        if (backendForm && isMounted) {
          saveFormToStorage(backendForm);
          setFormListVersion(function (currentVersion) {
            return currentVersion + 1;
          });
        }
      }
    }

    checkHealth();
    const intervalId = setInterval(checkHealth, 5000);

    return function () {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Reload the forms list from local storage when version changes
  useEffect(
    function () {
      const storedForms = getFormsFromStorage();
      const formsArray = Object.values(storedForms);

      // Sort with newest updated first
      formsArray.sort(function (formA, formB) {
        const timeA = new Date(formA.updatedAt).getTime();
        const timeB = new Date(formB.updatedAt).getTime();
        return timeB - timeA;
      });

      setForms(formsArray);
    },
    [formListVersion]
  );

  // ==========================================
  // 3. ACTION HANDLERS
  // ==========================================

  const handleFormCreated = useCallback(function () {
    setFormListVersion(function (version) {
      return version + 1;
    });
    toast.success('Form created successfully');
  }, []);

  const handleDeleteForm = useCallback(function (formId) {
    deleteFormFromStorage(formId);
    setFormListVersion(function (version) {
      return version + 1;
    });
    setOpenMenuId(null);
    toast.success('Form deleted');
  }, []);

  const handleDuplicateForm = useCallback(function (formToDuplicate) {
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    const duplicatedForm = {
      ...formToDuplicate,
      id: 'form-' + Date.now() + '-' + randomSuffix,
      title: formToDuplicate.title + ' (copy)',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveFormToStorage(duplicatedForm);
    setFormListVersion(function (version) {
      return version + 1;
    });
    setOpenMenuId(null);
    toast.success('Duplicated "' + formToDuplicate.title + '"');
  }, []);

  // Filter forms by search query
  const filteredForms = forms.filter(function (form) {
    const titleLower = form.title.toLowerCase();
    const queryLower = searchQuery.toLowerCase();
    return titleLower.includes(queryLower);
  });

  // Calculate responses for each form
  function getResponseCount(formId) {
    try {
      const sessions = getSessionsFromStorage(formId);
      return sessions.length;
    } catch {
      return 0;
    }
  }

  function getCompletedCount(formId) {
    try {
      const sessions = getSessionsFromStorage(formId);
      const completedSessions = sessions.filter(function (s) {
        return s.isCompleted;
      });
      return completedSessions.length;
    } catch {
      return 0;
    }
  }

  // Calculate total response count
  const responseCount = forms.reduce(function (total, form) {
    return total + getResponseCount(form.id);
  }, 0);
  const responseLimit = 10;

  function formatDate(isoString) {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }

  const subTabs = [
    { id: 'forms', label: 'Forms', icon: FolderOpen },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'automations', label: 'Automations', icon: Settings },
  ];

  // ==========================================
  // 4. RENDER HELPER FUNCTIONS (CLEAR & STEP-BY-STEP)
  // ==========================================

  function renderEmptyState() {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <FolderOpen className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <p className="text-[15px] font-semibold text-muted-foreground mb-1">
          No forms yet
        </p>
        <p className="text-[13px] text-muted-foreground/70 mb-4">
          Create your first form to get started
        </p>
        <button
          onClick={function () {
            setIsCreateModalOpen(true);
          }}
          className="h-8 px-4 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          + Create form
        </button>
      </div>
    );
  }

  function renderListView() {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_100px_100px_130px_80px_40px] items-center h-10 px-4 bg-secondary/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
          <span>Name</span>
          <span className="text-center">Responses</span>
          <span className="text-center">Completed</span>
          <span className="text-center">Updated</span>
          <span className="text-center">Status</span>
          <span></span>
        </div>

        {/* Rows */}
        {filteredForms.map(function (form) {
          const isLive = form.status === 'live';
          const responses = getResponseCount(form.id);
          const completed = getCompletedCount(form.id);

          return (
            <div
              key={form.id}
              className="group grid grid-cols-[1fr_100px_100px_130px_80px_40px] items-center h-[52px] px-4 border-b border-border/50 hover:bg-[#FAF8F5] dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              onClick={function () {
                onOpenForm(form);
              }}
            >
              {/* Form Name & Avatar */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={
                    'w-7 h-7 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-2xs ' +
                    (isLive ? 'bg-[#0F172A] dark:bg-slate-800' : 'bg-slate-500 dark:bg-slate-700')
                  }
                >
                  {form.title.charAt(0).toUpperCase()}
                </div>
                <span className="text-[13px] font-medium text-foreground truncate">
                  {form.title}
                </span>
              </div>

              {/* Responses */}
              <span className="text-[11px] text-muted-foreground text-center font-mono">
                {responses || '-'}
              </span>

              {/* Completed */}
              <span className="text-[11px] text-muted-foreground text-center font-mono">
                {completed || '-'}
              </span>

              {/* Updated */}
              <span className="text-[11px] text-muted-foreground text-center font-mono">
                {formatDate(form.updatedAt)}
              </span>

              {/* Status */}
              <div className="flex justify-center">
                <Badge variant={isLive ? 'live' : 'draft'}>
                  {isLive ? 'Live' : 'Draft'}
                </Badge>
              </div>

              {/* More Actions Menu */}
              <div className="relative flex justify-center">
                <button
                  onClick={function (e) {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === form.id ? null : form.id);
                  }}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {openMenuId === form.id && (
                  <div className="absolute right-0 top-8 z-50 w-40 bg-card border border-border rounded-lg shadow-xl py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={function (e) {
                        e.stopPropagation();
                        onOpenForm(form);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={function (e) {
                        e.stopPropagation();
                        onOpenPreview(form);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button
                      onClick={function (e) {
                        e.stopPropagation();
                        handleDuplicateForm(form);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Duplicate
                    </button>
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={function (e) {
                        e.stopPropagation();
                        handleDeleteForm(form.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderGridView() {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredForms.map(function (form) {
          const isLive = form.status === 'live';

          return (
            <div
              key={form.id}
              onClick={function () {
                onOpenForm(form);
              }}
              className="group bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-lg cursor-pointer transition-all duration-200"
            >
              <div
                className={
                  'w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-3 ' +
                  (isLive ? 'bg-accent-route' : 'bg-muted-foreground')
                }
              >
                {form.title.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-[13px] font-medium text-foreground truncate mb-1">
                {form.title}
              </h3>
              <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2">
                {form.description || 'No description'}
              </p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <span>{formatDate(form.updatedAt)}</span>
                <Badge variant={isLive ? 'live' : 'draft'}>
                  {isLive ? 'Live' : 'Draft'}
                </Badge>
              </div>
            </div>
          );
        })}

        {/* Add new card button */}
        <button
          onClick={function () {
            setIsCreateModalOpen(true);
          }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 h-[160px] text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-accent/20 transition-all cursor-pointer"
        >
          <Plus className="w-6 h-6 mb-1.5" />
          <span className="text-xs font-medium">Create form</span>
        </button>
      </div>
    );
  }

  function renderFormsContent() {
    if (filteredForms.length === 0) {
      return renderEmptyState();
    }
    if (viewMode === 'list') {
      return renderListView();
    }
    return renderGridView();
  }

  // ==========================================
  // 5. MAIN COMPONENT RENDER
  // ==========================================
  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-sans select-none">
      {/* Top Header Bar */}
      <header className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-border bg-card">
        {/* Left avatar and account */}
        <div className="relative">
          <button
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-secondary/60 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F172A] dark:bg-slate-100 text-white dark:text-[#0F172A] flex items-center justify-center text-xs font-bold shadow-xs">
              {(currentUser.displayName || 'S').charAt(0).toUpperCase()}
            </div>
            <span className="text-[13px] font-medium text-foreground">
              {currentUser.displayName || 'My Account'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Account Dropdown Menu */}
          {isAccountMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
              <div className="px-2 py-1.5 border-b border-border/60">
                <p className="text-xs font-bold text-foreground truncate">
                  {currentUser.displayName || 'Demo Creator'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate font-mono">
                  {currentUser.email || 'demo@smartforms.dev'}
                </p>
              </div>

              <button
                onClick={() => {
                  clearStoredAuth();
                  setIsAccountMenuOpen(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    window.location.href = '/login';
                  }
                }}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>

        {/* Right action icons & Backend status */}
        <div className="flex items-center gap-2">
          <div
            className={
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all ' +
              (backendStatus.online
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400')
            }
          >
            <span
              className={
                'w-2 h-2 rounded-full ' +
                (backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')
              }
            />
            <span className="hidden md:inline font-medium">
              {backendStatus.message}
            </span>
          </div>

          {[
            { icon: Puzzle, label: 'Integrations' },
            { icon: Palette, label: 'Brand kit' },
            { icon: Settings, label: 'Settings' },
          ].map(function (item) {
            const IconComponent = item.icon;
            return (
              <button
                key={item.label}
                title={item.label}
                className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[#F5F6F1] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}

          <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white dark:bg-slate-100 dark:text-[#0F172A] flex items-center justify-center text-[10px] font-bold ml-1 shadow-xs">
            SR
          </div>
        </div>
      </header>

      {/* Sub-nav Tab Bar */}
      <div className="h-10 shrink-0 flex items-center gap-1 px-5 border-b border-border bg-background">
        {subTabs.map(function (tab) {
          const isActive = activeSubTab === tab.id;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={function () {
                setActiveSubTab(tab.id);
              }}
              className={
                'flex items-center gap-1.5 h-7 px-3 rounded-full text-xs transition-all duration-200 cursor-pointer ' +
                (isActive
                  ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-[#0F172A] shadow-2xs font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[#F5F6F1] dark:hover:bg-slate-800/80 font-semibold')
              }
            >
              <TabIcon
                className={
                  'w-3.5 h-3.5 ' +
                  (isActive ? 'text-white dark:text-[#0F172A]' : 'text-muted-foreground')
                }
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-60 shrink-0 flex flex-col border-r border-border bg-card">
          {/* Create Form Button */}
          <div className="p-3">
            <button
              onClick={function () {
                setIsCreateModalOpen(true);
              }}
              className="w-full h-9 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create form
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={function (e) {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search"
                className="w-full h-8 pl-8 pr-3 text-xs bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent-route/30 transition-all"
              />
            </div>
          </div>

          {/* Workspaces list */}
          <ScrollArea className="flex-1 px-2 py-1">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                Workspaces
              </span>
              <button className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div>
              <button
                onClick={function () {
                  setExpandedWorkspaces(function (prev) {
                    return { ...prev, private: !prev.private };
                  });
                }}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-foreground hover:bg-accent/50 rounded-md transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate">Private</span>
                {expandedWorkspaces.private ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
                )}
              </button>

              {expandedWorkspaces.private && (
                <button
                  onClick={function () {
                    setActiveWorkspace('my-workspace');
                  }}
                  className={
                    'w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer ' +
                    (activeWorkspace === 'my-workspace'
                      ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-[#0F172A] shadow-2xs font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/40 font-medium')
                  }
                >
                  <FolderOpen
                    className={
                      'w-3.5 h-3.5 shrink-0 ' +
                      (activeWorkspace === 'my-workspace'
                        ? 'text-white dark:text-[#0F172A]'
                        : 'text-muted-foreground')
                    }
                  />
                  <span className="truncate">My workspace</span>
                  <span
                    className={
                      'ml-auto text-[10px] rounded px-1.5 py-0.5 font-mono shrink-0 ' +
                      (activeWorkspace === 'my-workspace'
                        ? 'bg-white/20 text-white dark:bg-[#0F172A]/20 dark:text-[#0F172A]'
                        : 'bg-secondary text-muted-foreground')
                    }
                  >
                    {forms.length}
                  </span>
                </button>
              )}
            </div>
          </ScrollArea>

          {/* Usage Meter & AI prompt box */}
          <div className="border-t border-border p-3 space-y-3">
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-muted-foreground font-mono">
                Responses collected
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress
                    value={(responseCount / responseLimit) * 100}
                    className="h-1.5"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                  {responseCount} / {responseLimit}
                </span>
              </div>
              <button className="text-[11px] text-accent-route hover:text-accent-route/80 font-medium transition-colors cursor-pointer">
                Increase response limit
              </button>
            </div>

            <div className="relative">
              <Sparkles className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={aiInput}
                onChange={function (e) {
                  setAiInput(e.target.value);
                }}
                placeholder="Ask Smart Forms AI"
                className="w-full h-8 pl-8 pr-8 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent-route/30 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          <div className="shrink-0 flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-[28px] font-heading font-semibold text-foreground">
                My workspace
              </h1>
              <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                <Users className="w-3.5 h-3.5" />
                Invite
              </button>
            </div>

            {/* List / Grid View Switcher */}
            <div className="flex items-center gap-1 bg-secondary/60 rounded-lg p-0.5">
              <button
                onClick={function () {
                  setViewMode('list');
                }}
                className={
                  'flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ' +
                  (viewMode === 'list'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>
              <button
                onClick={function () {
                  setViewMode('grid');
                }}
                className={
                  'flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ' +
                  (viewMode === 'grid'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Grid
              </button>
            </div>
          </div>

          {/* Forms Section */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {activeSubTab === 'forms' ? (
              renderFormsContent()
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Settings className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <p className="text-[15px] font-semibold text-muted-foreground">
                  {activeSubTab === 'contacts' ? 'Contacts' : 'Automations'} — coming soon
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Backdrop overlay for closing action dropdown */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-40"
          onClick={function () {
            setOpenMenuId(null);
          }}
        />
      )}

      {/* Create Form Modal */}
      <CreateFormModal
        isOpen={isCreateModalOpen}
        onClose={function () {
          setIsCreateModalOpen(false);
        }}
        onFormCreated={handleFormCreated}
      />
    </div>
  );
}
