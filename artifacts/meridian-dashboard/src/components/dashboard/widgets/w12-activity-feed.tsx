import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetActivityFeed } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, AlertTriangle, ArrowRightLeft, Bell, Info } from "lucide-react";
import { format } from "date-fns";

export function ActivityFeedWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetActivityFeed({ limit: 20 }, { query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer title="Activity Feed">
      {isLoading || !data ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ScrollArea className="h-full pr-3">
          <div className="space-y-3 pb-2">
            {data.map((item) => (
              <div key={item.id} className="flex gap-3 text-sm border-b border-border/40 pb-2 last:border-0">
                <div className="shrink-0 mt-0.5">
                  {getIconForType(item.type, item.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${getColorForSeverity(item.severity)}`}>
                      {item.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {format(new Date(item.timestamp), "HH:mm:ss")}
                    </span>
                    {item.ticker && (
                      <span className="text-[10px] px-1 bg-secondary rounded text-secondary-foreground font-mono">
                        {item.ticker}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground leading-snug">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </WidgetContainer>
  );
}

function getIconForType(type: string, severity: string) {
  const colorClass = getColorForSeverity(severity);
  switch (type) {
    case "TRADE":
    case "REBALANCE":
      return <ArrowRightLeft size={14} className={colorClass} />;
    case "THRESHOLD":
      return <AlertTriangle size={14} className={colorClass} />;
    case "ALERT":
    case "COMPLIANCE":
      return severity === "critical" ? <AlertCircle size={14} className={colorClass} /> : <Bell size={14} className={colorClass} />;
    default:
      return <Info size={14} className={colorClass} />;
  }
}

function getColorForSeverity(severity: string) {
  switch (severity) {
    case "critical": return "text-destructive";
    case "warning": return "text-yellow-500";
    case "info":
    default: return "text-primary";
  }
}
