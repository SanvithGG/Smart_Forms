import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
            secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
            destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
            outline: "border-border bg-input/20 text-foreground dark:bg-input/30 [a]:hover:bg-muted [a]:hover:text-muted-foreground",
            ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
            link: "text-primary underline-offset-4 hover:underline",
            live: "bg-accent-branch/10 text-accent-branch border border-accent-branch/20 font-mono font-semibold",
            draft: "bg-muted text-muted-foreground border border-border font-mono font-semibold",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function Badge({ className, variant = "default", render, children, ...props }) {
    if (render) {
        const renderProps = {
            "data-slot": "badge",
            "data-variant": variant,
            className: cn(badgeVariants({ variant }), className),
            ...props,
        };
        return render(renderProps);
    }
    const showDot = variant === "live" || variant === "draft";
    return (<span data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot && (<span className={cn("dot size-1.5 rounded-full shrink-0 inline-block", variant === "live"
                ? "bg-accent-branch"
                : "border border-muted-foreground bg-transparent")}/>)}
      {children}
    </span>);
}
export { Badge, badgeVariants };
