import { useState, useRef, useLayoutEffect } from "react";
import { GridLayout, noCompactor } from "react-grid-layout";
import type { LayoutItem } from "react-grid-layout";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, RotateCcw } from "lucide-react";
import { PortfolioSummaryWidget } from "@/components/dashboard/widgets/w01-portfolio-summary";
import { NavChartWidget } from "@/components/dashboard/widgets/w02-nav-chart";
import { HoldingsWidget } from "@/components/dashboard/widgets/w03-holdings-table";
import { AllocationWidget } from "@/components/dashboard/widgets/w04-allocation-donut";
import { RiskMetricsWidget } from "@/components/dashboard/widgets/w05-risk-metrics";
import { VarGaugeWidget } from "@/components/dashboard/widgets/w06-var-gauge";
import { DrawdownChartWidget } from "@/components/dashboard/widgets/w07-drawdown-chart";
import { CorrelationMatrixWidget } from "@/components/dashboard/widgets/w08-correlation-matrix";
import { BrinsonAttributionWidget } from "@/components/dashboard/widgets/w09-brinson-attribution";
import { FactorExposuresWidget } from "@/components/dashboard/widgets/w10-factor-exposures";
import { StressTestsWidget } from "@/components/dashboard/widgets/w11-stress-tests";
import { ActivityFeedWidget } from "@/components/dashboard/widgets/w12-activity-feed";

const COLS = 12;
const ROW_H = 100;
const MARGIN: [number, number] = [12, 12];

const DEFAULT_LAYOUT: LayoutItem[] = [
  { i: "w01", x: 0, y: 0,  w: 12, h: 2, minW: 6, minH: 2 },
  { i: "w02", x: 0, y: 2,  w: 8,  h: 4, minW: 4, minH: 3 },
  { i: "w03", x: 8, y: 2,  w: 4,  h: 4, minW: 3, minH: 3 },
  { i: "w04", x: 0, y: 6,  w: 4,  h: 4, minW: 3, minH: 3 },
  { i: "w05", x: 4, y: 6,  w: 4,  h: 4, minW: 3, minH: 3 },
  { i: "w06", x: 8, y: 6,  w: 4,  h: 4, minW: 3, minH: 3 },
  { i: "w07", x: 0, y: 10, w: 6,  h: 4, minW: 4, minH: 3 },
  { i: "w08", x: 6, y: 10, w: 6,  h: 4, minW: 4, minH: 3 },
  { i: "w09", x: 0, y: 14, w: 6,  h: 4, minW: 4, minH: 3 },
  { i: "w10", x: 6, y: 14, w: 6,  h: 4, minW: 4, minH: 3 },
  { i: "w11", x: 0, y: 18, w: 6,  h: 4, minW: 4, minH: 3 },
  { i: "w12", x: 6, y: 18, w: 6,  h: 4, minW: 4, minH: 3 },
];

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return width;
}

function DashboardGrid({
  isEditMode,
  layout,
  onLayoutChange,
}: {
  isEditMode: boolean;
  layout: LayoutItem[];
  onLayoutChange: (l: LayoutItem[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef);

  return (
    <div ref={containerRef} className="w-full">
      {width > 0 && (
        <GridLayout
          layout={layout}
          width={width}
          gridConfig={{ cols: COLS, rowHeight: ROW_H, margin: MARGIN }}
          dragConfig={{ enabled: isEditMode, handle: ".widget-drag-handle" }}
          resizeConfig={{ enabled: isEditMode }}
          onLayoutChange={(l) => onLayoutChange([...l])}
          compactor={noCompactor}
        >
          <div key="w01"><PortfolioSummaryWidget /></div>
          <div key="w02"><NavChartWidget /></div>
          <div key="w03"><HoldingsWidget /></div>
          <div key="w04"><AllocationWidget /></div>
          <div key="w05"><RiskMetricsWidget /></div>
          <div key="w06"><VarGaugeWidget /></div>
          <div key="w07"><DrawdownChartWidget /></div>
          <div key="w08"><CorrelationMatrixWidget /></div>
          <div key="w09"><BrinsonAttributionWidget /></div>
          <div key="w10"><FactorExposuresWidget /></div>
          <div key="w11"><StressTestsWidget /></div>
          <div key="w12"><ActivityFeedWidget /></div>
        </GridLayout>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<LayoutItem[]>(DEFAULT_LAYOUT);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Workspace</h1>
          <p className="text-sm text-muted-foreground">Main portfolio monitoring view</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <Button variant="outline" size="sm" onClick={() => setLayout(DEFAULT_LAYOUT)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Layout
            </Button>
          )}
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            {isEditMode ? "Done Editing" : "Edit Layout"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <DashboardGrid
          isEditMode={isEditMode}
          layout={layout}
          onLayoutChange={setLayout}
        />
      </div>
    </div>
  );
}
