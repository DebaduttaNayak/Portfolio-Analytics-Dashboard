import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const THEMES = [
  {
    id: "meridian",
    label: "Meridian",
    description: "Deep forest green — the default institutional palette",
    accent: "#10b981",
    bg: "#0a1f14",
    card: "#0d2b1a",
  },
  {
    id: "bloomberg",
    label: "Bloomberg Terminal",
    description: "High-contrast orange on black — inspired by the classic terminal",
    accent: "#f97316",
    bg: "#0a0a0a",
    card: "#141414",
  },
  {
    id: "refinitiv",
    label: "Refinitiv / LSEG",
    description: "Teal and slate — clean Refinitiv Eikon style",
    accent: "#06b6d4",
    bg: "#0c1a24",
    card: "#112233",
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Rich indigo on near-black — elegant dark mode",
    accent: "#818cf8",
    bg: "#0d0f1a",
    card: "#13162b",
  },
  {
    id: "arctic",
    label: "Arctic",
    description: "Icy cyan on charcoal — crisp and modern",
    accent: "#22d3ee",
    bg: "#0a1520",
    card: "#0f1f2e",
  },
] as const;

const DATA_DISPLAY = [
  { label: "Currency", value: "USD" },
  { label: "Number format", value: "1,234,567.89" },
  { label: "Date format", value: "DD MMM YYYY" },
  { label: "Timezone", value: "UTC+5:30 (IST)" },
];

const RISK_PREFS = [
  { label: "Default VaR confidence", value: "95%" },
  { label: "Default VaR horizon", value: "1 Day" },
  { label: "Benchmark", value: "NIFTY 50" },
  { label: "Fiscal year end", value: "March 31" },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">Settings</h1>
        <p className="text-sm text-muted-foreground">Theme, display preferences, and platform configuration</p>
      </div>

      {/* Theme Selector */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Visual Theme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as typeof theme)}
              className={cn(
                "relative text-left rounded-lg border p-4 transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                theme === t.id
                  ? "border-primary ring-1 ring-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              {/* Color preview */}
              <div
                className="h-16 rounded-md mb-3 flex items-center justify-center gap-1 overflow-hidden"
                style={{ background: t.bg }}
              >
                <div className="h-8 w-8 rounded-full" style={{ background: t.card, border: `2px solid ${t.accent}` }} />
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-12 rounded-full" style={{ background: t.accent, opacity: 0.9 }} />
                  <div className="h-1.5 w-8 rounded-full" style={{ background: t.accent, opacity: 0.4 }} />
                  <div className="h-1.5 w-10 rounded-full" style={{ background: t.accent, opacity: 0.2 }} />
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{t.description}</p>
                </div>
                {theme === t.id && (
                  <span className="shrink-0 mt-0.5">
                    <Check size={16} className="text-primary" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Data Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Data Display</h2>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {DATA_DISPLAY.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-mono font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Risk Preferences</h2>
          <div className="bg-card border border-border rounded-lg divide-y divide-border">
            {RISK_PREFS.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-mono font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Platform info */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Platform</h2>
        <div className="bg-card border border-border rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Version", value: "2.4.1" },
            { label: "Data refresh", value: "15s" },
            { label: "Widgets", value: "12" },
            { label: "Status", value: "● Live" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
              <span className={cn("text-sm font-mono font-semibold", item.label === "Status" && "text-primary")}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
