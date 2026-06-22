import { useState } from "react";
import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetNavSeries } from "@workspace/api-client-react";
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
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export function NavChartWidget() {
  const [period, setPeriod] = useState("1Y");
  const [benchmark, setBenchmark] = useState("SP500");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetNavSeries({ period, benchmark }, { query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer 
      title="NAV Performance" 
      lastUpdated={data?.lastUpdated} 
      isStale={data?.isStale}
      onSettings={() => {}}
    >
      <div className="flex flex-col h-full gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[80px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1M">1M</SelectItem>
                <SelectItem value="3M">3M</SelectItem>
                <SelectItem value="6M">6M</SelectItem>
                <SelectItem value="YTD">YTD</SelectItem>
                <SelectItem value="1Y">1Y</SelectItem>
                <SelectItem value="3Y">3Y</SelectItem>
                <SelectItem value="5Y">5Y</SelectItem>
              </SelectContent>
            </Select>
            <Select value={benchmark} onValueChange={setBenchmark}>
              <SelectTrigger className="w-[120px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SP500">S&P 500</SelectItem>
                <SelectItem value="NIFTY50">NIFTY 50</SelectItem>
                <SelectItem value="MSCI_WORLD">MSCI World</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {data && (
            <div className="text-xs font-mono font-medium flex gap-4">
              <span className="text-primary">Port: {formatPercent(data.series[data.series.length - 1]?.portfolioReturn || 0)}</span>
              <span className="text-muted-foreground">BM: {formatPercent(data.series[data.series.length - 1]?.benchmarkReturn || 0)}</span>
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
                  <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => format(new Date(val), "MMM d")} 
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
                <RechartsTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-2 rounded shadow-lg text-xs font-mono">
                          <p className="text-muted-foreground mb-1">{format(new Date(label), "MMM d, yyyy")}</p>
                          <p className="text-primary font-bold">Portfolio: {formatPercent(payload[0].value as number)}</p>
                          <p className="text-muted-foreground">Benchmark: {formatPercent(payload[1].value as number)}</p>
                          <div className="mt-1 pt-1 border-t border-border">
                            <span className={(payload[0].value as number) > (payload[1].value as number) ? "text-chart-up" : "text-chart-down"}>
                              Diff: {formatPercent((payload[0].value as number) - (payload[1].value as number))}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolioReturn" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorPort)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="benchmarkReturn" 
                  stroke="hsl(var(--muted-foreground))" 
                  fillOpacity={1} 
                  fill="url(#colorBm)" 
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </WidgetContainer>
  );
}
