import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/components/theme-provider';
import { XYFlowDiagramView } from '@/components/editor/XYFlowDiagramView';
import { Sparkles, Home, Eye, Save, Plus, Trash2, GitBranch, ArrowRight, Sun, Moon, Layers, ChevronRight, CheckCircle2, MoveUp, MoveDown, Edit3, FileText, Brain } from 'lucide-react';
export function FormEditorView({ form: initialForm, onSaveForm, onPreviewForm, onReturnHome, }) {
    const { theme, setTheme } = useTheme();
    const [form, setForm] = useState(initialForm);
    const [activeTab, setActiveTab] = useState('mindmap');
    const [selectedNodeId, setSelectedNodeId] = useState(initialForm.startQuestionId || Object.keys(initialForm.nodes)[0] || '');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const selectedNode = form.nodes[selectedNodeId];
    // Handler to update form title / description
    const handleMetaChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    // Handler to save form
    const handleSave = () => {
        onSaveForm(form);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
    };
    // Add Question Node
    const handleAddQuestion = () => {
        const newId = `q_${Date.now()}`;
        const newQuestionNode = {
            id: newId,
            formId: form.id,
            questionText: 'New Question Title',
            questionType: 'single_choice',
            level: 2,
            options: [
                { id: `opt_${Date.now()}_1`, questionId: newId, optionText: 'Option A', displayOrder: 1, nextQuestionId: null },
                { id: `opt_${Date.now()}_2`, questionId: newId, optionText: 'Option B', displayOrder: 2, nextQuestionId: null },
                { id: `opt_${Date.now()}_3`, questionId: newId, optionText: 'Option C', displayOrder: 3, nextQuestionId: null },
                { id: `opt_${Date.now()}_4`, questionId: newId, optionText: 'Option D', displayOrder: 4, nextQuestionId: null },
            ],
        };
        setForm((prev) => ({
            ...prev,
            nodes: {
                ...prev.nodes,
                [newId]: newQuestionNode,
            },
        }));
        setSelectedNodeId(newId);
    };
    // Delete Question Node
    const handleDeleteQuestion = (idToDelete) => {
        if (idToDelete === form.startQuestionId) {
            alert('Cannot delete the root start question.');
            return;
        }
        const updatedNodes = { ...form.nodes };
        delete updatedNodes[idToDelete];
        // Remove references to deleted question in options
        Object.keys(updatedNodes).forEach((nodeId) => {
            updatedNodes[nodeId].options = updatedNodes[nodeId].options.map((opt) => opt.nextQuestionId === idToDelete ? { ...opt, nextQuestionId: null } : opt);
        });
        setForm((prev) => ({
            ...prev,
            nodes: updatedNodes,
        }));
        const remainingKeys = Object.keys(updatedNodes);
        if (remainingKeys.length > 0) {
            setSelectedNodeId(remainingKeys[0]);
        }
    };
    // Update Question Text
    const handleQuestionTextChange = (text) => {
        if (!selectedNodeId || !selectedNode)
            return;
        setForm((prev) => ({
            ...prev,
            nodes: {
                ...prev.nodes,
                [selectedNodeId]: {
                    ...selectedNode,
                    questionText: text,
                },
            },
        }));
    };
    // Option Change Handler
    const handleOptionChange = (index, field, value) => {
        if (!selectedNodeId || !selectedNode)
            return;
        const updatedOptions = [...selectedNode.options];
        updatedOptions[index] = {
            ...updatedOptions[index],
            [field]: value === '' ? null : value,
        };
        setForm((prev) => ({
            ...prev,
            nodes: {
                ...prev.nodes,
                [selectedNodeId]: {
                    ...selectedNode,
                    options: updatedOptions,
                },
            },
        }));
    };
    // Add Choice Option
    const handleAddOption = () => {
        if (!selectedNodeId || !selectedNode)
            return;
        const newOpt = {
            id: `opt_${Date.now()}`,
            questionId: selectedNodeId,
            optionText: `New Choice ${selectedNode.options.length + 1}`,
            displayOrder: selectedNode.options.length + 1,
            nextQuestionId: null,
        };
        setForm((prev) => ({
            ...prev,
            nodes: {
                ...prev.nodes,
                [selectedNodeId]: {
                    ...selectedNode,
                    options: [...selectedNode.options, newOpt],
                },
            },
        }));
    };
    // Delete Choice Option
    const handleDeleteOption = (index) => {
        if (!selectedNodeId || !selectedNode)
            return;
        if (selectedNode.options.length <= 2) {
            alert('A question must have at least 2 choice options.');
            return;
        }
        const updatedOptions = selectedNode.options.filter((_, i) => i !== index);
        setForm((prev) => ({
            ...prev,
            nodes: {
                ...prev.nodes,
                [selectedNodeId]: {
                    ...selectedNode,
                    options: updatedOptions,
                },
            },
        }));
    };
    // Reorder Choice Options
    const handleMoveOption = (index, direction) => {
        if (!selectedNodeId || !selectedNode)
            return;
        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= selectedNode.options.length)
            return;
        const updatedOptions = [...selectedNode.options];
        const [movedOpt] = updatedOptions.splice(index, 1);
        updatedOptions.splice(targetIdx, 0, movedOpt);
        setForm((prev) => ({
            ...prev,
            nodes: {
                ...prev.nodes,
                [selectedNodeId]: {
                    ...selectedNode,
                    options: updatedOptions,
                },
            },
        }));
    };
    const nodeList = Object.values(form.nodes);
    return (<div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <button onClick={onReturnHome} className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="h-5 w-5"/>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground font-sans">
                Smart Forms
              </span>
            </button>
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold border border-primary/20">
              Visual Editor
            </span>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full h-9 w-9 border border-border/80 text-foreground hover:bg-secondary" aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              {theme === 'dark' ? (<Sun className="h-4 w-4 text-accent-route"/>) : (<Moon className="h-4 w-4 text-slate-700"/>)}
            </Button>

            <Button variant="outline" size="sm" onClick={onPreviewForm} className="gap-1.5 text-xs font-semibold rounded-full border-border hover:bg-secondary">
              <Eye className="h-3.5 w-3.5 text-primary"/>
              Preview & Test
            </Button>

            <Button size="sm" onClick={handleSave} className="gap-1.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs">
              {saveSuccess ? (<>
                  <CheckCircle2 className="h-3.5 w-3.5"/> Saved!
                </>) : (<>
                  <Save className="h-3.5 w-3.5"/> Save Form
                </>)}
            </Button>

            <Button variant="ghost" size="sm" onClick={onReturnHome} className="gap-2 text-sm text-muted-foreground hover:text-foreground rounded-full px-3">
              <Home className="h-4 w-4"/>
              Home
            </Button>
          </div>
        </div>

        {/* View Switcher Sub-Header Bar */}
        <div className="border-t border-border/40 bg-secondary/30 px-6 py-2.5">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2 p-1 rounded-xl bg-background border border-border">
              <button onClick={() => setActiveTab('mindmap')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'mindmap'
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}>
                <Brain className="h-4 w-4"/>
                🧠 Mind Map Canvas
              </button>

              <button onClick={() => setActiveTab('list')} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'list'
            ? 'bg-primary text-primary-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}>
                <FileText className="h-4 w-4"/>
                📝 Details & List Editor
              </button>
            </div>

            <p className="hidden md:block text-xs font-medium text-muted-foreground">
              {activeTab === 'mindmap'
            ? 'Interactive DAG Flow diagram showing decision branching paths'
            : 'Full details question text & choice options editor'}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-6 py-6">
        {activeTab === 'mindmap' ? (<XYFlowDiagramView form={form} onUpdateForm={(updatedForm) => setForm(updatedForm)} onSelectNodeForEdit={(nodeId) => {
                setSelectedNodeId(nodeId);
                setActiveTab('list');
            }}/>) : (<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Question Navigator Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary"/>
                  Questions ({nodeList.length})
                </CardTitle>
                <Button size="sm" variant="outline" onClick={handleAddQuestion} className="rounded-full h-8 px-2.5 text-xs font-semibold gap-1 border-primary/30 text-primary hover:bg-primary/10">
                  <Plus className="h-3.5 w-3.5"/> Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2 max-h-[620px] overflow-y-auto">
              {nodeList.map((node) => {
                const isSelected = node.id === selectedNodeId;
                return (<button key={node.id} onClick={() => setSelectedNodeId(node.id)} className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs transition-all border ${isSelected
                        ? 'bg-[#EEF2FF] dark:bg-indigo-950/50 border-[#6366F1] dark:border-[#818CF8] text-[#6366F1] dark:text-[#818CF8] font-bold shadow-xs'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-card hover:bg-[#F1F5F9] dark:hover:bg-slate-800 text-foreground font-semibold'}`}>
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] dark:bg-indigo-950/80 font-mono text-[10px] font-bold text-[#6366F1] dark:text-[#818CF8] border border-indigo-200 dark:border-indigo-800">
                        L{node.level}
                      </span>
                      <span className="truncate">{node.questionText}</span>
                    </div>

                    {node.isStart && (<span className="rounded bg-[#EEF2FF] dark:bg-indigo-950 text-[#6366F1] dark:text-[#818CF8] border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 text-[9px] font-bold shrink-0">
                        ROOT
                      </span>)}
                  </button>);
            })}
            </CardContent>
          </Card>
        </div>

        {/* Center Column: Question Editor */}
        <div className="lg:col-span-6 space-y-6">
          {/* Form Meta Section */}
          <Card className="border-border bg-card shadow-sm rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Form Header Configuration
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Form Title
                </label>
                <input type="text" value={form.title} onChange={(e) => handleMetaChange('title', e.target.value)} className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm font-bold text-foreground font-serif focus:border-primary focus:outline-none"/>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Description / Subtitle
                </label>
                <input type="text" value={form.description} onChange={(e) => handleMetaChange('description', e.target.value)} className="w-full rounded-xl border border-border bg-background px-3.5 py-1.5 text-xs text-muted-foreground focus:border-primary focus:outline-none"/>
              </div>
            </div>
          </Card>

          {/* Active Question Editor Card */}
          {selectedNode ? (<Card className="border-border bg-card shadow-sm rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-primary"/>
                  <h3 className="font-bold text-foreground text-base">
                    Editing Question: <span className="font-mono text-xs text-muted-foreground">{selectedNode.id}</span>
                  </h3>
                </div>

                {!selectedNode.isStart && (<Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(selectedNode.id)} className="text-destructive hover:bg-destructive/10 text-xs font-semibold h-8 rounded-full gap-1">
                    <Trash2 className="h-3.5 w-3.5"/> Delete Question
                  </Button>)}
              </div>

              {/* Question Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Question Text
                </label>
                <textarea rows={2} value={selectedNode.questionText} onChange={(e) => handleQuestionTextChange(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-base font-bold text-foreground font-serif focus:border-primary focus:outline-none" placeholder="Enter your survey question..."/>
              </div>

              {/* Options & Routing Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Choice Options ({selectedNode.options.length}) & Next Destination
                  </label>
                  <Button size="sm" variant="outline" onClick={handleAddOption} className="rounded-full h-7 px-2.5 text-xs font-semibold gap-1">
                    <Plus className="h-3 w-3"/> Add Choice
                  </Button>
                </div>

                <div className="space-y-3">
                  {selectedNode.options.map((opt, idx) => (<div key={opt.id || idx} className="p-4 rounded-2xl border border-border bg-secondary/30 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-card border font-mono text-xs font-bold text-foreground">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <input type="text" value={opt.optionText} onChange={(e) => handleOptionChange(idx, 'optionText', e.target.value)} placeholder="Choice option text..." className="flex-1 rounded-xl border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"/>

                        {/* Option Actions */}
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleMoveOption(idx, 'up')} disabled={idx === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move Up">
                            <MoveUp className="h-3.5 w-3.5"/>
                          </button>
                          <button onClick={() => handleMoveOption(idx, 'down')} disabled={idx === selectedNode.options.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Move Down">
                            <MoveDown className="h-3.5 w-3.5"/>
                          </button>
                          <button onClick={() => handleDeleteOption(idx)} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Delete Choice">
                            <Trash2 className="h-3.5 w-3.5"/>
                          </button>
                        </div>
                      </div>

                      {/* Next Question Target Selector */}
                      <div className="flex items-center gap-2 text-xs pt-1 border-t border-border/40">
                        <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0"/>
                        <span className="text-muted-foreground font-medium shrink-0">
                          Branches to:
                        </span>
                        <select value={opt.nextQuestionId || ''} onChange={(e) => handleOptionChange(idx, 'nextQuestionId', e.target.value)} className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none">
                          <option value="">🏁 End Survey (Complete)</option>
                          {nodeList.map((target) => (<option key={target.id} value={target.id}>
                              {target.questionText.slice(0, 38)}...
                            </option>))}
                        </select>
                      </div>
                    </div>))}
                </div>
              </div>
            </Card>) : null}
        </div>

        {/* Right Column: Live Question Inspector */}
        <div className="lg:col-span-3 space-y-4">
          {selectedNode && (<Card className="border-border bg-card shadow-sm rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Branching Inspector
                </h4>
                <GitBranch className="h-4 w-4 text-primary"/>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-0.5">CURRENT QUESTION</span>
                  <p className="font-bold text-foreground font-serif">{selectedNode.questionText}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/40">
                  <span className="text-muted-foreground block mb-1">OUTGOING BRANCHES</span>
                  {selectedNode.options.map((opt, i) => {
                    const target = opt.nextQuestionId ? form.nodes[opt.nextQuestionId] : null;
                    return (<div key={opt.id || i} className="p-2.5 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
                        <p className="font-semibold text-foreground">
                          [{String.fromCharCode(65 + i)}] {opt.optionText}
                        </p>
                        <p className="text-[11px] text-primary flex items-center gap-1 font-mono">
                          <ChevronRight className="h-3 w-3"/>
                          {target ? target.questionText.slice(0, 22) + '...' : '🏁 Complete'}
                        </p>
                      </div>);
                })}
                </div>
              </div>
            </Card>)}
        </div>
      </div>)}
      </div>
    </div>);
}
