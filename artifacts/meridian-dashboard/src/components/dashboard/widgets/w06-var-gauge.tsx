import { useState } from "react";
import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetValueAtRisk } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactCurrency, formatPercent } from "@/lib/formatters";
import { ResponsiveContainer, BarChart, Bar, Cell, Tooltip as RechartsTooltip, XAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function VarGaugeWidget() {
  const [confidence, setConfidence] = useState("0.95");
  const [horizon, setHorizon] = useState("1D");
  const [method, setMethod] = useState("historical");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetValueAtRisk({ confidence, horizon, method }, { query: { refetchInterval: 15000 } as any });

  // Prepare histogram data
  const histData = data?.returnDistribution ? processHistogram(data.returnDistribution) : [];
  
  return (
    <WidgetContainer title="Value at Risk (VaR)" lastUpdated={data?.lastUpdated} isStale={data?.isStale}>
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between">
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger className="w-[70px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1D</SelectItem>
              <SelectItem value="5D">5D</SelectItem>
              <SelectItem value="10D">10D</SelectItem>
              <SelectItem value="1M">1M</SelectItem>
            </SelectContent>
          </Select>
          
          <ToggleGroup type="single" value={confidence} onValueChange={(v) => v && setConfidence(v)} className="h-7">
            <ToggleGroupItem value="0.90" className="h-7 px-2 text-xs">90%</ToggleGroupItem>
            <ToggleGroupItem value="0.95" className="h-7 px-2 text-xs">95%</ToggleGroupItem>
            <ToggleGroupItem value="0.99" className="h-7 px-2 text-xs">99%</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {isLoading || !data ? (
            <Skeleton className="w-48 h-24" />
          ) : (
            <div className="text-center">
              <span className="text-3xl font-mono font-bold text-chart-down">
                {formatCompactCurrency(data.var95 * 1000000)}
              </span>
              <div className="text-xs text-muted-foreground mt-1 uppercase font-bold tracking-wider">
                Expected Loss ({formatPercent(data.varPct95)})
              </div>
            </div>
          )}
        </div>

        <div className="h-24 w-full">
          {isLoading || !histData.length ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="bin" hide />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border p-1.5 rounded shadow text-[10px] font-mono">
                          Return: {payload[0].payload.bin}
                          <br />
                          Freq: {payload[0].value}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" isAnimationActive={false}>
                  {histData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={parseFloat(entry.bin) <= -(data?.varPct95 ?? 0) * 100 ? "hsl(var(--chart-down))" : "hsl(var(--primary))"} 
                      fillOpacity={parseFloat(entry.bin) <= -(data?.varPct95 ?? 0) * 100 ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </WidgetContainer>
  );
}

// Simple binning for histogram
function processHistogram(returns: number[], binsCount = 40) {
  if (!returns.length) return [];
  const min = Math.min(...returns);
  const max = Math.max(...returns);
  const binWidth = (max - min) / binsCount;
  
  const bins = Array(binsCount).fill(0);
  returns.forEach(r => {
    let binIndex = Math.floor((r - min) / binWidth);
    if (binIndex >= binsCount) binIndex = binsCount - 1;
    bins[binIndex]++;
  });

  return bins.map((count, i) => ({
    bin: (min + i * binWidth).toFixed(2) + "%",
    count
  }));
}
