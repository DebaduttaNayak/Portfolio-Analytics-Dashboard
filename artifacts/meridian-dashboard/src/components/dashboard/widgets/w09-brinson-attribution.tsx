import { useState } from "react";
import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetBrinsonAttribution } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercent } from "@/lib/formatters";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BrinsonAttributionWidget() {
  const [period, setPeriod] = useState("1Y");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetBrinsonAttribution({ period }, { query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer title="Performance Attribution" lastUpdated={data?.lastUpdated} isStale={data?.isStale}>
      <div className="flex flex-col h-full gap-2">
        <div className="flex items-center justify-between">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[80px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="YTD">YTD</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
            </SelectContent>
          </Select>
          {data && (
            <div className="text-xs font-mono font-medium flex gap-4">
              <span className={data.totalActiveReturn > 0 ? "text-chart-up" : "text-chart-down"}>
                Active: {formatPercent(data.totalActiveReturn)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0">
          {isLoading || !data ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sectors} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="sector" 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                  tickFormatter={(val) => `${val}%`} 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-2 rounded shadow-lg text-xs font-mono">
                          <p className="font-bold mb-1">{label}</p>
                          {payload.map((p, i) => (
                             <div key={i} className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-muted-foreground w-20">{p.name}:</span>
                                <span className={p.value as number > 0 ? "text-chart-up" : "text-chart-down"}>
                                  {formatPercent(p.value as number)}
                                </span>
                             </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="allocationEffect" name="Allocation" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="selectionEffect" name="Selection" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="interactionEffect" name="Interaction" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </WidgetContainer>
  );
}
