import { useState } from "react";
import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetDrawdownSeries } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercent } from "@/lib/formatters";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ReferenceArea
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export function DrawdownChartWidget() {
  const [period, setPeriod] = useState("3Y");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetDrawdownSeries({ period }, { query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer title="Drawdown Profile" lastUpdated={data?.lastUpdated} isStale={data?.isStale}>
      <div className="flex flex-col h-full gap-2">
        <div className="flex items-center justify-between">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[80px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1Y">1Y</SelectItem>
              <SelectItem value="3Y">3Y</SelectItem>
              <SelectItem value="5Y">5Y</SelectItem>
              <SelectItem value="10Y">10Y</SelectItem>
            </SelectContent>
          </Select>
          {data && (
            <div className="text-xs font-mono font-medium flex gap-4">
              <span className="text-chart-down">Max DD: {formatPercent(data.maxDrawdown)}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0">
          {isLoading || !data ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.series} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-down))" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-down))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => format(new Date(val), "MMM yy")} 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  minTickGap={30}
                />
                <YAxis 
                  tickFormatter={(val) => `${val}%`} 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  orientation="right"
                />
                {data.events[0] && (
                   <ReferenceArea 
                      x1={data.events[0].peakDate} 
                      x2={data.events[0].recoveryDate || data.series[data.series.length-1].date} 
                      fill="hsl(var(--destructive))" 
                      fillOpacity={0.1} 
                   />
                )}
                <RechartsTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-2 rounded shadow-lg text-xs font-mono">
                          <p className="text-muted-foreground mb-1">{format(new Date(label), "MMM d, yyyy")}</p>
                          <p className="text-chart-down font-bold">Drawdown: {formatPercent(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="step" 
                  dataKey="drawdown" 
                  stroke="hsl(var(--chart-down))" 
                  fillOpacity={1} 
                  fill="url(#colorDd)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Events Table */}
        {data && data.events.length > 0 && (
          <div className="h-20 shrink-0 mt-2">
             <div className="grid grid-cols-4 gap-2 text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                <div>Peak</div>
                <div>Trough</div>
                <div>Recovery</div>
                <div className="text-right">Magnitude</div>
             </div>
             {data.events.slice(0, 3).map((event, i) => (
               <div key={i} className="grid grid-cols-4 gap-2 text-[10px] font-mono border-b border-border/40 py-1 last:border-0">
                  <div>{format(new Date(event.peakDate), "MM/dd/yy")}</div>
                  <div>{format(new Date(event.troughDate), "MM/dd/yy")}</div>
                  <div>{event.recoveryDate ? format(new Date(event.recoveryDate), "MM/dd/yy") : 'Active'}</div>
                  <div className="text-right text-chart-down font-bold">{formatPercent(event.maxDrawdown)}</div>
               </div>
             ))}
          </div>
        )}
      </div>
    </WidgetContainer>
  );
}
