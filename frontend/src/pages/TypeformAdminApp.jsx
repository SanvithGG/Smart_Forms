import { useState, useEffect, useMemo, useCallback } from 'react';
import { saveFormToStorage } from '@/lib/formStore';
import { TypeformNavbar } from '@/components/typeform/TypeformNavbar';
import { TypeformShareView } from '@/components/typeform/TypeformShareView';
import { TypeformResultsView } from '@/components/typeform/TypeformResultsView';
import { TypeformWorkflowView } from '@/components/typeform/TypeformWorkflowView';
import { QuestionLogicModal } from '@/components/typeform/QuestionLogicModal';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Trash2,
  SlidersHorizontal,
  GitBranch,
  Laptop,
  Smartphone,
  ArrowRight,
  Type,
  ListOrdered,
  Star,
  Flag,
  X,
  Palette,
  Mic,
  Send,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Image,
  MoreVertical,
  Layers,
} from 'lucide-react';

/**
 * =====================================================================
 * SUB-COMPONENT 1: BuilderToolbar
 * =====================================================================
 * The top sub-bar inside the "Create" view.
 * Contains:
 * - "Add Content" button (opens the question picker modal)
 * - "Design" button
 * - "Desktop / Mobile" preview mode switcher toggle
 */
function BuilderToolbar({ onOpenAddModal, previewDevice, onTogglePreviewDevice }) {
  return (
    <div className="border-b border-border/60 bg-card px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 z-10">
      {/* Action buttons: Add Content & Design */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          onClick={onOpenAddModal}
          className="rounded-full bg-[#0F172A] dark:bg-slate-100 text-white dark:text-[#0F172A] hover:bg-[#1E293B] dark:hover:bg-slate-200 text-xs font-bold gap-1.5 h-8 px-3.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Add Content
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => alert('Opening Theme & Design System Panel...')}
          className="rounded-full border-border hover:bg-secondary text-xs font-semibold gap-1.5 h-8 px-3 cursor-pointer"
        >
          <Palette className="h-3.5 w-3.5 text-primary" /> Design
        </Button>
      </div>

      {/* Device switch: Desktop vs Mobile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePreviewDevice}
          className="flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/30 px-3 py-1 text-xs font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          {previewDevice === 'desktop' ? (
            <>
              <Laptop className="h-3.5 w-3.5 text-primary" /> Desktop Preview
            </>
          ) : (
            <>
              <Smartphone className="h-3.5 w-3.5 text-primary" /> Mobile Preview
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * =====================================================================
 * SUB-COMPONENT 2: SidebarPages
 * =====================================================================
 * The left sidebar showing the form structure:
 * - Universal mode dropdown pill
 * - Pages list (Welcome screen + each Question card)
 * - "Personalize with branching" shortcut banner
 * - Endings list (thank you screens) + Add Ending button
 */
function SidebarPages({
  welcomeScreen,
  nodeList,
  selectedPage,
  selectedNodeId,
  onSelectWelcomePage,
  onSelectQuestionPage,
  onDeleteQuestion,
  onOpenAddModal,
  onOpenLogicModal,
  endings,
  onAddEnding,
}) {
  return (
    <div className="w-56 lg:w-60 shrink-0 border-r border-border/60 bg-card p-3 flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden min-h-0 space-y-3">
        {/* Universal Mode Selector */}
        <div className="rounded-xl border border-border/80 bg-secondary/30 px-3 py-2 flex items-center justify-between text-xs font-bold text-foreground cursor-pointer hover:bg-secondary/60 transition-colors shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            <span>Universal mode</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Pages Section */}
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h2 className="text-sm font-bold text-foreground">Pages</h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-1.5 pb-4 space-y-2.5 min-h-0">
            {/* 1. Welcome Screen Card (if enabled) */}
            {welcomeScreen.enabled && (
              <div
                onClick={onSelectWelcomePage}
                className={`group relative flex items-center justify-between rounded-2xl border p-2.5 transition-all duration-200 cursor-pointer ${
                  selectedPage === 'welcome'
                    ? 'border-accent-route bg-accent-route/10 ring-1 ring-accent-route/30 shadow-xs'
                    : 'border-border/70 bg-secondary/20 hover:border-accent-route/50 hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-accent-branch/15 text-accent-branch border border-accent-branch/20 text-xs font-bold font-mono shrink-0">
                    <Sparkles className="h-3 w-3 text-accent-branch" />
                    <span>Start</span>
                  </div>
                  <span className="truncate text-xs font-medium text-foreground">
                    {welcomeScreen.title}
                  </span>
                </div>
                <MoreVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            )}

            {/* 2. Questions List */}
            {nodeList.map((node, index) => {
              const isSelected = selectedPage !== 'welcome' && selectedNodeId === node.id;

              return (
                <div key={node.id} className="space-y-1.5">
                  <div
                    onClick={() => onSelectQuestionPage(node.id)}
                    className={`group relative flex items-center justify-between rounded-2xl border p-2.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#6366F1] dark:border-[#818CF8] bg-[#EEF2FF] dark:bg-indigo-950/50 shadow-2xs font-bold'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-[#F1F5F9] dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EEF2FF] dark:bg-indigo-950/80 text-[#6366F1] dark:text-[#818CF8] border border-indigo-200 dark:border-indigo-800 text-xs font-bold font-mono shrink-0">
                        <span className="text-[10px]">A=</span>
                        <span>{index + 1}</span>
                      </div>
                      <span className="truncate text-xs font-semibold text-foreground">
                        {node.questionText}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {nodeList.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteQuestion(node.id);
                          }}
                          className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <MoreVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Add Content Quick Button under the first question */}
                  {index === 0 && (
                    <button
                      onClick={onOpenAddModal}
                      className="w-full py-1.5 px-3 rounded-xl border border-dashed border-border/80 bg-background hover:bg-secondary text-xs font-bold text-muted-foreground hover:text-primary flex items-center justify-center gap-1.5 transition-colors my-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add content
                    </button>
                  )}
                </div>
              );
            })}

            {/* 3. Personalize with Branching Button */}
            <div
              onClick={onOpenLogicModal}
              className="mt-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3 cursor-pointer hover:border-primary/40 hover:bg-primary/15 transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      Personalize with branching
                    </h4>
                    <p className="text-[10px] text-muted-foreground truncate">
                      Jump to questions based on answers
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Endings Section */}
        <div className="space-y-2.5 shrink-0 pt-3 border-t border-border/60 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Endings</h2>
            <button
              onClick={onAddEnding}
              className="h-7 w-7 rounded-xl border border-border/80 bg-card hover:bg-secondary flex items-center justify-center text-foreground font-bold shadow-2xs transition-colors cursor-pointer"
              title="Add Ending Screen"
            >
              <Plus className="h-4 w-4 text-foreground" />
            </button>
          </div>

          <div className="space-y-2">
            {endings.map((ending, index) => (
              <div
                key={ending.id}
                className="flex items-center justify-between rounded-2xl border border-border/80 bg-secondary/20 p-2.5 text-xs font-medium text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-muted/60 text-muted-foreground font-mono text-xs font-bold border border-border/40 shrink-0">
                    <Layers className="h-3 w-3" />
                    <span>{String.fromCharCode(65 + index)}</span>
                  </div>
                  <span className="truncate text-xs font-medium text-foreground">
                    {ending.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * =====================================================================
 * SUB-COMPONENT 3: CanvasPreview
 * =====================================================================
 * The middle canvas displaying a live interactive preview of:
 * - Either the Welcome Screen (title, subtitle, start button)
 * - Or the Active Question Card (question text, options, OK button)
 */
function CanvasPreview({
  selectedPage,
  welcomeScreen,
  activeNode,
  nodeList,
  previewDevice,
  onStartFromWelcome,
  onOptionClick,
  onAddOption,
  onConfirmAnswer,
}) {
  const isMobile = previewDevice === 'mobile';
  const containerClasses = isMobile
    ? 'w-[360px] h-[580px] border border-border/20'
    : 'w-full max-w-2xl min-h-[460px]';

  // 1. If currently viewing Welcome Screen
  if (selectedPage === 'welcome') {
    return (
      <div
        className={`transition-all duration-300 rounded-3xl border-transparent bg-transparent shadow-none p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 ${
          isMobile ? 'w-[360px] h-[580px] border border-border/20' : 'w-full max-w-2xl min-h-[400px]'
        }`}
      >
        <div className="space-y-3 max-w-lg">
          <span className="rounded-full bg-primary/10 text-primary px-3.5 py-1 text-xs font-bold uppercase tracking-wider border border-primary/20 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Welcome Screen
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground font-serif leading-tight">
            {welcomeScreen.title}
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {welcomeScreen.subtitle}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            size="lg"
            onClick={onStartFromWelcome}
            className="rounded-full bg-[#0F172A] dark:bg-slate-100 text-white dark:text-[#0F172A] hover:bg-[#1E293B] dark:hover:bg-slate-200 text-sm font-bold px-8 h-12 shadow-lg gap-2 cursor-pointer transition-colors"
          >
            {welcomeScreen.buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="text-xs text-muted-foreground font-mono">
            ⏱ {welcomeScreen.timeToComplete}
          </p>
        </div>
      </div>
    );
  }

  // 2. Otherwise viewing Question Preview Card
  const questionNumber = nodeList.indexOf(activeNode) + 1;

  return (
    <div
      className={`transition-all duration-300 rounded-2xl border-transparent bg-transparent shadow-none p-8 sm:p-12 flex flex-col justify-between ${containerClasses}`}
    >
      <div className="space-y-6">
        {/* Question Header */}
        <div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-background font-mono text-xs font-bold shrink-0 mt-0.5 shadow-2xs">
              {questionNumber}
            </span>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-sans tracking-tight leading-snug">
                {activeNode.questionText}
              </h2>
              <p className="text-xs text-muted-foreground italic font-sans">
                Description (optional)
              </p>
            </div>
          </div>
        </div>

        {/* Choice Options List */}
        <div className="space-y-2.5 pt-2">
          {activeNode.options.length > 0 ? (
            <>
              <div className="space-y-2 max-w-md">
                {activeNode.options.map((option, index) => (
                  <div
                    key={option.id || index}
                    onClick={() => onOptionClick(option)}
                    className="group flex items-center justify-between rounded-xl border border-border bg-secondary/70 hover:bg-secondary hover:border-accent-route/50 hover:shadow-sm px-3.5 py-2.5 text-xs font-medium text-foreground transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-background text-foreground border border-border/40 font-mono text-[10px] font-bold shrink-0 shadow-2xs">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="truncate">{option.optionText}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={onAddOption}
                  className="text-xs font-medium text-muted-foreground hover:text-primary underline cursor-pointer transition-colors"
                >
                  Add choice
                </button>
              </div>
            </>
          ) : (
            <input
              type="text"
              disabled
              placeholder="User types response here..."
              className="w-full max-w-md rounded-xl border border-border/40 bg-secondary/30 p-3 text-xs font-medium text-muted-foreground"
            />
          )}
        </div>
      </div>

      {/* Bottom Action Row with Keyboard Hint and OK Button */}
      <div className="flex items-center justify-between pt-6 border-t border-border/30">
        <span className="text-[11px] text-muted-foreground font-mono">
          Press{' '}
          <kbd className="rounded bg-secondary px-1.5 py-0.5 border text-foreground font-bold">
            A, B, C, D
          </kbd>{' '}
          to select
        </span>
        <Button
          size="sm"
          onClick={onConfirmAnswer}
          className="rounded-full bg-black hover:bg-neutral-900 text-white text-xs font-bold px-6 shadow-xs cursor-pointer"
        >
          OK ↵
        </Button>
      </div>
    </div>
  );
}

/**
 * =====================================================================
 * SUB-COMPONENT 4: FloatingAiBar
 * =====================================================================
 * The bottom floating input pill allowing AI prompt submission.
 */
function FloatingAiBar({ chatInput, onChatInputChange, onSubmit, onOpenAiChat }) {
  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-card/95 backdrop-blur-md border border-border/80 rounded-full shadow-2xl p-1.5 pl-4 flex items-center justify-between gap-2 z-20">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Sparkles className="h-4 w-4 text-primary shrink-0 animate-pulse" />
        <input
          type="text"
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit(e);
            }
          }}
          placeholder="Chat to create or edit question..."
          className="w-full bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onOpenAiChat}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          title="Voice Input"
        >
          <Mic className="h-3.5 w-3.5" />
        </button>
        <Button
          size="sm"
          onClick={onOpenAiChat}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-7 w-7 p-0 flex items-center justify-center shadow-xs cursor-pointer"
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

/**
 * =====================================================================
 * SUB-COMPONENT 5: InspectorPanel
 * =====================================================================
 * The right side inspector panel for editing details:
 * - If selectedPage === 'welcome': displays Welcome Screen settings
 * - If question selected: displays tabs for "Question" settings & "Logic Jumps"
 */
function InspectorPanel({
  selectedPage,
  welcomeScreen,
  onUpdateWelcomeScreen,
  inspectorTab,
  onSelectInspectorTab,
  activeNode,
  onUpdateQuestionText,
  showImageSection,
  onToggleImageSection,
  onOpenLogicModal,
  onUpdateOptionText,
  onUpdateOptionNext,
  onAddOption,
  onDeleteOption,
  nodeSettings,
  onToggleSetting,
  nodeList,
}) {
  // If the user selected the Welcome Screen in sidebar
  if (selectedPage === 'welcome') {
    return (
      <div className="w-72 lg:w-80 shrink-0 border-l border-border/60 bg-card p-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-5">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Welcome Screen Settings
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">
              Configure the title, instructions, and start button for respondents.
            </p>
          </div>

          {/* Enable / Disable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-secondary/15">
            <div className="space-y-0.5">
              <label
                className="text-xs font-bold text-foreground cursor-pointer"
                htmlFor="toggle-welcome"
              >
                Enable Welcome Screen
              </label>
              <p className="text-[10px] text-muted-foreground">
                Show a landing screen before starting
              </p>
            </div>
            <Switch
              id="toggle-welcome"
              checked={welcomeScreen.enabled}
              onCheckedChange={(val) =>
                onUpdateWelcomeScreen({ enabled: val })
              }
            />
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Welcome Title
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                {welcomeScreen.title.length}/100
              </span>
            </div>
            <input
              type="text"
              maxLength={100}
              value={welcomeScreen.title}
              onChange={(e) => onUpdateWelcomeScreen({ title: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Subtitle Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description / Subtitle
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                {welcomeScreen.subtitle.length}/500
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={welcomeScreen.subtitle}
              onChange={(e) => onUpdateWelcomeScreen({ subtitle: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Button Label */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Button Label
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                {welcomeScreen.buttonText.length}/30
              </span>
            </div>
            <input
              type="text"
              maxLength={30}
              value={welcomeScreen.buttonText}
              onChange={(e) => onUpdateWelcomeScreen({ buttonText: e.target.value })}
              placeholder="e.g. Start Application"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Estimated Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Estimated Time
            </label>
            <input
              type="text"
              value={welcomeScreen.timeToComplete}
              onChange={(e) => onUpdateWelcomeScreen({ timeToComplete: e.target.value })}
              placeholder="e.g. Takes 2 minutes"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>
    );
  }

  // Otherwise a Question is selected
  return (
    <div className="w-72 lg:w-80 shrink-0 border-l border-border/60 bg-card p-4 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-5">
        {/* Inspector Sub-Tabs: Question vs Logic */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/40 p-1">
          <button
            onClick={() => onSelectInspectorTab('question')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
              inspectorTab === 'question'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Question
          </button>
          <button
            onClick={() => onSelectInspectorTab('logic')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
              inspectorTab === 'logic'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5 text-primary" /> Logic Jumps
          </button>
        </div>

        {/* 1. QUESTION TAB */}
        {inspectorTab === 'question' && (
          <div className="space-y-5">
            {/* Question Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Question Title
                </label>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {activeNode.questionText.length}/120
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={120}
                value={activeNode.questionText}
                onChange={(e) => onUpdateQuestionText(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground font-serif focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Media Upload Collapsible Section */}
            <div className="rounded-xl border border-border/80 bg-secondary/20 overflow-hidden">
              <button
                onClick={onToggleImageSection}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Image className="h-3.5 w-3.5 text-primary" />
                  <span>Image or video</span>
                </div>
                <Plus
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                    showImageSection ? 'rotate-45' : ''
                  }`}
                />
              </button>
              {showImageSection && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-border/40 space-y-2">
                  <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground hover:border-primary/50 cursor-pointer transition-colors">
                    <Image className="h-6 w-6 mx-auto mb-1 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground">
                      Upload image or video
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      PNG, JPG, MP4 up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Branching Logic Shortcut Button */}
            <div className="rounded-xl border border-border/80 bg-secondary/20 overflow-hidden">
              <button
                onClick={onOpenLogicModal}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <GitBranch className="h-3.5 w-3.5 text-primary" />
                  <span>Logic</span>
                </div>
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Choice Options List */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Choice Options
                </label>
                <button
                  onClick={onAddOption}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" /> Add Choice
                </button>
              </div>
              {activeNode.options.map((option, index) => (
                <div key={option.id || index} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary font-mono text-[10px] font-bold border border-border">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    type="text"
                    value={option.optionText}
                    onChange={(e) => onUpdateOptionText(index, e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                  />
                  {activeNode.options.length > 1 && (
                    <button
                      onClick={() => onDeleteOption(index)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete Choice"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Toggle Settings */}
            <div className="space-y-4 pt-4 border-t border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Question settings
              </h4>

              <div className="rounded-xl border border-border bg-secondary/30 px-3 py-2 flex items-center justify-between text-xs font-bold text-foreground">
                <span>A= Multiple Choice</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-foreground pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Required</span>
                  <Switch
                    checked={nodeSettings[activeNode.id]?.required || false}
                    onCheckedChange={(val) => onToggleSetting('required', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Multiple selection</span>
                  <Switch
                    checked={nodeSettings[activeNode.id]?.multipleSelection || false}
                    onCheckedChange={(val) => onToggleSetting('multipleSelection', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Randomize</span>
                  <Switch
                    checked={nodeSettings[activeNode.id]?.randomize || false}
                    onCheckedChange={(val) => onToggleSetting('randomize', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">"Other" option</span>
                  <Switch
                    checked={nodeSettings[activeNode.id]?.otherOption || false}
                    onCheckedChange={(val) => onToggleSetting('otherOption', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">"None" option</span>
                  <Switch
                    checked={nodeSettings[activeNode.id]?.noneOption || false}
                    onCheckedChange={(val) => onToggleSetting('noneOption', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Vertical alignment</span>
                  <Switch
                    checked={nodeSettings[activeNode.id]?.verticalAlignment ?? true}
                    onCheckedChange={(val) => onToggleSetting('verticalAlignment', val)}
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-muted-foreground">Map to contacts</span>
                  <Switch
                    checked={nodeSettings[activeNode.id]?.mapToContacts || false}
                    onCheckedChange={(val) => onToggleSetting('mapToContacts', val)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. LOGIC JUMPS TAB */}
        {inspectorTab === 'logic' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-primary" /> Branching Logic Rules
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Configure logic jumps based on respondent choices.
              </p>
            </div>

            {activeNode.options.map((option, index) => (
              <div
                key={option.id || index}
                className="rounded-xl border border-border bg-secondary/30 p-3 space-y-2 text-xs"
              >
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-card border font-mono text-[10px] font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  IF choice is "{option.optionText}"
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                  <select
                    value={option.nextQuestionId || ''}
                    onChange={(e) => onUpdateOptionNext(index, e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">🏁 End Survey (Complete)</option>
                    {nodeList.map((targetNode) => (
                      <option key={targetNode.id} value={targetNode.id}>
                        {targetNode.questionText.slice(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * =====================================================================
 * SUB-COMPONENT 6: AddQuestionModal
 * =====================================================================
 * Dialog popup offering 4 question types to add:
 * Multiple Choice, Short Text, Rating Scale, or End Screen.
 */
function AddQuestionModal({ isOpen, onClose, onSelectType }) {
  if (!isOpen) return null;

  const questionTypes = [
    { type: 'mcq', label: 'Multiple Choice', icon: ListOrdered, desc: '4-choice card options' },
    { type: 'text', label: 'Short Text', icon: Type, desc: 'Open text response' },
    { type: 'rating', label: 'Rating Scale', icon: Star, desc: '1 to 5 star rating' },
    { type: 'end', label: 'End Screen', icon: Flag, desc: 'Custom thank you node' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h3 className="text-base font-bold text-foreground font-sans">
            Select Question Block Type
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {questionTypes.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => onSelectType(item.type)}
                className="flex flex-col items-start p-4 rounded-2xl border border-border bg-secondary/20 hover:border-primary hover:bg-primary/5 text-left transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold group-hover:scale-105 transition-transform">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground font-sans">{item.label}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * =====================================================================
 * MAIN COMPONENT: TypeformAdminApp
 * =====================================================================
 * Main orchestrator for the Typeform Builder.
 * Manages all form state, question node navigation, auto-saving,
 * and renders the 4 main tabs: Create, Workflow, Share, and Results.
 */
export function TypeformAdminApp({
  initialForm,
  onOpenPreview,
  onOpenAiChat,
  onBackToWorkspace,
}) {
  // ==========================================
  // 1. STATE VARIABLES
  // ==========================================

  // The complete form object with all question nodes
  const [form, setForm] = useState(initialForm);

  // The ID of the currently selected question (e.g. 'q1')
  const [selectedNodeId, setSelectedNodeId] = useState(() => {
    if (initialForm.startQuestionId) {
      return initialForm.startQuestionId;
    }
    const firstKey = Object.keys(initialForm.nodes)[0];
    return firstKey || 'q1';
  });

  // Top navigation tabs: 'create', 'workflow', 'share', 'results'
  const [activeTab, setActiveTab] = useState('create');

  // Currently selected page in the left sidebar ('welcome' or question ID)
  const [selectedPage, setSelectedPage] = useState('welcome');

  // Settings for the welcome splash screen
  const [welcomeScreen, setWelcomeScreen] = useState({
    enabled: initialForm.welcomeScreen?.enabled ?? true,
    title: initialForm.welcomeScreen?.title || `Welcome to ${initialForm.title}`,
    subtitle:
      initialForm.welcomeScreen?.subtitle ||
      'We appreciate your interest in joining our team. Please provide accurate details to help us evaluate your response.',
    buttonText: initialForm.welcomeScreen?.buttonText || 'Start Application',
    timeToComplete: initialForm.welcomeScreen?.timeToComplete || 'Takes 2 minutes',
  });

  // Right inspector sub-tab: 'question' or 'logic'
  const [inspectorTab, setInspectorTab] = useState('question');

  // Canvas preview device mode: 'desktop' or 'mobile'
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Add Question modal visibility
  const [showAddModal, setShowAddModal] = useState(false);

  // Floating AI input bar text
  const [chatInput, setChatInput] = useState('');

  // Form published status
  const [isPublished, setIsPublished] = useState(initialForm.status === 'live');

  // Logic jump modal state
  const [isLogicModalOpen, setIsLogicModalOpen] = useState(false);
  const [logicModalQuestionId, setLogicModalQuestionId] = useState('q1');

  // Image upload section toggle inside the inspector
  const [showImageSection, setShowImageSection] = useState(false);

  // Question settings toggles (required, multiple selection, etc.)
  const [nodeSettings, setNodeSettings] = useState({
    q1: { verticalAlignment: true, required: true },
  });

  // Endings screens (thank-you pages)
  const [endings, setEndings] = useState([
    {
      id: 'end_default',
      title: 'Thank you for completing the survey! 🏁',
      subtitle: 'Your responses have been recorded securely.',
      buttonText: 'Submit Another Response',
    },
  ]);

  // ==========================================
  // 2. COMPUTED VALUES & EFFECTS
  // ==========================================

  // Array of all questions in the form
  const nodeList = Object.values(form.nodes);

  // Find the currently active question object
  const activeNode = useMemo(() => {
    if (form.nodes[selectedNodeId]) {
      return form.nodes[selectedNodeId];
    }
    if (nodeList[0]) {
      return nodeList[0];
    }
    return {
      id: 'q1',
      questionText: 'Default Question',
      level: 1,
      options: [],
    };
  }, [form.nodes, selectedNodeId, nodeList]);

  // Synchronize when the initialForm prop updates
  useEffect(() => {
    setForm(initialForm);
    if (initialForm.welcomeScreen) {
      setWelcomeScreen({
        enabled: initialForm.welcomeScreen.enabled ?? true,
        title: initialForm.welcomeScreen.title,
        subtitle: initialForm.welcomeScreen.subtitle,
        buttonText: initialForm.welcomeScreen.buttonText,
        timeToComplete: initialForm.welcomeScreen.timeToComplete || 'Takes 2 minutes',
      });
    }
  }, [initialForm]);

  // Automatically save form changes to local storage
  useEffect(() => {
    const fullFormData = {
      ...form,
      welcomeScreen,
    };
    saveFormToStorage(fullFormData);
  }, [form, welcomeScreen]);

  // ==========================================
  // 3. ACTION HANDLERS
  // ==========================================

  // Helper to update properties on the currently active question
  function updateActiveNode(changes) {
    setForm((previousForm) => {
      const currentNode = previousForm.nodes[activeNode.id];
      const updatedNode = {
        ...currentNode,
        ...changes,
      };

      return {
        ...previousForm,
        nodes: {
          ...previousForm.nodes,
          [activeNode.id]: updatedNode,
        },
      };
    });
  }

  // Handle jumping to next question when clicking an option
  const handleOptionClick = useCallback(
    (option) => {
      let targetId = option.nextQuestionId;

      // If no explicit logic jump target is set, advance to the next sequential question
      if (!targetId || !form.nodes[targetId]) {
        const currentIndex = nodeList.findIndex((node) => node.id === activeNode.id);
        if (currentIndex >= 0 && currentIndex < nodeList.length - 1) {
          targetId = nodeList[currentIndex + 1].id;
        }
      }

      if (targetId && form.nodes[targetId]) {
        setSelectedNodeId(targetId);
      }
    },
    [activeNode.id, form.nodes, nodeList]
  );

  // Listen to keyboard shortcuts (A, B, C, D, Enter) for fast test-answering
  useEffect(() => {
    if (activeTab !== 'create') {
      return;
    }

    function handleKeyDown(event) {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.isContentEditable);

      if (isTyping) {
        return;
      }

      const key = event.key.toLowerCase();
      const options = activeNode?.options || [];

      if (key === 'a' && options[0]) {
        handleOptionClick(options[0]);
      } else if (key === 'b' && options[1]) {
        handleOptionClick(options[1]);
      } else if (key === 'c' && options[2]) {
        handleOptionClick(options[2]);
      } else if (key === 'd' && options[3]) {
        handleOptionClick(options[3]);
      } else if (key === 'enter') {
        if (options[0]) {
          handleOptionClick(options[0]);
        } else {
          const currentIndex = nodeList.findIndex((node) => node.id === activeNode.id);
          if (currentIndex >= 0 && currentIndex < nodeList.length - 1) {
            setSelectedNodeId(nodeList[currentIndex + 1].id);
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, activeNode, form.nodes, nodeList, handleOptionClick]);

  // Mark form as published
  function handlePublish() {
    setIsPublished(true);
    setForm((previous) => ({ ...previous, status: 'live' }));
  }

  // Update question text for the active node
  function handleUpdateQuestionText(newText) {
    updateActiveNode({ questionText: newText });
  }

  // Update choice text for an option
  function handleUpdateOptionText(optionIndex, newText) {
    const updatedOptions = [...activeNode.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      optionText: newText,
    };
    updateActiveNode({ options: updatedOptions });
  }

  // Update the destination question when a respondent picks an option
  function handleUpdateOptionNext(optionIndex, nextId) {
    const updatedOptions = [...activeNode.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      nextQuestionId: nextId === '' ? null : nextId,
    };
    updateActiveNode({ options: updatedOptions });
  }

  // Add a new option choice to the active question
  function handleAddOption() {
    const newNumber = activeNode.options.length + 1;
    const newOptionId = `opt_${activeNode.id}_${newNumber}`;
    const newOption = {
      id: newOptionId,
      optionText: `New Option ${newNumber}`,
      nextQuestionId: null,
    };
    const updatedOptions = [...activeNode.options, newOption];
    updateActiveNode({ options: updatedOptions });
  }

  // Delete an option by index
  function handleDeleteOption(optionIndex) {
    const updatedOptions = activeNode.options.filter((_, index) => index !== optionIndex);
    updateActiveNode({ options: updatedOptions });
  }

  // Delete an entire question node
  function handleDeleteNode(nodeIdToDelete) {
    if (nodeList.length <= 1) {
      return; // Keep at least 1 question
    }

    const updatedNodes = { ...form.nodes };
    delete updatedNodes[nodeIdToDelete];

    setForm((previous) => ({
      ...previous,
      nodes: updatedNodes,
    }));

    // Select the first remaining question
    const remainingKeys = Object.keys(updatedNodes);
    setSelectedNodeId(remainingKeys[0]);
  }

  // Add a new custom ending screen
  function handleAddEnding() {
    const newEndId = `end_${Date.now().toString().slice(-4)}`;
    const newEnding = {
      id: newEndId,
      title: 'Custom Ending Screen 🏁',
      subtitle: 'Thank you for participating.',
      buttonText: 'Finish',
    };
    setEndings((prev) => [...prev, newEnding]);
  }

  // Add a new question block of specified type
  function handleAddQuestion(type) {
    const newId = `q_${Date.now().toString().slice(-4)}`;
    let questionText = 'New Question Title';
    let options = [
      { id: `opt_${newId}_1`, optionText: 'Option A', nextQuestionId: null },
      { id: `opt_${newId}_2`, optionText: 'Option B', nextQuestionId: null },
    ];

    if (type === 'text') {
      questionText = 'What is your primary feedback or goal?';
      options = [];
    } else if (type === 'rating') {
      questionText = 'How would you rate your experience?';
      options = [
        { id: `opt_${newId}_1`, optionText: '1 - Needs Improvement', nextQuestionId: null },
        { id: `opt_${newId}_2`, optionText: '3 - Neutral', nextQuestionId: null },
        { id: `opt_${newId}_3`, optionText: '5 - Excellent', nextQuestionId: null },
      ];
    } else if (type === 'end') {
      handleAddEnding();
      setShowAddModal(false);
      return;
    }

    const newNode = {
      id: newId,
      questionText,
      level: nodeList.length + 1,
      options,
    };

    setForm((previous) => ({
      ...previous,
      nodes: {
        ...previous.nodes,
        [newId]: newNode,
      },
    }));

    setSelectedNodeId(newId);
    setShowAddModal(false);
  }

  // Handle submitting a prompt from the bottom floating AI bar
  function handleFloatingAiSubmit(event) {
    event.preventDefault();
    if (!chatInput.trim()) {
      return;
    }

    if (onOpenAiChat) {
      onOpenAiChat();
      return;
    }

    const query = chatInput.toLowerCase();
    if (query.includes('rating') || query.includes('star')) {
      handleAddQuestion('rating');
    } else if (query.includes('text') || query.includes('open')) {
      handleAddQuestion('text');
    } else if (query.includes('ending') || query.includes('thank')) {
      handleAddEnding();
    } else {
      handleAddQuestion('mcq');
    }

    setChatInput('');
  }

  // Update individual toggle setting for a question
  function handleToggleSetting(settingName, value) {
    setNodeSettings((previous) => {
      const currentSetting = previous[activeNode.id] || {};
      return {
        ...previous,
        [activeNode.id]: {
          ...currentSetting,
          [settingName]: value,
        },
      };
    });
  }

  // Advance on clicking OK button in the center canvas
  function handleConfirmAnswer() {
    const firstOption = activeNode.options[0];
    if (firstOption) {
      handleOptionClick(firstOption);
    } else {
      const currentIndex = nodeList.findIndex((node) => node.id === activeNode.id);
      if (currentIndex >= 0 && currentIndex < nodeList.length - 1) {
        setSelectedNodeId(nodeList[currentIndex + 1].id);
      }
    }
  }

  // ==========================================
  // 4. MAIN RENDER
  // ==========================================
  return (
    <div className="h-screen max-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground overflow-hidden">
      {/* Top Navigation Bar */}
      <TypeformNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formTitle={form.title}
        onTitleChange={(newTitle) => {
          setForm((prev) => ({ ...prev, title: newTitle }));
        }}
        onOpenAiChat={onOpenAiChat}
        onOpenPreview={() => {
          onOpenPreview({ ...form, welcomeScreen });
        }}
        isPublished={isPublished}
        onPublish={handlePublish}
        onBackToWorkspace={onBackToWorkspace}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        {/* Share and Results views */}
        {activeTab === 'share' && <TypeformShareView />}
        {activeTab === 'results' && <TypeformResultsView />}

        {/* Workflow Graph View */}
        {activeTab === 'workflow' && (
          <TypeformWorkflowView
            form={form}
            onUpdateForm={setForm}
            onSelectNodeForEdit={(nodeId) => {
              setSelectedNodeId(nodeId);
              setSelectedPage(nodeId);
              setActiveTab('create');
            }}
          />
        )}

        {/* Builder View (Create tab) */}
        {activeTab === 'create' && (
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            {/* Top Toolbar */}
            <BuilderToolbar
              onOpenAddModal={() => setShowAddModal(true)}
              previewDevice={previewDevice}
              onTogglePreviewDevice={() => {
                setPreviewDevice((prev) => (prev === 'desktop' ? 'mobile' : 'desktop'));
              }}
            />

            {/* 3-Column Studio Workspace */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* 1. Left Sidebar: Pages & Endings */}
              <SidebarPages
                welcomeScreen={welcomeScreen}
                nodeList={nodeList}
                selectedPage={selectedPage}
                selectedNodeId={selectedNodeId}
                onSelectWelcomePage={() => setSelectedPage('welcome')}
                onSelectQuestionPage={(nodeId) => {
                  setSelectedPage(nodeId);
                  setSelectedNodeId(nodeId);
                }}
                onDeleteQuestion={handleDeleteNode}
                onOpenAddModal={() => setShowAddModal(true)}
                onOpenLogicModal={() => {
                  setLogicModalQuestionId(selectedNodeId || 'q1');
                  setIsLogicModalOpen(true);
                }}
                endings={endings}
                onAddEnding={handleAddEnding}
              />

              {/* 2. Center Canvas: Interactive Live Preview */}
              <div className="flex-1 min-w-0 bg-background p-6 flex flex-col items-center justify-start overflow-y-auto relative pt-6 pb-12">
                <CanvasPreview
                  selectedPage={selectedPage}
                  welcomeScreen={welcomeScreen}
                  activeNode={activeNode}
                  nodeList={nodeList}
                  previewDevice={previewDevice}
                  onStartFromWelcome={() => {
                    if (nodeList[0]) {
                      setSelectedPage(nodeList[0].id);
                      setSelectedNodeId(nodeList[0].id);
                    }
                  }}
                  onOptionClick={handleOptionClick}
                  onAddOption={handleAddOption}
                  onConfirmAnswer={handleConfirmAnswer}
                />

                {/* Floating Centered AI Input Bar */}
                <FloatingAiBar
                  chatInput={chatInput}
                  onChatInputChange={setChatInput}
                  onSubmit={handleFloatingAiSubmit}
                  onOpenAiChat={onOpenAiChat}
                />
              </div>

              {/* 3. Right Inspector Panel */}
              <InspectorPanel
                selectedPage={selectedPage}
                welcomeScreen={welcomeScreen}
                onUpdateWelcomeScreen={(changes) => {
                  setWelcomeScreen((prev) => ({ ...prev, ...changes }));
                }}
                inspectorTab={inspectorTab}
                onSelectInspectorTab={setInspectorTab}
                activeNode={activeNode}
                onUpdateQuestionText={handleUpdateQuestionText}
                showImageSection={showImageSection}
                onToggleImageSection={() => setShowImageSection((prev) => !prev)}
                onOpenLogicModal={() => {
                  setLogicModalQuestionId(activeNode.id);
                  setIsLogicModalOpen(true);
                }}
                onUpdateOptionText={handleUpdateOptionText}
                onUpdateOptionNext={handleUpdateOptionNext}
                onAddOption={handleAddOption}
                onDeleteOption={handleDeleteOption}
                nodeSettings={nodeSettings}
                onToggleSetting={handleToggleSetting}
                nodeList={nodeList}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectType={handleAddQuestion}
      />

      {/* Logic Jump Modal */}
      <QuestionLogicModal
        isOpen={isLogicModalOpen}
        onClose={() => setIsLogicModalOpen(false)}
        form={form}
        initialQuestionId={logicModalQuestionId}
        onSave={(updatedForm) => setForm(updatedForm)}
      />
    </div>
  );
}
