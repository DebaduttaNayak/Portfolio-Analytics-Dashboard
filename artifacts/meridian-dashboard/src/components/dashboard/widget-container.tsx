import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Maximize2, Settings as SettingsIcon, X } from "lucide-react";

interface WidgetContainerProps {
  title: string;
  lastUpdated?: string;
  isStale?: boolean;
  onRemove?: () => void;
  onSettings?: () => void;
  onFullscreen?: () => void;
  children: ReactNode;
  className?: string;
}

export function WidgetContainer({
  title,
  lastUpdated,
  isStale,
  onRemove,
  onSettings,
  onFullscreen,
  children,
  className
}: WidgetContainerProps) {
  return (
    <div className={cn(
      "flex flex-col h-full w-full bg-card border rounded-md shadow-sm overflow-hidden group",
      isStale ? "border-yellow-500/50" : "border-card-border",
      className
    )}>
      {/* Title Bar - Drag Handle */}
      <div className="h-10 px-3 bg-secondary/30 border-b border-card-border flex items-center justify-between shrink-0 cursor-move widget-drag-handle">
        <div className="flex items-center gap-2 overflow-hidden">
          <h3 className="text-sm font-semibold uppercase tracking-wider truncate text-card-foreground">
            {title}
          </h3>
          {isStale && (
            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0" title="Data is older than expected">
              ⚠️ Stale
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {lastUpdated && (
            <span className="text-[10px] text-muted-foreground mr-2 font-mono hidden sm:inline-block">
              {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
          {onSettings && (
            <button onClick={onSettings} className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground cursor-pointer">
              <SettingsIcon size={14} />
            </button>
          )}
          {onFullscreen && (
            <button onClick={onFullscreen} className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground cursor-pointer">
              <Maximize2 size={14} />
            </button>
          )}
          {onRemove && (
            <button onClick={onRemove} className="p-1 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive cursor-pointer">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-3 relative bg-card">
        {children}
      </div>
    </div>
  );
}
