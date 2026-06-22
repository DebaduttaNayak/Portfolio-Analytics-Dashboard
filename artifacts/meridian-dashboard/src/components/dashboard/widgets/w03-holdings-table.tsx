import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetHoldings } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HoldingsWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetHoldings(undefined, { query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer 
      title="Top Holdings" 
      lastUpdated={data?.[0]?.isStale ? undefined : new Date().toISOString()} // Approximate for now
      onFullscreen={() => {}}
    >
      {isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-xs py-2 h-auto text-muted-foreground w-[80px]">TICKER</TableHead>
                <TableHead className="text-xs py-2 h-auto text-muted-foreground">ASSET CLASS</TableHead>
                <TableHead className="text-xs py-2 h-auto text-muted-foreground text-right">WEIGHT</TableHead>
                <TableHead className="text-xs py-2 h-auto text-muted-foreground text-right">MKT VAL</TableHead>
                <TableHead className="text-xs py-2 h-auto text-muted-foreground text-right">1D P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 15).map((holding) => (
                <TableRow key={holding.ticker} className="border-b border-border/50 hover:bg-secondary/20">
                  <TableCell className="py-1.5 text-xs font-mono font-bold text-foreground">
                    {holding.ticker}
                  </TableCell>
                  <TableCell className="py-1.5 text-xs text-muted-foreground">
                    {holding.assetClass}
                  </TableCell>
                  <TableCell className="py-1.5 text-xs font-mono text-right">
                    {formatPercent(holding.weight * 100)}
                  </TableCell>
                  <TableCell className="py-1.5 text-xs font-mono text-right">
                    {formatCurrency(holding.marketValue)}
                  </TableCell>
                  <TableCell className={`py-1.5 text-xs font-mono text-right ${holding.dayReturnPct > 0 ? "text-chart-up" : holding.dayReturnPct < 0 ? "text-chart-down" : ""}`}>
                    {holding.dayReturnPct > 0 ? "+" : ""}{formatPercent(holding.dayReturnPct)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </WidgetContainer>
  );
}
