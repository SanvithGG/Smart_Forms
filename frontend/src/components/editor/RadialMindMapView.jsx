import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { GitBranch, ZoomIn, ZoomOut, Search, Eye, Send, SlidersHorizontal, Maximize2, CheckCircle2, Edit3, X, ChevronRight, ArrowRight } from 'lucide-react';
export function RadialMindMapView({ form, onUpdateForm, onSelectNodeForEdit, onPreviewForm, }) {
    const [zoomScale, setZoomScale] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [activeEditNodeId, setActiveEditNodeId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const containerRef = useRef(null);
    // Mouse Drag to Pan Canvas
    const handleMouseDown = (e) => {
        if (e.target.closest('.mindmap-node-card'))
            return;
        setIsDraggingCanvas(true);
        setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    };
    const handleMouseMove = (e) => {
        if (!isDraggingCanvas)
            return;
        setPanOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };
    const handleMouseUp = () => {
        setIsDraggingCanvas(false);
    };
    const handleAutoLayout = () => {
        setZoomScale(1);
        setPanOffset({ x: 0, y: 0 });
    };
    const handlePublish = () => {
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 3000);
    };
    // Build Radial Layout Node Structure
    const rootNode = form.nodes[form.startQuestionId] || Object.values(form.nodes)[0];
    // Helper to get nodes connected to root choices
    const getSubTree = () => {
        if (!rootNode)
            return [];
        return rootNode.options.map((opt, optIdx) => {
            const childNode = opt.nextQuestionId ? form.nodes[opt.nextQuestionId] : null;
            const grandChildren = childNode
                ? childNode.options.map((grandOpt) => {
                    const grandChildNode = grandOpt.nextQuestionId
                        ? form.nodes[grandOpt.nextQuestionId]
                        : null;
                    return {
                        option: grandOpt,
                        targetNode: grandChildNode,
                    };
                })
                : [];
            return {
                option: opt,
                optionIndex: optIdx,
                childNode,
                grandChildren,
            };
        });
    };
    const subTree = getSubTree();
    // Positions for 4 Cardinal Radial Quadrants:
    // Quadrant 0: Top-Right (Yes, absolutely)
    // Quadrant 1: Bottom-Right (No, not really)
    // Quadrant 2: Bottom-Left (Never tried it)
    // Quadrant 3: Top-Left (Somewhat / Neutral)
    const quadrantOffsets = [
        { x: 340, y: -160, angle: -30 }, // Top-Right
        { x: 340, y: 160, angle: 30 }, // Bottom-Right
        { x: -340, y: 160, angle: 150 }, // Bottom-Left
        { x: -340, y: -160, angle: -150 }, // Top-Left
    ];
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
    return (<div className="relative w-full h-[820px] rounded-3xl border border-border/80 bg-[#0B0B0B] text-foreground overflow-hidden shadow-2xl flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Matte Black Premium Toolbar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0B]/90 backdrop-blur-md px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left Brand & Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-route text-white shadow-md">
            <GitBranch className="h-5 w-5"/>
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-white font-serif flex items-center gap-2">
              SmartForms Radial Canvas
              <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-mono font-bold border border-emerald-500/30">
                Traditional 360 Map
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Interactive 3-level radial mind map canvas • Infinite Pan & Zoom
            </p>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500"/>
          <input type="text" placeholder="Search nodes or choices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-full border border-white/10 bg-zinc-900/80 pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-primary focus:outline-none"/>
        </div>

        {/* Right Canvas Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-zinc-900/80 p-1">
            <button onClick={() => setZoomScale((prev) => Math.max(0.5, prev - 0.1))} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" aria-label="Zoom Out">
              <ZoomOut className="h-3.5 w-3.5"/>
            </button>
            <span className="text-xs font-mono font-bold text-zinc-300 px-2">
              {Math.round(zoomScale * 100)}%
            </span>
            <button onClick={() => setZoomScale((prev) => Math.min(1.5, prev + 0.1))} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" aria-label="Zoom In">
              <ZoomIn className="h-3.5 w-3.5"/>
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={handleAutoLayout} className="rounded-full border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold gap-1.5 h-8">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary"/> Auto Layout
          </Button>

          <Button variant="outline" size="sm" onClick={() => setIsCollapsed((prev) => !prev)} className="rounded-full border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold gap-1.5 h-8">
            <Maximize2 className="h-3.5 w-3.5 text-accent-route"/>
            {isCollapsed ? 'Expand All' : 'Collapse Details'}
          </Button>

          <Button variant="outline" size="sm" onClick={onPreviewForm} className="rounded-full border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-semibold gap-1.5 h-8">
            <Eye className="h-3.5 w-3.5 text-accent-branch"/> Preview
          </Button>

          <Button onClick={handlePublish} className="rounded-full bg-accent-route text-white font-semibold text-xs px-4 h-8 gap-1.5 shadow-lg hover:brightness-110">
            {publishSuccess ? (<>
                <CheckCircle2 className="h-3.5 w-3.5 text-white"/> Published!
              </>) : (<>
                <Send className="h-3.5 w-3.5"/> Publish
              </>)}
          </Button>
        </div>
      </div>

      {/* Infinite Draggable / Zoomable Canvas Area */}
      <div ref={containerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className={`flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden bg-[#0B0B0B] flex items-center justify-center ${isDraggingCanvas ? 'select-none' : ''}`} style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
        }}>
        {/* Transform Layer */}
        <div className="relative w-full h-full flex items-center justify-center transition-transform duration-75" style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
        }}>
          {/* SVG Bezier Connector Curved Lines Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
              <linearGradient id="bezierGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-route)" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="var(--accent-branch)" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="var(--accent-branch)" stopOpacity="0.6"/>
              </linearGradient>
            </defs>

            {/* Render Bezier Paths from Root Center (0, 0) to 4 Cardinal Choice Branch Nodes */}
            {subTree.map((branch, idx) => {
            const offset = quadrantOffsets[idx % 4];
            const isHovered = hoveredNodeId === branch.childNode?.id || hoveredNodeId === rootNode.id;
            // Cubic Bezier curve control points
            const pathD = `M 0 0 C ${offset.x * 0.5} 0, ${offset.x * 0.5} ${offset.y}, ${offset.x} ${offset.y}`;
            return (<g key={branch.option.id}>
                  <path d={pathD} fill="none" stroke={isHovered ? 'url(#bezierGlow)' : 'rgba(255, 255, 255, 0.15)'} strokeWidth={isHovered ? 3 : 1.5} strokeDasharray={isHovered ? 'none' : '4 4'} className="transition-all duration-300"/>

                  {/* Bezier Lines from Level 2 Child Node to Level 3 Grandchildren */}
                  {!isCollapsed && branch.grandChildren.map((grand, gIdx) => {
                    const grandY = offset.y + (gIdx - 1) * 75;
                    const grandX = offset.x + (offset.x > 0 ? 260 : -260);
                    const grandPathD = `M ${offset.x} ${offset.y} C ${offset.x + (offset.x > 0 ? 130 : -130)} ${offset.y}, ${offset.x + (offset.x > 0 ? 130 : -130)} ${grandY}, ${grandX} ${grandY}`;
                    return (<path key={grand.option.id} d={grandPathD} fill="none" stroke={isHovered ? 'rgba(74, 145, 132, 0.6)' : 'rgba(255, 255, 255, 0.1)'} strokeWidth="1.2" className="transition-all duration-300"/>);
                })}
                </g>);
        })}
          </svg>

          {/* RADIAL MIND MAP NODES LAYER */}

          {/* 1. CENTRAL ROOT NODE CARD (Level 1 Center) */}
          <div onMouseEnter={() => setHoveredNodeId(rootNode.id)} onMouseLeave={() => setHoveredNodeId(null)} className="mindmap-node-card absolute z-20 w-80 rounded-2xl border border-white/20 bg-zinc-950/90 backdrop-blur-md p-6 text-center space-y-3 shadow-2xl transition-all duration-300 hover:border-accent-route hover:shadow-accent-route/20 hover:scale-105" style={{ transform: 'translate(-50%, -50%)' }}>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-route text-white font-bold shadow-md">
              ●
            </div>
            <div>
              <span className="rounded-full bg-accent-route/20 text-accent-route border border-accent-route/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
                Root Question • Level 1
              </span>
              <h1 className="text-2xl font-extrabold text-white font-serif mt-2 leading-tight">
                {rootNode.questionText}
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button onClick={() => setActiveEditNodeId(rootNode.id)} className="px-3 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 flex items-center gap-1 transition-colors">
                <Edit3 className="h-3 w-3 text-accent-route"/> Quick Edit
              </button>
            </div>
          </div>

          {/* 2. LEVEL 2 & 3 RADIAL BRANCH NODES */}
          {subTree.map((branch, idx) => {
            const offset = quadrantOffsets[idx % 4];
            const child = branch.childNode;
            const keyChar = String.fromCharCode(65 + idx);
            return (<div key={branch.option.id} className="contents">
                {/* Level 1 Option Choice Pill -> Level 2 Sub-Question Card */}
                <div onMouseEnter={() => setHoveredNodeId(child?.id || null)} onMouseLeave={() => setHoveredNodeId(null)} className="mindmap-node-card absolute z-20 w-72 rounded-2xl border border-white/15 bg-zinc-900/90 backdrop-blur-md p-4 space-y-3 shadow-xl transition-all duration-300 hover:border-primary hover:shadow-primary/20 hover:scale-105" style={{
                    left: `calc(50% + ${offset.x}px)`,
                    top: `calc(50% + ${offset.y}px)`,
                    transform: 'translate(-50%, -50%)',
                }}>
                  {/* Choice Label Badge */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30 font-mono text-xs font-bold">
                      {keyChar}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-300 truncate max-w-[170px]">
                      {branch.option.optionText}
                    </span>
                    {child && (<button onClick={() => setActiveEditNodeId(child.id)} className="p-1 rounded text-zinc-400 hover:text-white" aria-label="Edit Question">
                        <Edit3 className="h-3.5 w-3.5"/>
                      </button>)}
                  </div>

                  {/* Sub-Question Title */}
                  <h3 className="text-sm font-bold text-white font-serif leading-snug">
                    {child ? child.questionText : '🏁 Complete Survey'}
                  </h3>

                  {/* Sub-Options List */}
                  {child && (<div className="space-y-1.5 pt-1">
                      {child.options.map((subOpt, subIdx) => (<div key={subOpt.id || subIdx} className="flex items-center justify-between text-xs p-1.5 rounded-lg border border-white/5 bg-zinc-950/60">
                          <span className="text-zinc-300 font-medium truncate">
                            {subOpt.optionText}
                          </span>
                          <ArrowRight className="h-3 w-3 text-primary shrink-0 opacity-60"/>
                        </div>))}
                    </div>)}
                </div>

                {/* Level 3 Answer Leaf Nodes */}
                {!isCollapsed &&
                    branch.grandChildren.map((grand, gIdx) => {
                        const grandY = offset.y + (gIdx - 1) * 75;
                        const grandX = offset.x + (offset.x > 0 ? 260 : -260);
                        const grandTarget = grand.targetNode;
                        return (<div key={grand.option.id} onMouseEnter={() => setHoveredNodeId(grandTarget?.id || null)} onMouseLeave={() => setHoveredNodeId(null)} className="mindmap-node-card absolute z-10 w-52 rounded-xl border border-white/10 bg-zinc-950/80 backdrop-blur-xs p-3 space-y-1.5 shadow-md transition-all duration-200 hover:border-emerald-400 hover:scale-105" style={{
                                left: `calc(50% + ${grandX}px)`,
                                top: `calc(50% + ${grandY}px)`,
                                transform: 'translate(-50%, -50%)',
                            }}>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 truncate">
                          <span className="h-2 w-2 rounded-full bg-emerald-400"/>
                          <span className="truncate">{grand.option.optionText}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {grandTarget ? grandTarget.questionText : '🏁 Complete'}
                        </p>
                      </div>);
                    })}
              </div>);
        })}
        </div>
      </div>

      {/* Floating Canvas Footer Controls */}
      <div className="absolute bottom-4 left-6 z-30 flex items-center gap-3 text-xs text-zinc-400 bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>
          Click & Drag Canvas to Pan
        </span>
        <span>•</span>
        <span>Scroll / Zoom (+/-)</span>
        <span>•</span>
        <button onClick={handleAutoLayout} className="text-primary font-bold hover:underline">
          Reset Canvas View
        </button>
      </div>

      {/* Quick Edit Node Drawer Modal */}
      {editingNode && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-serif">
                <Edit3 className="h-5 w-5 text-accent-route"/>
                Quick Edit: "{editingNode.questionText.slice(0, 30)}..."
              </h3>
              <button onClick={() => setActiveEditNodeId(null)} className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800">
                <X className="h-5 w-5"/>
              </button>
            </div>

            {/* Edit Question Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Question Text
              </label>
              <textarea rows={2} value={editingNode.questionText} onChange={(e) => handleQuickQuestionTextChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-bold text-white font-serif focus:border-accent-route focus:outline-none"/>
            </div>

            {/* Edit Choice Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Choice Options & Branch Targets
              </label>
              {editingNode.options.map((opt, i) => (<div key={opt.id || i} className="space-y-1.5 p-3 rounded-xl border border-white/10 bg-zinc-900/60">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 border border-white/10 font-mono text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input type="text" value={opt.optionText} onChange={(e) => handleQuickOptionTextChange(i, e.target.value)} className="flex-1 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1 text-xs font-semibold text-white focus:border-accent-route focus:outline-none"/>
                  </div>
                  <div className="flex items-center gap-2 text-xs pt-1">
                    <ArrowRight className="h-3 w-3 text-accent-route shrink-0"/>
                    <select value={opt.nextQuestionId || ''} onChange={(e) => handleQuickOptionNextChange(i, e.target.value)} className="flex-1 rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white focus:border-accent-route focus:outline-none">
                      <option value="">🏁 End Survey (Complete)</option>
                      {Object.values(form.nodes).map((t) => (<option key={t.id} value={t.id}>
                          {t.questionText.slice(0, 35)}...
                        </option>))}
                    </select>
                  </div>
                </div>))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setActiveEditNodeId(null)} className="rounded-full text-xs font-semibold px-4 border-white/10 text-zinc-300 hover:bg-zinc-800">
                Done
              </Button>
              <Button onClick={() => {
                const targetId = activeEditNodeId;
                setActiveEditNodeId(null);
                if (targetId)
                    onSelectNodeForEdit(targetId);
            }} className="rounded-full bg-accent-route text-white text-xs font-semibold px-4 gap-1.5">
                Full Details Editor <ChevronRight className="h-3.5 w-3.5"/>
              </Button>
            </div>
          </div>
        </div>)}
    </div>);
}
