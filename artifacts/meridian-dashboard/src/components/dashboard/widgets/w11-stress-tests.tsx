import { WidgetContainer } from "@/components/dashboard/widget-container";
import { useGetStressTests } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactCurrency, formatPercent } from "@/lib/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function StressTestsWidget() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useGetStressTests({ query: { refetchInterval: 15000 } as any });

  return (
    <WidgetContainer title="Stress Test Scenarios">
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
                <TableHead className="text-xs py-2 h-auto text-muted-foreground">SCENARIO</TableHead>
                <TableHead className="text-xs py-2 h-auto text-muted-foreground">TYPE</TableHead>
                <TableHead className="text-xs py-2 h-auto text-muted-foreground text-right">EST LOSS ($)</TableHead>
                <TableHead className="text-xs py-2 h-auto text-muted-foreground text-right">IMPACT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((scenario) => {
                // Determine opacity based on loss magnitude (relative to 10% max for visual scale)
                const opacity = Math.min(Math.abs(scenario.estimatedLossPct) / 10, 1);
                
                return (
                  <TableRow key={scenario.name} className="border-b border-border/50 hover:bg-secondary/20">
                    <TableCell className="py-1.5">
                       <div className="flex items-center gap-1.5">
                         <span className="text-xs font-semibold text-foreground truncate max-w-[120px]" title={scenario.name}>
                           {scenario.name}
                         </span>
                         <Tooltip>
                           <TooltipTrigger>
                             <Info size={12} className="text-muted-foreground" />
                           </TooltipTrigger>
                           <TooltipContent className="max-w-[200px] text-xs">
                             {scenario.description}
                           </TooltipContent>
                         </Tooltip>
                       </div>
                    </TableCell>
                    <TableCell className="py-1.5 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      {scenario.category}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs font-mono text-right text-chart-down font-medium">
                      {formatCompactCurrency(scenario.estimatedLoss * 1000000)}
                    </TableCell>
                    <TableCell className="py-1.5 text-xs font-mono text-right">
                       <div className="flex items-center justify-end gap-2">
                         <span className="text-chart-down font-bold">{formatPercent(scenario.estimatedLossPct)}</span>
                         <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: `rgba(239, 68, 68, ${opacity})` }} />
                       </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </WidgetContainer>
  );
}
