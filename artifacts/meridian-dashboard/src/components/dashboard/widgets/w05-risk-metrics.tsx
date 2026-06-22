import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetRiskMetrics } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatPercent } from "@/lib/formatters";

export function RiskMetricsWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetRiskMetrics({ query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer title="Risk Panel" lastUpdated={data?.lastUpdated} isStale={data?.isStale}>
      {isLoading || !data ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 h-full overflow-y-auto content-start pr-1">
          <MetricBox label="Sharpe" value={formatNumber(data.sharpeRatio, 2)} good={data.sharpeRatio > 1} bad={data.sharpeRatio < 0.5} />
          <MetricBox label="Sortino" value={formatNumber(data.sortinoRatio, 2)} good={data.sortinoRatio > 1.5} bad={data.sortinoRatio < 1} />
          <MetricBox label="Calmar" value={formatNumber(data.calmarRatio, 2)} good={data.calmarRatio > 1} bad={data.calmarRatio < 0.5} />
          
          <MetricBox label="Beta" value={formatNumber(data.beta, 2)} />
          <MetricBox label="Alpha" value={formatPercent(data.alpha)} good={data.alpha > 0} bad={data.alpha < 0} />
          <MetricBox label="R²" value={formatNumber(data.rsquared, 2)} />
          
          <MetricBox label="Track Err" value={formatPercent(data.trackingError)} />
          <MetricBox label="Info Ratio" value={formatNumber(data.informationRatio, 2)} good={data.informationRatio > 0.5} bad={data.informationRatio < 0} />
          <MetricBox label="30D Vol" value={formatPercent(data.volatility30D)} />
        </div>
      )}
    </WidgetContainer>
  );
}

function MetricBox({ label, value, good, bad }: any) {
  return (
    <div className={`p-2 rounded border bg-secondary/30 flex flex-col justify-center ${
      good ? "border-chart-up/30 bg-chart-up/5" : 
      bad ? "border-chart-down/30 bg-chart-down/5" : 
      "border-border"
    }`}>
      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{label}</span>
      <span className={`text-lg font-mono font-bold ${
        good ? "text-chart-up" : 
        bad ? "text-chart-down" : 
        "text-foreground"
      }`}>
        {value}
      </span>
    </div>
  );
}
