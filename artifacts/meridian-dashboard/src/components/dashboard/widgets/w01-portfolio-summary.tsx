import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetPortfolioSummary } from "@workspace/api-client-react";
import { formatCompactCurrency, formatPercent, formatNumber } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function PortfolioSummaryWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetPortfolioSummary({ query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer title="Portfolio Summary" lastUpdated={data?.lastUpdated} isStale={data?.isStale}>
      {isLoading || !data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full content-start">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 h-full content-start overflow-y-auto pr-2">
          <KpiCard label="AUM (USD)" value={formatCompactCurrency(data.aum * 1e9)} change={data.aumChangePct1D} />
          <KpiCard label="Daily P&L" value={formatCompactCurrency(data.aumChange1D * 1e9)} change={data.aumChangePct1D} />
          <KpiCard label="NAV/Unit" value={`$${formatNumber(data.nav, 4)}`} change={data.navChangePct1D} />
          <KpiCard label="YTD Return" value={formatPercent(data.ytdReturn)} />
          <KpiCard label="Sharpe Ratio" value={formatNumber(data.sharpeRatio, 2)} />
          <KpiCard label="Max Drawdown" value={formatPercent(data.maxDrawdown)} isNegativeBad />
          <KpiCard label="Volatility" value={formatPercent(data.volatility)} inverseColors />
          <KpiCard label="Beta" value={formatNumber(data.beta, 2)} />
        </div>
      )}
    </WidgetContainer>
  );
}

function KpiCard({ label, value, change, isNegativeBad = true, inverseColors = false }: any) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-mono font-bold text-foreground">{value}</span>
        {change !== undefined && (
          <span className={`flex items-center text-xs font-mono font-medium ${isPositive ? (inverseColors ? 'text-chart-down' : 'text-chart-up') : isNegative ? (inverseColors ? 'text-chart-up' : 'text-chart-down') : 'text-muted-foreground'}`}>
            {isPositive ? <ArrowUpRight size={12} /> : isNegative ? <ArrowDownRight size={12} /> : null}
            {formatPercent(Math.abs(change))}
          </span>
        )}
      </div>
    </div>
  );
}
