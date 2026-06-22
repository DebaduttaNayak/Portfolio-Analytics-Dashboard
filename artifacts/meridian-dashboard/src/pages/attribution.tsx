import { BrinsonAttributionWidget } from "@/components/dashboard/widgets/w09-brinson-attribution";
import { FactorExposuresWidget } from "@/components/dashboard/widgets/w10-factor-exposures";
import { AllocationWidget } from "@/components/dashboard/widgets/w04-allocation-donut";

export default function Attribution() {
  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Attribution</h1>
        <p className="text-sm text-muted-foreground">Brinson-Hood-Beebower performance decomposition and factor exposures</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4 min-h-[420px]">
          <AllocationWidget />
        </div>
        <div className="col-span-12 md:col-span-8 min-h-[380px]">
          <BrinsonAttributionWidget />
        </div>
        <div className="col-span-12 min-h-[380px]">
          <FactorExposuresWidget />
        </div>
      </div>
    </div>
  );
}
