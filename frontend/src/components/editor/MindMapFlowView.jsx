import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GitBranch, ArrowRight, Sparkles, Layers, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, Edit3, X, ChevronRight } from 'lucide-react';
export function MindMapFlowView({ form, onUpdateForm, onSelectNodeForEdit, }) {
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [hoveredOptionId, setHoveredOptionId] = useState(null);
    const [activeEditNodeId, setActiveEditNodeId] = useState(null);
    const [zoomScale, setZoomScale] = useState(1);
    const nodeList = Object.values(form.nodes);
    // Group nodes by Level (Level 1, Level 2, Level 3, etc.)
    const level1Nodes = nodeList.filter((n) => n.level === 1 || n.isStart);
    const level2Nodes = nodeList.filter((n) => n.level === 2 && !n.isStart);
    const level3Nodes = nodeList.filter((n) => n.level === 3);
    const otherNodes = nodeList.filter((n) => n.level > 3 || (!level1Nodes.includes(n) && !level2Nodes.includes(n) && !level3Nodes.includes(n)));
    // Calculate active highlighted paths on hover
    const isNodeHighlighted = (nodeId) => {
        if (!hoveredNodeId && !hoveredOptionId)
            return false;
        if (hoveredNodeId === nodeId)
            return true;
        // Check if hovered node points to this nodeId
        if (hoveredNodeId) {
            const sourceNode = form.nodes[hoveredNodeId];
            if (sourceNode?.options.some((opt) => opt.nextQuestionId === nodeId)) {
                return true;
            }
        }
        // Check if hovered option points to this nodeId
        if (hoveredOptionId) {
            for (const node of nodeList) {
                const foundOpt = node.options.find((o) => o.id === hoveredOptionId);
                if (foundOpt && foundOpt.nextQuestionId === nodeId) {
                    return true;
                }
            }
        }
        return false;
    };
    const editingNode = activeEditNodeId ? form.nodes[activeEditNodeId] : null;
    // Handlers for quick editing inside drawer
    const handleQuickQuestionTextChange = (text) => {
        if (!activeEditNodeId || !editingNode)
            return;
        const updatedForm = {
            ...form,
            nodes: {
                ...form.nodes,
                [activeEditNodeId]: {
                    ...editingNode,
                    questionText: text,
                },
            },
        };
        onUpdateForm(updatedForm);
    };
    const handleQuickOptionTextChange = (optIdx, text) => {
        if (!activeEditNodeId || !editingNode)
            return;
        const updatedOpts = [...editingNode.options];
        updatedOpts[optIdx] = {
            ...updatedOpts[optIdx],
            optionText: text,
        };
        const updatedForm = {
            ...form,
            nodes: {
                ...form.nodes,
                [activeEditNodeId]: {
                    ...editingNode,
                    options: updatedOpts,
                },
            },
        };
        onUpdateForm(updatedForm);
    };
    const handleQuickOptionNextChange = (optIdx, nextId) => {
        if (!activeEditNodeId || !editingNode)
            return;
        const updatedOpts = [...editingNode.options];
        updatedOpts[optIdx] = {
            ...updatedOpts[optIdx],
            nextQuestionId: nextId === '' ? null : nextId,
        };
        const updatedForm = {
            ...form,
            nodes: {
                ...form.nodes,
                [activeEditNodeId]: {
                    ...editingNode,
                    options: updatedOpts,
                },
            },
        };
        onUpdateForm(updatedForm);
    };
    return (<div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6 space-y-6">
      {/* Mind Map Canvas Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <GitBranch className="h-5 w-5"/>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground font-sans flex items-center gap-2">
              Smart Mind Map Canvas
            </h2>
            <p className="text-xs text-muted-foreground">
              Visual decision DAG branching map ({nodeList.length} question nodes)
            </p>
          </div>
        </div>

        {/* Zoom & Fit Controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoomScale((prev) => Math.max(0.7, prev - 0.1))} className="h-8 rounded-lg px-2.5 text-xs gap-1 border-border" aria-label="Zoom Out">
            <ZoomOut className="h-3.5 w-3.5"/>
          </Button>
          <span className="text-xs font-mono font-bold text-muted-foreground w-12 text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={() => setZoomScale((prev) => Math.min(1.3, prev + 0.1))} className="h-8 rounded-lg px-2.5 text-xs gap-1 border-border" aria-label="Zoom In">
            <ZoomIn className="h-3.5 w-3.5"/>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setZoomScale(1)} className="h-8 rounded-lg px-2 text-xs gap-1 text-muted-foreground" aria-label="Reset Zoom">
            <RotateCcw className="h-3.5 w-3.5"/>
          </Button>
        </div>
      </div>

      {/* Mind Map Horizontal Columns Canvas */}
      <div className="overflow-x-auto pb-6">
        <div className="flex items-start gap-8 min-w-[950px] transition-transform origin-top-left duration-200" style={{ transform: `scale(${zoomScale})` }}>
          {/* Column 1: Root Question (Level 1) */}
          <div className="flex-1 min-w-[280px] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-route bg-accent-route/10 px-3 py-1.5 rounded-lg border border-accent-route/20 w-fit">
              <Sparkles className="h-3.5 w-3.5"/> Level 1 • Root Question
            </div>

            <div className="space-y-4">
              {level1Nodes.map((node) => (<MindMapNodeCard key={node.id} node={node} form={form} isHighlighted={isNodeHighlighted(node.id)} onHoverNode={(id) => setHoveredNodeId(id)} onHoverOption={(id) => setHoveredOptionId(id)} onClickEdit={() => setActiveEditNodeId(node.id)} onFullEdit={() => onSelectNodeForEdit(node.id)}/>))}
            </div>
          </div>

          {/* Arrow Divider 1 */}
          <div className="self-center text-muted-foreground/40 pt-10">
            <ChevronRight className="h-8 w-8"/>
          </div>

          {/* Column 2: Branching Questions (Level 2) */}
          <div className="flex-1 min-w-[280px] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 w-fit">
              <Layers className="h-3.5 w-3.5"/> Level 2 • Primary Branches ({level2Nodes.length})
            </div>

            <div className="space-y-4">
              {level2Nodes.map((node) => (<MindMapNodeCard key={node.id} node={node} form={form} isHighlighted={isNodeHighlighted(node.id)} onHoverNode={(id) => setHoveredNodeId(id)} onHoverOption={(id) => setHoveredOptionId(id)} onClickEdit={() => setActiveEditNodeId(node.id)} onFullEdit={() => onSelectNodeForEdit(node.id)}/>))}
            </div>
          </div>

          {/* Arrow Divider 2 */}
          <div className="self-center text-muted-foreground/40 pt-10">
            <ChevronRight className="h-8 w-8"/>
          </div>

          {/* Column 3: Detailed Questions (Level 3+) */}
          <div className="flex-1 min-w-[280px] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-branch bg-accent-branch/10 px-3 py-1.5 rounded-lg border border-accent-branch/20 w-fit">
              <GitBranch className="h-3.5 w-3.5"/> Level 3 • Detail Nodes ({level3Nodes.length + otherNodes.length})
            </div>

            <div className="space-y-4">
              {[...level3Nodes, ...otherNodes].map((node) => (<MindMapNodeCard key={node.id} node={node} form={form} isHighlighted={isNodeHighlighted(node.id)} onHoverNode={(id) => setHoveredNodeId(id)} onHoverOption={(id) => setHoveredOptionId(id)} onClickEdit={() => setActiveEditNodeId(node.id)} onFullEdit={() => onSelectNodeForEdit(node.id)}/>))}
            </div>
          </div>

          {/* Arrow Divider 3 */}
          <div className="self-center text-muted-foreground/40 pt-10">
            <ChevronRight className="h-8 w-8"/>
          </div>

          {/* Column 4: Survey End Goal */}
          <div className="flex-1 min-w-[220px] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <CheckCircle2 className="h-3.5 w-3.5"/> Completion State
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center space-y-2 shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold shadow-sm">
                🏁
              </div>
              <h4 className="font-bold text-foreground text-sm font-serif">
                Survey Completed
              </h4>
              <p className="text-xs text-muted-foreground">
                All pathways lead to response submission & analytics recording.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Edit Node Drawer Modal */}
      {editingNode && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 font-serif">
                <Edit3 className="h-5 w-5 text-primary"/>
                Quick Edit: "{editingNode.questionText.slice(0, 30)}..."
              </h3>
              <button onClick={() => setActiveEditNodeId(null)} className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary">
                <X className="h-5 w-5"/>
              </button>
            </div>

            {/* Edit Question Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Question Text
              </label>
              <textarea rows={2} value={editingNode.questionText} onChange={(e) => handleQuickQuestionTextChange(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold text-foreground font-serif focus:border-primary focus:outline-none"/>
            </div>

            {/* Edit Choice Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Choice Options & Branch Targets
              </label>
              {editingNode.options.map((opt, i) => (<div key={opt.id || i} className="space-y-1.5 p-3 rounded-xl border border-border bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-card border font-mono text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input type="text" value={opt.optionText} onChange={(e) => handleQuickOptionTextChange(i, e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"/>
                  </div>
                  <div className="flex items-center gap-2 text-xs pt-1">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0"/>
                    <select value={opt.nextQuestionId || ''} onChange={(e) => handleQuickOptionNextChange(i, e.target.value)} className="flex-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground focus:border-primary focus:outline-none">
                      <option value="">🏁 End Survey (Complete)</option>
                      {nodeList.map((t) => (<option key={t.id} value={t.id}>
                          {t.questionText.slice(0, 35)}...
                        </option>))}
                    </select>
                  </div>
                </div>))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setActiveEditNodeId(null)} className="rounded-full text-xs font-semibold px-4">
                Done
              </Button>
              <Button onClick={() => {
                const targetId = activeEditNodeId;
                setActiveEditNodeId(null);
                if (targetId)
                    onSelectNodeForEdit(targetId);
            }} className="rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 gap-1.5">
                Full Details Editor <ChevronRight className="h-3.5 w-3.5"/>
              </Button>
            </div>
          </div>
        </div>)}
    </div>);
}
// Single Question Node Card inside Mind Map
function MindMapNodeCard({ node, form, isHighlighted, onHoverNode, onHoverOption, onClickEdit, onFullEdit, }) {
    return (<div onMouseEnter={() => onHoverNode(node.id)} onMouseLeave={() => onHoverNode(null)} className={`relative rounded-2xl border p-4 transition-all duration-200 shadow-sm ${isHighlighted
            ? 'border-accent-route bg-accent-route/10 ring-2 ring-accent-route/30 scale-[1.02]'
            : 'border-border bg-card hover:border-accent-route/60 hover:bg-secondary/40'}`}>
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {node.id}
          </span>
          {node.isStart && (<span className="rounded bg-accent-route/20 text-accent-route px-1.5 py-0.5 text-[10px] font-bold">
              START
            </span>)}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClickEdit} className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" aria-label="Quick Edit">
            <Edit3 className="h-3.5 w-3.5"/>
          </button>
          <button onClick={onFullEdit} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-[10px] font-semibold" aria-label="Open in Details Editor">
            Details →
          </button>
        </div>
      </div>

      {/* Question Title */}
      <h3 className="text-sm font-bold text-foreground font-serif pt-2.5 pb-3 leading-snug">
        {node.questionText}
      </h3>

      {/* Choice Options List with Branching Target Badges */}
      <div className="space-y-2">
        {node.options.map((opt, i) => {
            const targetNode = opt.nextQuestionId ? form.nodes[opt.nextQuestionId] : null;
            return (<div key={opt.id || i} onMouseEnter={() => onHoverOption(opt.id)} onMouseLeave={() => onHoverOption(null)} className="p-2 rounded-xl border border-border/80 bg-background/80 hover:border-primary/60 transition-colors space-y-1 text-xs">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary font-mono text-[10px] font-bold border border-border">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="truncate">{opt.optionText}</span>
              </div>

              {/* Target Indicator */}
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono pl-7">
                <ArrowRight className="h-3 w-3 text-primary shrink-0"/>
                <span className="truncate">
                  {targetNode ? (<span className="text-primary font-semibold">
                      {targetNode.questionText.slice(0, 25)}...
                    </span>) : (<span className="text-emerald-500 font-semibold">🏁 Completion</span>)}
                </span>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
