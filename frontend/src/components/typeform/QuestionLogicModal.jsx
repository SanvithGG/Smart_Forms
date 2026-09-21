import React, { useState, useEffect } from 'react';
import { X, Trash2, ChevronDown, EyeOff, GitBranch, Calculator, HelpCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateQuestionLogic, clearAllFormLogic } from '@/lib/formStore';
function LogicRuleRow({ icon: Icon, label, infoTooltip, rulesCount = 0, isExpanded, onToggle, children, }) {
    const [showTooltip, setShowTooltip] = useState(false);
    return (<div className="rounded-xl border border-border/80 bg-secondary/20 overflow-hidden transition-all">
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4"/>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">{label}</span>
            
            {/* Info Icon with Tooltip */}
            <div className="relative inline-block">
              <button type="button" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(!showTooltip);
        }} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                <HelpCircle className="h-3.5 w-3.5"/>
              </button>
              {showTooltip && (<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-56 p-2 bg-popover text-popover-foreground text-[11px] rounded-lg border border-border shadow-lg z-50 pointer-events-none">
                  {infoTooltip}
                </div>)}
            </div>

            {/* Active Rules Badge */}
            {rulesCount > 0 && (<span className="rounded-full bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 text-[10px] font-bold font-mono">
                {rulesCount} {rulesCount === 1 ? 'rule set' : 'rules set'}
              </span>)}
          </div>
        </div>

        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180 text-foreground' : ''}`}/>
      </button>

      {isExpanded && (<div className="px-4 pb-4 pt-1 border-t border-border/40 bg-card/40 animate-in fade-in duration-150 space-y-3">
          {children}
        </div>)}
    </div>);
}
export function QuestionLogicModal({ isOpen, onClose, form, initialQuestionId, onSave, }) {
    const nodeList = Object.values(form.nodes);
    const [selectedQuestionId, setSelectedQuestionId] = useState(initialQuestionId || nodeList[0]?.id || 'q1');
    const [expandedRows, setExpandedRows] = useState({
        hide: false,
        branching: true, // Default open branching
        calculations: false,
    });
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    // Local rule state for selected question
    const selectedNode = form.nodes[selectedQuestionId] || nodeList[0];
    const [hiddenChoices, setHiddenChoices] = useState([]);
    const [branchingRules, setBranchingRules] = useState({});
    const [calculations, setCalculations] = useState({});
    // Sync selected question state when selection changes or modal opens
    useEffect(() => {
        if (selectedNode) {
            setHiddenChoices(selectedNode.logic?.hiddenChoices || []);
            // Initialize branching rules from existing node options / logic
            const initialBranching = {};
            selectedNode.options.forEach((opt) => {
                initialBranching[opt.id] = opt.nextQuestionId ?? null;
            });
            if (selectedNode.logic?.branchingRules) {
                Object.assign(initialBranching, selectedNode.logic.branchingRules);
            }
            setBranchingRules(initialBranching);
            setCalculations(selectedNode.logic?.calculations || {});
            setIsDirty(false);
        }
    }, [selectedQuestionId, form, selectedNode]);
    if (!isOpen)
        return null;
    // Helper to count active rules for a node
    const getNodeRulesCount = (node) => {
        let count = 0;
        // Count branching links
        node.options.forEach((opt) => {
            if (opt.nextQuestionId !== undefined && opt.nextQuestionId !== null) {
                count++;
            }
        });
        if (node.logic?.hiddenChoices?.length) {
            count += node.logic.hiddenChoices.length;
        }
        if (node.logic?.calculations) {
            count += Object.keys(node.logic.calculations).length;
        }
        return count;
    };
    const handleToggleHideChoice = (optionId) => {
        setHiddenChoices((prev) => {
            const next = prev.includes(optionId)
                ? prev.filter((id) => id !== optionId)
                : [...prev, optionId];
            setIsDirty(true);
            return next;
        });
    };
    const handleUpdateBranching = (optionId, targetId) => {
        setBranchingRules((prev) => {
            const next = { ...prev, [optionId]: targetId || null };
            setIsDirty(true);
            return next;
        });
    };
    const handleUpdateCalculation = (optionId, val) => {
        setCalculations((prev) => {
            const next = { ...prev, [optionId]: val };
            setIsDirty(true);
            return next;
        });
    };
    const handleSave = () => {
        const updatedForm = updateQuestionLogic(form.id, selectedQuestionId, {
            hiddenChoices,
            branchingRules,
            calculations,
        });
        setIsDirty(false);
        if (onSave)
            onSave(updatedForm);
        onClose();
    };
    const handleDeleteAllRules = () => {
        const updatedForm = clearAllFormLogic(form.id);
        setConfirmDeleteAll(false);
        setIsDirty(false);
        if (onSave)
            onSave(updatedForm);
    };
    const currentBranchingRulesCount = Object.values(branchingRules).filter((val) => val !== null && val !== '').length;
    const currentHiddenCount = hiddenChoices.length;
    const currentCalcCount = Object.values(calculations).filter((val) => val !== 0).length;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[750px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden font-sans select-none">
        
        {/* ================= LEFT COLUMN (~280px) ================= */}
        <div className="w-full md:w-72 shrink-0 border-r border-border bg-secondary/30 flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border/60">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary"/> Logic
            </h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Set rules to control how respondents view or progress through your form.
            </p>
          </div>

          {/* Question List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {nodeList.map((node, idx) => {
            const isSelected = node.id === selectedQuestionId;
            const rulesCount = getNodeRulesCount(node);
            return (<div key={node.id} onClick={() => setSelectedQuestionId(node.id)} className={`group flex flex-col p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                    ? 'bg-card border-accent-route ring-1 ring-accent-route/30 shadow-xs'
                    : 'border-border/60 bg-card/40 hover:bg-card/80 hover:border-accent-route/50'}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="rounded bg-accent-route/10 text-accent-route px-1.5 py-0.5 font-mono text-[9px] font-bold border border-accent-route/20 shrink-0">
                      A= {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground truncate flex-1">
                      {node.questionText}
                    </span>
                  </div>

                  {rulesCount > 0 && (<div className="mt-2 flex items-center gap-1.5">
                      <span className="rounded-full bg-accent-branch/15 text-accent-branch border border-accent-branch/30 px-2 py-0.5 text-[9px] font-bold font-mono">
                        {rulesCount} {rulesCount === 1 ? 'rule set' : 'rules set'}
                      </span>
                    </div>)}
                </div>);
        })}
          </div>

          {/* Bottom Pinned: Delete All Rules */}
          <div className="p-3 border-t border-border bg-card/60">
            <button onClick={() => setConfirmDeleteAll(true)} className="w-full text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <Trash2 className="h-3.5 w-3.5"/> Delete all rules
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (Flex-Fill) ================= */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-background">
          {/* Header Bar */}
          <div className="h-14 px-6 border-b border-border flex items-center justify-between bg-card/60 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="rounded bg-primary/10 text-primary px-2 py-0.5 font-mono text-xs font-bold border border-primary/20 shrink-0">
                A= {nodeList.findIndex((n) => n.id === selectedNode.id) + 1}
              </span>
              <h3 className="text-sm font-bold text-foreground truncate">
                {selectedNode.questionText}
              </h3>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X className="h-4 w-4"/>
            </button>
          </div>

          {/* Main Collapsible Rules Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* 1. Hide Answer Choices */}
            <LogicRuleRow icon={EyeOff} label="Hide answer choices" infoTooltip="Conditionally hide specific choice options based on previous answers." rulesCount={currentHiddenCount} isExpanded={expandedRows.hide} onToggle={() => setExpandedRows((prev) => ({ ...prev, hide: !prev.hide }))}>
              <p className="text-xs text-muted-foreground mb-2">
                Select choices to hide for this question:
              </p>
              <div className="space-y-2">
                {selectedNode.options.map((opt, i) => {
            const isHidden = hiddenChoices.includes(opt.id);
            return (<div key={opt.id || i} onClick={() => handleToggleHideChoice(opt.id)} className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${isHidden
                    ? 'border-red-500/40 bg-red-500/10 text-foreground'
                    : 'border-border bg-background hover:bg-secondary/40'}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-muted-foreground">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.optionText}</span>
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${isHidden ? 'bg-red-500/20 text-red-500' : 'text-muted-foreground'}`}>
                        {isHidden ? 'HIDDEN' : 'VISIBLE'}
                      </span>
                    </div>);
        })}
              </div>
            </LogicRuleRow>

            {/* 2. Branching Rules */}
            <LogicRuleRow icon={GitBranch} label="Branching" infoTooltip="Route respondents to different questions or survey completion screens based on their answer." rulesCount={currentBranchingRulesCount} isExpanded={expandedRows.branching} onToggle={() => setExpandedRows((prev) => ({ ...prev, branching: !prev.branching }))}>
              <p className="text-xs text-muted-foreground mb-2">
                Define next question for each choice:
              </p>
              <div className="space-y-3">
                {selectedNode.options.map((opt, i) => {
            const targetId = branchingRules[opt.id] ?? opt.nextQuestionId ?? '';
            return (<div key={opt.id || i} className="p-3 rounded-xl border border-border bg-background space-y-2 text-xs">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-secondary font-mono text-[10px] font-bold border border-border">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>If choice is "{opt.optionText}"</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                          Then go to →
                        </span>
                        <select value={targetId || ''} onChange={(e) => handleUpdateBranching(opt.id, e.target.value)} className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none transition-colors">
                          <option value="">🏁 End Survey (Complete)</option>
                          {nodeList.map((q, qIdx) => (<option key={q.id} value={q.id}>
                              A= {qIdx + 1}: {q.questionText.slice(0, 35)}...
                            </option>))}
                        </select>
                      </div>
                    </div>);
        })}
              </div>
            </LogicRuleRow>

            {/* 3. Calculations */}
            <LogicRuleRow icon={Calculator} label="Calculations" infoTooltip="Assign numerical score or weight values to answer choices for scoring or outcome quizzes." rulesCount={currentCalcCount} isExpanded={expandedRows.calculations} onToggle={() => setExpandedRows((prev) => ({ ...prev, calculations: !prev.calculations }))}>
              <p className="text-xs text-muted-foreground mb-2">
                Assign point values or weight score to choice options:
              </p>
              <div className="space-y-2">
                {selectedNode.options.map((opt, i) => {
            const scoreVal = calculations[opt.id] ?? 0;
            return (<div key={opt.id || i} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-background text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-muted-foreground">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="font-medium text-foreground">{opt.optionText}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">Score +</span>
                        <input type="number" value={scoreVal} onChange={(e) => handleUpdateCalculation(opt.id, parseInt(e.target.value, 10) || 0)} className="w-16 rounded-md border border-border bg-card px-2 py-1 text-xs font-bold text-foreground text-center focus:border-primary focus:outline-none"/>
                      </div>
                    </div>);
        })}
              </div>
            </LogicRuleRow>

          </div>

          {/* Footer Actions */}
          <div className="h-16 px-6 border-t border-border flex items-center justify-end gap-3 bg-card/60 shrink-0">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl border-border text-xs font-semibold px-4 h-9">
              Cancel
            </Button>
            <Button size="sm" disabled={!isDirty} onClick={handleSave} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-6 h-9 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all">
              Save
            </Button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Delete All Rules */}
      {confirmDeleteAll && (<div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2 rounded-full bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-5 w-5"/>
              </div>
              <h4 className="text-base font-bold text-foreground">Delete all rules?</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This will permanently clear all branching rules, hidden choices, and score calculations across all questions in this form.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmDeleteAll(false)} className="rounded-xl text-xs font-semibold h-8">
                Cancel
              </Button>
              <Button size="sm" onClick={handleDeleteAllRules} className="rounded-xl bg-red-500 text-white hover:bg-red-600 text-xs font-bold h-8">
                Delete all
              </Button>
            </div>
          </div>
        </div>)}
    </div>);
}
