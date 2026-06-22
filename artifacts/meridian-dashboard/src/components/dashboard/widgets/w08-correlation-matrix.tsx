import { useState } from "react";
import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetCorrelationMatrix } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CorrelationMatrixWidget() {
  const [lookback, setLookback] = useState("60");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetCorrelationMatrix({ lookback: parseInt(lookback), limit: 8 }, { query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer title="Correlation Matrix" lastUpdated={data?.lastUpdated} isStale={data?.isStale}>
      <div className="flex flex-col h-full gap-2">
        <div className="flex items-center justify-end">
          <Select value={lookback} onValueChange={setLookback}>
            <SelectTrigger className="w-[90px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="60">60 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="252">252 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0 overflow-auto">
          {isLoading || !data ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <div className="grid h-full w-full" style={{ gridTemplateColumns: `auto repeat(${data.assets.length}, 1fr)` }}>
              {/* Header row */}
              <div className="p-1"></div>
              {data.assets.map(asset => (
                <div key={`header-${asset}`} className="text-[10px] font-mono font-bold text-center rotate-[-45deg] origin-bottom-left flex items-end justify-start h-8">
                  {asset.substring(0, 5)}
                </div>
              ))}
              
              {/* Data rows */}
              {data.assets.map((rowAsset, i) => (
                <div key={`row-${rowAsset}`} className="contents">
                  <div className="text-[10px] font-mono font-bold flex items-center justify-end pr-2 h-full">
                    {rowAsset.substring(0, 5)}
                  </div>
                  {data.matrix[i].map((val, j) => (
                    <Tooltip key={`cell-${i}-${j}`}>
                      <TooltipTrigger asChild>
                        <div 
                          className="m-0.5 rounded-sm transition-colors border border-black/10 dark:border-white/10"
                          style={{ backgroundColor: getCorrelationColor(val) }}
                        >
                           <div className="w-full h-full min-h-[20px] min-w-[20px]"></div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="font-mono text-xs">
                        {rowAsset} vs {data.assets[j]}: {val.toFixed(2)}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="h-4 flex items-center justify-center gap-1 text-[10px] font-mono text-muted-foreground mt-2 shrink-0">
          <span>-1.0</span>
          <div className="h-2 w-24 rounded bg-gradient-to-r from-blue-500 via-white dark:via-gray-600 to-red-500" />
          <span>1.0</span>
        </div>
      </div>
    </WidgetContainer>
  );
}

function getCorrelationColor(value: number) {
  // Diverging color scale: blue (-1) -> white/gray (0) -> red (+1)
  if (value === 1) return 'rgb(239, 68, 68)'; // Tailwind red-500
  if (value > 0) return `rgba(239, 68, 68, ${value * 0.8 + 0.2})`;
  if (value < 0) return `rgba(59, 130, 246, ${Math.abs(value) * 0.8 + 0.2})`; // Tailwind blue-500
  return 'rgba(156, 163, 175, 0.2)'; // Neutral gray
}
