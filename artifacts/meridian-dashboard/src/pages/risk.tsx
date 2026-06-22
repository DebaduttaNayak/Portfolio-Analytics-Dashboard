import { RiskMetricsWidget } from "@/components/dashboard/widgets/w05-risk-metrics";
import { VarGaugeWidget } from "@/components/dashboard/widgets/w06-var-gauge";
import { DrawdownChartWidget } from "@/components/dashboard/widgets/w07-drawdown-chart";
import { CorrelationMatrixWidget } from "@/components/dashboard/widgets/w08-correlation-matrix";
import { StressTestsWidget } from "@/components/dashboard/widgets/w11-stress-tests";

export default function Risk() {
  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Risk Analysis</h1>
        <p className="text-sm text-muted-foreground">Portfolio risk metrics, VaR, drawdowns, and stress scenarios</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-5 min-h-[340px]">
          <RiskMetricsWidget />
        </div>
        <div className="col-span-12 md:col-span-7 min-h-[340px]">
          <VarGaugeWidget />
        </div>
        <div className="col-span-12 md:col-span-7 min-h-[340px]">
          <DrawdownChartWidget />
        </div>
        <div className="col-span-12 md:col-span-5 min-h-[340px]">
          <StressTestsWidget />
        </div>
        <div className="col-span-12 min-h-[380px]">
          <CorrelationMatrixWidget />
        </div>
      </div>
    </div>
  );
}
