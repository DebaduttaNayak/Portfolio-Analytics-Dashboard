import { HoldingsWidget } from "@/components/dashboard/widgets/w03-holdings-table";
import { PortfolioSummaryWidget } from "@/components/dashboard/widgets/w01-portfolio-summary";

export default function Holdings() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Holdings</h1>
        <p className="text-sm text-muted-foreground">All positions across the portfolio</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="min-h-[180px]">
          <PortfolioSummaryWidget />
        </div>
        <div className="min-h-[500px]">
          <HoldingsWidget />
        </div>
      </div>
    </div>
  );
}
