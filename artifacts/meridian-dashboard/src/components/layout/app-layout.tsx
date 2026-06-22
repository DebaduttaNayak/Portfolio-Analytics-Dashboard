import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  PieChart, 
  ShieldAlert, 
  TrendingUp, 
  Settings as SettingsIcon,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "./theme-selector";
import { useGetPortfolioSummary } from "@workspace/api-client-react";
import { formatCompactCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [location] = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: summary, isLoading } = useGetPortfolioSummary({ query: { refetchInterval: 15000 } as any });

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/holdings", icon: PieChart, label: "Holdings" },
    { href: "/risk", icon: ShieldAlert, label: "Risk Analysis" },
    { href: "/attribution", icon: TrendingUp, label: "Attribution" },
    { href: "/settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 z-20",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
          {sidebarOpen && (
            <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <span className="text-primary">M &middot; C</span>
              <span>MERIDIAN</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-sidebar-accent rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border shrink-0">
          {sidebarOpen ? (
            <div className="text-xs text-sidebar-foreground/50">
              Meridian Capital LLC<br/>
              Institutional Analytics
            </div>
          ) : (
            <div className="text-xs text-sidebar-foreground/50 text-center font-bold text-primary">
              MC
            </div>
          )}
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            {!sidebarOpen && (
              <div className="flex items-center gap-2 font-bold tracking-tight text-primary">
                M &middot; C
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground uppercase tracking-wider text-xs font-semibold">Total AUM</span>
              {isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : summary ? (
                <span className="font-mono font-bold text-foreground">
                  {formatCompactCurrency(summary.aum * 1_000_000_000)}
                </span>
              ) : (
                <span className="font-mono font-bold text-foreground">-</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {summary?.lastUpdated && (
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", summary.isStale ? "bg-yellow-400" : "bg-primary")}></span>
                  <span className={cn("relative inline-flex rounded-full h-2 w-2", summary.isStale ? "bg-yellow-500" : "bg-primary")}></span>
                </span>
                {new Date(summary.lastUpdated).toLocaleTimeString()}
              </div>
            )}
            
            <ThemeSelector />
            
            <div className="h-8 w-8 rounded-full flex items-center justify-center border border-border text-sm font-medium bg-[#2d3853]">DN</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
