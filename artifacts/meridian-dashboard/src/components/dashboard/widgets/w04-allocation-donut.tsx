import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetSectorAllocation, useGetAssetClassAllocation } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { formatPercent } from "@/lib/formatters";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
];

export function AllocationWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sectors, isLoading: isLoadingSectors } = useGetSectorAllocation({ query: { refetchInterval: 15000 } as any });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: assets, isLoading: isLoadingAssets } = useGetAssetClassAllocation({ query: { refetchInterval: 15000 } as any });

  const isLoading = isLoadingSectors || isLoadingAssets;

  return (
    <WidgetContainer title="Allocation">
      {isLoading || !sectors || !assets ? (
        <div className="flex h-full items-center justify-around">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      ) : (
        <div className="flex h-full">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Asset Class</span>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assets}
                    dataKey="weight"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {assets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-px bg-border my-4 mx-2" />
          <div className="flex-1 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-2">Sector</span>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectors}
                    dataKey="weight"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={2}
                    stroke="none"
                  >
                    {sectors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </WidgetContainer>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border p-2 rounded shadow-lg text-xs">
        <p className="font-bold mb-1">{data.name}</p>
        <div className="flex justify-between gap-4 font-mono">
          <span className="text-muted-foreground">Weight:</span>
          <span>{formatPercent(data.weight)}</span>
        </div>
        <div className="flex justify-between gap-4 font-mono">
          <span className="text-muted-foreground">Active:</span>
          <span className={data.activeWeight > 0 ? "text-chart-up" : data.activeWeight < 0 ? "text-chart-down" : ""}>
            {data.activeWeight > 0 ? "+" : ""}{formatPercent(data.activeWeight)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};
