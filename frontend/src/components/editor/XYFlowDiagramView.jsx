import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, addEdge, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { QuestionFlowNode } from '@/components/editor/QuestionFlowNode';
import { Button } from '@/components/ui/button';
import { GitBranch, Edit3, X, ChevronRight, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';
const nodeTypes = {
    questionNode: QuestionFlowNode,
};
export function XYFlowDiagramView({ form, onUpdateForm, onSelectNodeForEdit, }) {
    const [activeEditNodeId, setActiveEditNodeId] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);
    // Toggle Full Screen (HTML5 Fullscreen API + Overlay)
    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (containerRef.current?.requestFullscreen) {
                containerRef.current.requestFullscreen().catch(() => { });
            }
            setIsFullscreen(true);
        }
        else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
            setIsFullscreen(false);
        }
    };
    // Fullscreen event listener & Escape key listener
    useEffect(() => {
        function handleFullscreenChange() {
            setIsFullscreen(!!document.fullscreenElement);
        }
        function handleKeyDown(e) {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => { });
                }
            }
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen]);
    // Convert SmartForm into XY Flow Nodes & Edges
    const { initialNodes, initialEdges } = useMemo(() => {
        const nodeList = Object.values(form.nodes);
        // Group nodes by Level for automatic XY coordinates
        const level1 = nodeList.filter((n) => n.level === 1 || n.isStart);
        const level2 = nodeList.filter((n) => n.level === 2 && !n.isStart);
        const level3 = nodeList.filter((n) => n.level >= 3);
        const generatedNodes = [];
        const generatedEdges = [];
        // Helper for node position
        const getPos = (level, idx) => {
            if (level === 1)
                return { x: 50, y: 200 + idx * 240 };
            if (level === 2)
                return { x: 420, y: 80 + idx * 240 };
            return { x: 800, y: 50 + idx * 220 };
        };
        // Build Question Nodes
        nodeList.forEach((node) => {
            let levelIdx;
            if (node.level === 1 || node.isStart)
                levelIdx = level1.indexOf(node);
            else if (node.level === 2)
                levelIdx = Math.max(0, level2.indexOf(node));
            else
                levelIdx = Math.max(0, level3.indexOf(node));
            const pos = getPos(node.level, levelIdx);
            generatedNodes.push({
                id: node.id,
                type: 'questionNode',
                position: pos,
                data: {
                    node,
                    onEditNode: (id) => setActiveEditNodeId(id),
                },
            });
            // Build Edges from choice options
            const activeBranchOpts = node.options.filter((opt) => opt.nextQuestionId && form.nodes[opt.nextQuestionId]);
            const isMultiBranch = activeBranchOpts.length > 1;
            node.options.forEach((opt, optIdx) => {
                if (opt.nextQuestionId && form.nodes[opt.nextQuestionId]) {
                    const edgeColor = isMultiBranch && optIdx > 0 ? '#F59E0B' : '#6366F1';
                    generatedEdges.push({
                        id: `e_${node.id}_${opt.id}_${opt.nextQuestionId}`,
                        source: node.id,
                        sourceHandle: opt.id,
                        target: opt.nextQuestionId,
                        type: 'smoothstep',
                        animated: true,
                        style: { stroke: edgeColor, strokeWidth: 2 },
                    });
                }
                else {
                    // Edge to Completion Node
                    generatedEdges.push({
                        id: `e_${node.id}_${opt.id}_complete`,
                        source: node.id,
                        sourceHandle: opt.id,
                        target: 'completion_node',
                        type: 'smoothstep',
                        animated: false,
                        style: { stroke: '#10B981', strokeWidth: 2, strokeDasharray: '4 4' },
                    });
                }
            });
        });
        // Add Completion Node
        generatedNodes.push({
            id: 'completion_node',
            type: 'default',
            position: { x: 1200, y: 300 },
            data: { label: '🏁 Completion State' },
            style: {
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1.5px border rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                color: '#10B981',
                fontWeight: 'bold',
                padding: '12px 20px',
            },
        });
        return { initialNodes: generatedNodes, initialEdges: generatedEdges };
    }, [form]);
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
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
    return (<div ref={containerRef} className={`relative transition-all duration-300 flex flex-col font-sans overflow-hidden ${isFullscreen
            ? 'fixed inset-0 z-[9999] h-screen w-screen bg-background border-none rounded-none p-0 m-0'
            : 'w-full h-[780px] rounded-3xl border border-border bg-card p-4 space-y-4 shadow-sm'}`}>
      {/* Canvas Header Toolbar (Hidden in Video Player Fullscreen Mode) */}
      {!isFullscreen && (<div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3 px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <GitBranch className="h-5 w-5"/>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground font-sans flex items-center gap-2">
                XY Flow Visual Diagram
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-mono font-bold border border-primary/20">
                  @xyflow/react
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Interactive node-based decision flow canvas ({Object.keys(form.nodes).length} question nodes)
              </p>
            </div>
          </div>

          {/* Full Screen Toggle Button */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="rounded-full border-border hover:bg-secondary text-xs font-semibold gap-1.5 px-3.5 h-8">
              <Maximize2 className="h-3.5 w-3.5 text-primary"/> Full Screen
            </Button>
          </div>
        </div>)}

      {/* Floating Exit Button (Visible ONLY in Fullscreen Video Player Mode) */}
      {isFullscreen && (<div className="absolute top-5 right-6 z-50 flex items-center gap-3">
          <button onClick={toggleFullscreen} className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 text-foreground border border-border/80 text-xs font-bold shadow-2xl backdrop-blur-md hover:bg-secondary transition-all hover:scale-105">
            <Minimize2 className="h-4 w-4 text-primary"/>
            Exit Full Screen (Esc)
          </button>
        </div>)}

      {/* ReactFlow Interactive Canvas Container (Edge-to-Edge in Full Screen Mode) */}
      <div className={`flex-1 w-full overflow-hidden relative ${isFullscreen ? 'rounded-none border-none h-full' : 'rounded-2xl border border-border/80 bg-background'}`}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} className="bg-background">
          <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="var(--border)"/>
          <Controls className="!bg-card !border-border !shadow-md !rounded-xl"/>
          <MiniMap className="!bg-card !border-border !rounded-xl !shadow-md" nodeColor={() => 'var(--primary)'}/>
        </ReactFlow>
      </div>

      {/* Quick Edit Node Drawer Modal */}
      {editingNode && (<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
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
                      {Object.values(form.nodes).map((t) => (<option key={t.id} value={t.id}>
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
