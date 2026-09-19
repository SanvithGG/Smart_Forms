/**
 * RouteLine — a signature visual element rendering a line in --accent-route
 * with small filled-circle "node" markers at evenly spaced stops.
 *
 * The active node is rendered larger + filled; inactive nodes are smaller + outlined.
 * Transitions are limited to simple opacity/scale under 200ms.
 */
export function RouteLine({ direction = 'horizontal', nodes = 3, activeNode = -1, className = '', }) {
    const isHorizontal = direction === 'horizontal';
    return (<div className={`relative flex items-center ${isHorizontal ? 'flex-row w-full' : 'flex-col h-full'} ${className}`}>
      {Array.from({ length: nodes }).map((_, i) => {
            const isActive = i === activeNode;
            const isLast = i === nodes - 1;
            return (<div key={i} className={`flex items-center ${isHorizontal ? 'flex-row' : 'flex-col'} ${isLast ? '' : 'flex-1'}`}>
            {/* Node dot */}
            <div className={`rounded-full shrink-0 transition-all duration-150 ${isActive
                    ? 'w-2.5 h-2.5 bg-accent-route scale-110'
                    : 'w-1.5 h-1.5 border border-accent-route bg-transparent'}`}/>

            {/* Connector line between nodes */}
            {!isLast && (<div className={`bg-accent-route/40 ${isHorizontal ? 'h-px flex-1' : 'w-px flex-1'}`}/>)}
          </div>);
        })}
    </div>);
}
