import { Handle, Position } from '@xyflow/react';
import { Edit3, Sparkles } from 'lucide-react';
export function QuestionFlowNode(props) {
    const data = props.data;
    const node = data.node;
    const isStart = node.isStart || node.level === 1;
    return (<div className={`relative w-72 rounded-2xl border p-4 shadow-lg transition-all duration-200 ${data.isHighlighted
            ? 'border-[#6366F1] dark:border-[#818CF8] bg-[#EEF2FF] dark:bg-indigo-950/40 ring-2 ring-[#6366F1]/30 shadow-indigo-500/10 scale-[1.02]'
            : 'border-[#E2E8F0] dark:border-[#334155] bg-card hover:border-[#6366F1]/60 dark:hover:border-[#818CF8]/60'}`}>
      {/* Target Handle for Incoming Connections */}
      {!isStart && (<Handle type="target" position={Position.Left} className="!h-3.5 !w-3.5 !bg-[#6366F1] dark:!bg-[#818CF8] !border-2 !border-background shadow-xs"/>)}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] font-bold text-[#6366F1] dark:text-[#818CF8]">
            L{node.level} • {node.id}
          </span>
          {isStart && (<span className="rounded bg-[#EEF2FF] dark:bg-indigo-950 text-[#6366F1] dark:text-[#818CF8] px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="h-2.5 w-2.5"/> START
            </span>)}
        </div>

        {data.onEditNode && (<button onClick={() => data.onEditNode?.(node.id)} className="p-1 rounded text-[#64748B] dark:text-[#94A3B8] hover:text-[#6366F1] hover:bg-[#EEF2FF] dark:hover:bg-indigo-950 transition-colors" aria-label="Quick Edit Question">
            <Edit3 className="h-3.5 w-3.5"/>
          </button>)}
      </div>

      {/* Question Title */}
      <h3 className="text-sm font-bold text-foreground font-serif leading-snug mb-3">
        {node.questionText}
      </h3>

      {/* Choice Options List with Individual Source Connection Handles */}
      <div className="space-y-2">
        {node.options.map((opt, i) => (<div key={opt.id || i} className="relative flex items-center justify-between p-2 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-card text-xs font-semibold text-foreground">
            <div className="flex items-center gap-2 truncate">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#EEF2FF] dark:bg-indigo-950 text-[#6366F1] dark:text-[#818CF8] font-mono text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="truncate">{opt.optionText}</span>
            </div>

            {/* Source Handle for Edge Branching */}
            <Handle type="source" position={Position.Right} id={opt.id || `opt_${node.id}_${i}`} className="!h-3 !w-3 !bg-[#6366F1] dark:!bg-[#818CF8] !border-2 !border-background shadow-xs -right-1.5"/>
          </div>))}
      </div>
    </div>);
}
