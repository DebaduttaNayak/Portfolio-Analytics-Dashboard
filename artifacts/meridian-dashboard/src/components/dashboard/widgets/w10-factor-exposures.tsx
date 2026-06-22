import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetFactorExposures } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/formatters";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine
} from "recharts";

export function FactorExposuresWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetFactorExposures({ query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer title="Factor Exposures">
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          {isLoading || !data ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  domain={[-2, 2]}
                />
                <YAxis 
                  dataKey="factor" 
                  type="category" 
                  tick={{ fontSize: 10, fill: "hsl(var(--foreground))", fontWeight: "bold" }}
                  stroke="hsl(var(--border))"
                  width={40}
                />
                <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-card border border-border p-2 rounded shadow-lg text-xs font-mono">
                          <p className="font-bold mb-1">{d.factor} Factor</p>
                          <div className="flex flex-col gap-1">
                             <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">Beta:</span>
                                <span className={d.exposure > 0 ? "text-chart-up" : "text-chart-down"}>
                                  {formatNumber(d.exposure, 2)}
                                </span>
                             </div>
                             <div className="flex justify-between gap-4">
                                <span className="text-muted-foreground">t-stat:</span>
                                <span>{formatNumber(d.tstat, 2)}</span>
                             </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="exposure" radius={[0, 4, 4, 0]} barSize={20}>
                   {data.map((entry, index) => (
                     <Cell 
                        key={`cell-${index}`} 
                        fill={entry.exposure > 0 ? "hsl(var(--chart-up))" : "hsl(var(--chart-down))"} 
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
