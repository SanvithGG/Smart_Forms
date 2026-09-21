import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, Handle, Position, MarkerType, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch, Award, Tag, HelpCircle, Play, RotateCcw, Settings, ArrowRight, Sparkles, X, Check, ThumbsUp, ThumbsDown, Send, Workflow, Flag, Trash2, ChevronDown, Compass, ArrowLeft } from 'lucide-react';
function QuestionNodeComponent({ data }) {
    const [showPopover, setShowPopover] = useState(false);
    return (<div onClick={() => {
            setShowPopover(!showPopover);
            data.onSelectNode(data.nodeId);
        }} className="group relative w-64 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-card p-4 shadow-xl hover:border-[#6366F1] dark:hover:border-[#818CF8] hover:bg-[#EEF2FF]/40 dark:hover:bg-indigo-950/20 transition-all cursor-pointer select-none">
      {/* Left Input Handle */}
      <Handle type="target" position={Position.Left} className="!w-3.5 !h-3.5 !bg-[#6366F1] dark:!bg-[#818CF8] !border-2 !border-background !-left-1.5 shadow-xs"/>

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#EEF2FF] dark:bg-indigo-950/60 font-mono text-[10px] font-bold text-[#6366F1] dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            {data.stepNumber}
          </span>
          <span className="text-[#64748B] dark:text-[#94A3B8] font-mono text-[10px]">
            {data.nodeId}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {data.isStart && (<span className="rounded bg-[#EEF2FF] dark:bg-indigo-950 text-[#6366F1] dark:text-[#818CF8] px-1.5 py-0.5 text-[8px] font-bold border border-indigo-200 dark:border-indigo-800 font-mono">
              ROOT
            </span>)}
          <button onClick={(e) => {
            e.stopPropagation();
            data.onOpenLogic(data.nodeId);
        }} className="p-1 rounded hover:bg-secondary text-[#64748B] dark:text-[#94A3B8] hover:text-[#6366F1] transition-colors" title="Edit Logic Rules">
            <GitBranch className="h-3.5 w-3.5"/>
          </button>
        </div>
      </div>

      {/* Question Title */}
      <h5 className="text-xs font-bold text-foreground font-serif leading-snug line-clamp-2 mb-2.5">
        {data.questionText}
      </h5>

      {/* Choice Options Preview */}
      <div className="space-y-1.5 mb-3">
        {data.options.slice(0, 3).map((opt, i) => (<div key={opt.id || i} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 px-2 py-1 text-[10px] font-semibold text-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-mono text-[9px] font-bold text-[#6366F1] dark:text-[#818CF8]">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="truncate text-foreground font-medium">{opt.optionText}</span>
            </div>
            {opt.nextQuestionId && (<span className="text-[9px] font-mono font-bold text-[#F59E0B] flex items-center gap-0.5">
                <ArrowRight className="h-2.5 w-2.5"/> {opt.nextQuestionId}
              </span>)}
          </div>))}
      </div>

      {/* Action Footer Button */}
      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <span className="text-[9px] font-medium text-[#64748B] dark:text-[#94A3B8]">
          {data.options.length} choices
        </span>

        <button onClick={(e) => {
            e.stopPropagation();
            data.onOpenLogic(data.nodeId);
        }} className="px-2 py-0.5 rounded-lg bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#6366F1] dark:text-indigo-400 hover:bg-[#6366F1] hover:text-white dark:hover:bg-[#6366F1] dark:hover:text-white text-[10px] font-bold transition-all border border-indigo-200 dark:border-indigo-800/60">
          Edit Logic
        </button>
      </div>

      {/* Right Output Handle */}
      <Handle type="source" position={Position.Right} className="!w-3.5 !h-3.5 !bg-[#6366F1] dark:!bg-[#818CF8] !border-2 !border-background !-right-1.5 shadow-xs"/>

      {/* FLOATING QUICK POPOVER CARD */}
      {showPopover && (<div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-40 w-56 rounded-2xl border border-border bg-card p-2.5 shadow-2xl flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground">
            <span className="text-[#64748B] dark:text-[#94A3B8] font-mono text-[9px]">Always go to</span>
            <span className="truncate max-w-[80px] text-[#6366F1] dark:text-[#818CF8] font-mono text-[10px]">
              {data.options[0]?.nextQuestionId || 'Next'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={(e) => {
                e.stopPropagation();
                setShowPopover(false);
            }} className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Delete node link">
              <Trash2 className="h-3.5 w-3.5"/>
            </button>
            <button onClick={(e) => {
                e.stopPropagation();
                setShowPopover(false);
                data.onOpenLogic(data.nodeId);
            }} className="rounded-lg bg-[#6366F1] text-white px-2 py-1 text-[10px] font-bold shadow-xs hover:bg-[#4F46E5]">
              Edit
            </button>
          </div>
        </div>)}
    </div>);
}
/* ──────────────────────────────────────────────────────────
   2. CUSTOM PULL DATA NODE
   ────────────────────────────────────────────────────────── */
function PullDataNodeComponent() {
    return (<div className="w-56 rounded-3xl border border-dashed border-primary/40 bg-card/80 p-5 flex flex-col items-start space-y-2.5 shadow-md">
      <div className="p-2 rounded-xl bg-primary/10 text-primary">
        <Workflow className="h-4 w-4"/>
      </div>
      <h4 className="text-xs font-bold text-foreground">Pull data in</h4>
      <p className="text-[10px] text-muted-foreground leading-normal">
        Track sources, identify respondents, and personalize flow via URL.
      </p>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-primary !border-2 !border-background !-right-1.5"/>
    </div>);
}
/* ──────────────────────────────────────────────────────────
   3. CUSTOM ENDING NODE
   ────────────────────────────────────────────────────────── */
function EndingNodeComponent() {
    return (<div className="w-52 rounded-2xl border border-emerald-500/40 bg-card/90 p-4 flex flex-col items-start space-y-2 shadow-md">
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-background !-left-1.5"/>
      <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
        <Flag className="h-4 w-4"/> End Survey
      </div>
      <p className="text-[10px] text-muted-foreground">
        Thank you for completing the survey! 🏁
      </p>
    </div>);
}
const nodeTypes = {
    questionNode: QuestionNodeComponent,
    pullDataNode: PullDataNodeComponent,
    endingNode: EndingNodeComponent,
};
/* ──────────────────────────────────────────────────────────
   MAIN WORKFLOW COMPONENT USING XYFLOW / REACT FLOW
   ────────────────────────────────────────────────────────── */
export function TypeformWorkflowView({ form, onUpdateForm, onSelectNodeForEdit, }) {
    const [activeSubTab, setActiveSubTab] = useState('branching');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiPromptInput, setAiPromptInput] = useState('');
    const [selectedLogicNodeId, setSelectedLogicNodeId] = useState(null);
    const [showBanner, setShowBanner] = useState(true);
    // Copy of options nextQuestionId map for active logic modal editing
    const [editingLogicRules, setEditingLogicRules] = useState({});
    const nodeList = Object.values(form.nodes);
    const handleOpenLogicModal = useCallback((nodeId) => {
        const targetNode = form.nodes[nodeId];
        if (!targetNode)
            return;
        const initialRules = {};
        targetNode.options.forEach((opt) => {
            initialRules[opt.id] = opt.nextQuestionId || '';
        });
        setEditingLogicRules(initialRules);
        setSelectedLogicNodeId(nodeId);
    }, [form.nodes]);
    const handleSaveLogicRules = () => {
        if (!selectedLogicNodeId)
            return;
        const targetNode = form.nodes[selectedLogicNodeId];
        if (!targetNode)
            return;
        const updatedOptions = targetNode.options.map((opt) => ({
            ...opt,
            nextQuestionId: editingLogicRules[opt.id] || null,
        }));
        const updatedForm = {
            ...form,
            nodes: {
                ...form.nodes,
                [selectedLogicNodeId]: {
                    ...targetNode,
                    options: updatedOptions,
                },
            },
        };
        onUpdateForm(updatedForm);
        setSelectedLogicNodeId(null);
    };
    const handleDeleteAllRules = () => {
        setEditingLogicRules({});
    };
    // Generate initial React Flow nodes & edges dynamically from form nodes
    const initialNodesAndEdges = useMemo(() => {
        const nodes = [];
        const edges = [];
        // 1. Pull Data Node
        nodes.push({
            id: 'pull_data',
            type: 'pullDataNode',
            position: { x: 0, y: 200 },
            data: {},
        });
        // 2. All Question Nodes in a single horizontal line
        nodeList.forEach((node, idx) => {
            nodes.push({
                id: node.id,
                type: 'questionNode',
                position: { x: 320 + idx * 340, y: 200 },
                data: {
                    nodeId: node.id,
                    stepNumber: idx + 1,
                    questionText: node.questionText,
                    options: node.options,
                    isStart: node.isStart || idx === 0,
                    onSelectNode: onSelectNodeForEdit,
                    onOpenLogic: handleOpenLogicModal,
                },
            });
        });
        // 3. Connect Pull Data to Question 1
        if (nodeList[0]) {
            edges.push({
                id: 'e_pull_q1',
                source: 'pull_data',
                target: nodeList[0].id,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#6366F1', strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#6366F1',
                },
            });
        }
        // 4. Build branching edges from node options
        nodeList.forEach((node) => {
            const activeBranchOpts = node.options.filter((opt) => opt.nextQuestionId && form.nodes[opt.nextQuestionId]);
            const isMultiBranch = activeBranchOpts.length > 1;
            node.options.forEach((opt, optIdx) => {
                if (opt.nextQuestionId && form.nodes[opt.nextQuestionId]) {
                    const edgeColor = isMultiBranch && optIdx > 0 ? '#F59E0B' : '#6366F1';
                    edges.push({
                        id: `edge_${node.id}_${opt.id}_${opt.nextQuestionId}`,
                        source: node.id,
                        target: opt.nextQuestionId,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: edgeColor, strokeWidth: 2 },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: edgeColor,
                        },
                    });
                }
            });
        });
        // 5. Ending Node at the end of the single horizontal line
        const endingX = 320 + nodeList.length * 340;
        nodes.push({
            id: 'end_node',
            type: 'endingNode',
            position: { x: endingX, y: 200 },
            data: {},
        });
        // Connect leaf nodes to ending node
        nodeList.forEach((node) => {
            const isLeaf = node.options.every((opt) => !opt.nextQuestionId || !form.nodes[opt.nextQuestionId]);
            if (isLeaf) {
                edges.push({
                    id: `edge_end_${node.id}`,
                    source: node.id,
                    target: 'end_node',
                    type: 'smoothstep',
                    style: { stroke: '#10B981', strokeWidth: 2, strokeDasharray: '4 4' },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#10B981',
                    },
                });
            }
        });
        return { nodes, edges };
    }, [form, nodeList, onSelectNodeForEdit, handleOpenLogicModal]);
    const [nodes, , onNodesChange] = useNodesState(initialNodesAndEdges.nodes);
    const [edges, , onEdgesChange] = useEdgesState(initialNodesAndEdges.edges);
    const activeLogicNode = selectedLogicNodeId ? form.nodes[selectedLogicNodeId] : null;
    return (<div className="flex-1 flex flex-col bg-secondary/10 relative overflow-hidden h-[calc(100vh-48px)] font-sans">
      {/* 1. SUB-TOOLBAR UNDER NAVBAR */}
      <div className="border-b border-border/60 bg-card px-4 py-1.5 flex flex-wrap items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-1">
          <button onClick={() => setActiveSubTab('branching')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'branching'
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <GitBranch className="h-3.5 w-3.5"/> Branching
          </button>
          <button onClick={() => setActiveSubTab('scoring')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'scoring'
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <Award className="h-3.5 w-3.5"/> Scoring
          </button>
          <button onClick={() => setActiveSubTab('tagging')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'tagging'
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <Tag className="h-3.5 w-3.5"/> Tagging
          </button>
          <button onClick={() => setActiveSubTab('outcome')} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeSubTab === 'outcome'
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-2xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <HelpCircle className="h-3.5 w-3.5"/> Outcome quiz
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary">
            <Play className="h-3.5 w-3.5 text-primary"/> Preview
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary font-mono">
            (x) Variables
          </button>
          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
            <RotateCcw className="h-3.5 w-3.5"/>
          </button>
          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
            <Settings className="h-3.5 w-3.5"/>
          </button>
        </div>
      </div>

      {/* 2. REACT FLOW DIAGRAM CANVAS */}
      <div className="w-full h-[calc(100vh-90px)] relative">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} className="bg-secondary/10 w-full h-full">
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="currentColor" className="opacity-20"/>
          <Controls showInteractive={false} className="!bottom-6 !left-6 !bg-card !border-border !rounded-full !shadow-lg"/>
        </ReactFlow>

        {/* FLOATING AI PROMPT PILL AT BOTTOM */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4">
          <div className="relative flex items-center rounded-full border border-primary/30 bg-card/95 shadow-2xl p-1.5 pl-4 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mr-2"/>
            <input type="text" value={aiPromptInput} onChange={(e) => setAiPromptInput(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter') {
                setIsAiModalOpen(true);
            }
        }} placeholder="Chat to create (e.g. 'Add a rating question', 'Add an ending screen')..." className="w-full bg-transparent text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"/>
            <Button size="sm" onClick={() => setIsAiModalOpen(true)} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 p-0 shrink-0 shadow-sm">
              <Send className="h-3.5 w-3.5"/>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. EDIT LOGIC FOR [ N ] MODAL (AS SEEN IN REFERENCE SCREENSHOT) */}
      {selectedLogicNodeId && activeLogicNode && (<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-card">
              <div className="space-y-1">
                <button onClick={() => setSelectedLogicNodeId(null)} className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5"/> See all rules
                </button>
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2 font-serif">
                  Edit logic for
                  <span className="rounded bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold font-mono border border-primary/20">
                    A= B- {nodeList.findIndex((n) => n.id === activeLogicNode.id) + 1}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create rules to branch flows or calculate prices
                </p>
              </div>
              <button onClick={() => setSelectedLogicNodeId(null)} className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5"/>
              </button>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-secondary/10">
              {/* Info Box Banner */}
              {showBanner && (<div className="relative rounded-2xl border border-accent-branch/30 bg-accent-branch/10 p-4 pr-10 flex items-start gap-3">
                  <Compass className="h-5 w-5 text-accent-branch shrink-0 mt-0.5"/>
                  <div className="space-y-1 text-xs">
                    <h4 className="font-bold text-foreground">
                      Segment respondents, customize flows and calculate scores
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Assign your respondents to a specific segment based on their answers and customize their path accordingly.
                    </p>
                    <a href="#" onClick={(e) => e.preventDefault()} className="inline-block font-bold text-primary hover:underline pt-1">
                      Learn more about logic features →
                    </a>
                  </div>
                  <button onClick={() => setShowBanner(false)} className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <X className="h-4 w-4"/>
                  </button>
                </div>)}

              {/* Target Question Title Header */}
              <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card p-3.5 text-xs font-bold text-foreground shadow-2xs">
                <span className="rounded bg-primary/10 text-primary px-2 py-0.5 font-mono text-xs border border-primary/20">
                  A= B- {nodeList.findIndex((n) => n.id === activeLogicNode.id) + 1}
                </span>
                <span className="font-serif text-sm">{activeLogicNode.questionText}</span>
              </div>

              {/* Condition Rule Blocks */}
              <div className="space-y-4">
                {activeLogicNode.options.map((opt, i) => (<div key={opt.id || i} className="rounded-2xl border border-border/80 bg-card p-4 space-y-3.5 shadow-sm">
                    {/* If Condition */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-8">If</span>
                        <div className="flex-1 flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs font-bold text-foreground">
                          <div className="flex items-center gap-2 truncate">
                            <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-mono">
                              A= B- {nodeList.findIndex((n) => n.id === activeLogicNode.id) + 1}
                            </span>
                            <span className="truncate">{activeLogicNode.questionText}</span>
                          </div>
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0"/>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-8">is</span>
                        <div className="flex-1 flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs font-bold text-foreground">
                          <div className="flex items-center gap-2 truncate">
                            <span className="rounded bg-secondary font-mono text-[10px] px-1.5 py-0.5 border border-border">
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="truncate">{opt.optionText}</span>
                          </div>
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0"/>
                        </div>
                      </div>

                      <button type="button" className="text-xs font-bold text-primary hover:underline pl-10 flex items-center gap-1">
                        + Add condition
                      </button>
                    </div>

                    {/* Then Action */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                      <span className="text-xs font-bold text-muted-foreground w-8">Then</span>
                      <div className="flex-1 flex items-center gap-2">
                        <select className="rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer">
                          <option value="goto">Go to</option>
                          <option value="jump">Jump to page</option>
                        </select>

                        <select value={editingLogicRules[opt.id] || ''} onChange={(e) => setEditingLogicRules((prev) => ({
                    ...prev,
                    [opt.id]: e.target.value,
                }))} className="flex-1 rounded-xl border border-border bg-secondary/30 px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer">
                          <option value="">🏁 End Survey (Complete)</option>
                          {nodeList.map((target, targetIdx) => (<option key={target.id} value={target.id}>
                              A= B- {targetIdx + 1} • {target.questionText.slice(0, 32)}...
                            </option>))}
                        </select>
                      </div>
                    </div>
                  </div>))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border/60 flex items-center justify-between bg-card">
              <button onClick={handleDeleteAllRules} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors">
                <Trash2 className="h-3.5 w-3.5"/> Delete all rules
              </button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedLogicNodeId(null)} className="rounded-full text-xs font-bold px-4">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveLogicRules} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-6 shadow-sm">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>)}

      {/* 4. TYPEFORM AI BETA MODAL */}
      {isAiModalOpen && (<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[85vh]">
            <div className="md:col-span-5 border-r border-border/60 p-6 flex flex-col justify-between bg-secondary/10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary"/>
                  <h4 className="text-xs font-bold text-foreground font-mono">
                    Typeform AI <span className="rounded bg-primary/10 text-primary px-1.5 py-0.5 text-[9px]">Beta</span>
                  </h4>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <Check className="h-4 w-4"/> Added the React survey questions.
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <Check className="h-4 w-4"/> Added the survey branching logic.
                  </div>
                  <p className="text-muted-foreground pt-2 border-t border-border/40">
                    Added. Is there anything else you'd like to refine?
                  </p>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <button className="p-1.5 rounded-lg border border-border hover:bg-secondary">
                    <ThumbsUp className="h-3.5 w-3.5"/>
                  </button>
                  <button className="p-1.5 rounded-lg border border-border hover:bg-secondary">
                    <ThumbsDown className="h-3.5 w-3.5"/>
                  </button>
                </div>
              </div>

              <div className="relative pt-4">
                <div className="flex items-center rounded-2xl border border-border bg-background p-2">
                  <input type="text" placeholder="Chat to create..." className="w-full bg-transparent text-xs font-medium text-foreground focus:outline-none px-2"/>
                  <Button size="sm" className="rounded-xl h-7 w-7 p-0 shrink-0">
                    <Send className="h-3 w-3"/>
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="text-xs font-bold text-foreground">Suggested changes</span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground hover:bg-secondary">
                      <Play className="h-3 w-3 text-primary"/> Preview
                    </button>
                    <button onClick={() => setIsAiModalOpen(false)} className="p-1 rounded-full hover:bg-secondary text-muted-foreground">
                      <X className="h-4 w-4"/>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/20 p-4 space-y-3">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-primary"/> Branching rules to be set:
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 text-xs font-bold">
                      <span>If 1 is A</span>
                      <span className="text-primary font-mono">Go to 2</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 text-xs font-bold">
                      <span>If 1 is B</span>
                      <span className="text-primary font-mono">Go to 6</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 text-xs font-bold">
                      <span>If 1 is C</span>
                      <span className="text-primary font-mono">Go to 10</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 flex justify-end">
                <Button onClick={() => setIsAiModalOpen(false)} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs px-6 h-9">
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}
