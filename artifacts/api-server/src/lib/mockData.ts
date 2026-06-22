import { subDays, addDays, format, parseISO } from "date-fns";

// ── Deterministic seeded random ───────────────────────────────────────────────
let seed = 42;
export function seededRandom(): number {
  seed = (seed * 1664525 + 1013904223) & 0xffffffff;
  return (seed >>> 0) / 0xffffffff;
}

export function gaussianRandom(mean: number, std: number): number {
  let u = 0, v = 0;
  while (u === 0) u = seededRandom();
  while (v === 0) v = seededRandom();
  return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function resetSeed(s = 42) {
  seed = s;
}

// ── Date helpers ──────────────────────────────────────────────────────────────
export function dateRange(days: number): Date[] {
  const today = new Date();
  return Array.from({ length: days }, (_, i) => subDays(today, days - 1 - i));
}

export function periodToDays(period: string): number {
  const map: Record<string, number> = {
    "1M": 30, "3M": 90, "6M": 180, "1Y": 252, "3Y": 756, "5Y": 1260,
    YTD: new Date().getMonth() * 21 + new Date().getDate(),
    "30": 30, "60": 60, "90": 90, "252": 252,
  };
  return map[period] ?? 252;
}

// ── Sector / Asset class universe ─────────────────────────────────────────────
export const SECTORS = [
  "Technology", "Financials", "Healthcare", "Consumer Discretionary",
  "Energy", "Industrials", "Materials", "Real Estate", "Utilities",
  "Communication Services",
];

export const ASSET_CLASSES = ["Equities", "Fixed Income", "Derivatives", "Alternatives", "Cash"];

// ── Holdings universe ─────────────────────────────────────────────────────────
export const HOLDINGS_UNIVERSE = [
  { ticker: "RELIANCE", name: "Reliance Industries", sector: "Energy", assetClass: "Equities", beta: 1.12 },
  { ticker: "INFY",     name: "Infosys Ltd",          sector: "Technology", assetClass: "Equities", beta: 0.94 },
  { ticker: "TCS",      name: "Tata Consultancy Services", sector: "Technology", assetClass: "Equities", beta: 0.87 },
  { ticker: "HDFCBANK", name: "HDFC Bank",             sector: "Financials", assetClass: "Equities", beta: 1.05 },
  { ticker: "ICICIBANK",name: "ICICI Bank",            sector: "Financials", assetClass: "Equities", beta: 1.18 },
  { ticker: "BHARTIARTL",name: "Bharti Airtel",        sector: "Communication Services", assetClass: "Equities", beta: 0.75 },
  { ticker: "ITC",      name: "ITC Ltd",               sector: "Consumer Discretionary", assetClass: "Equities", beta: 0.62 },
  { ticker: "ASIANPAINT",name: "Asian Paints",         sector: "Materials", assetClass: "Equities", beta: 0.83 },
  { ticker: "MARUTI",   name: "Maruti Suzuki India",   sector: "Consumer Discretionary", assetClass: "Equities", beta: 1.24 },
  { ticker: "AXISBANK", name: "Axis Bank",             sector: "Financials", assetClass: "Equities", beta: 1.31 },
  { ticker: "LT",       name: "Larsen & Toubro",       sector: "Industrials", assetClass: "Equities", beta: 1.08 },
  { ticker: "WIPRO",    name: "Wipro Ltd",             sector: "Technology", assetClass: "Equities", beta: 0.89 },
  { ticker: "HCLTECH",  name: "HCL Technologies",      sector: "Technology", assetClass: "Equities", beta: 0.92 },
  { ticker: "SUNPHARMA",name: "Sun Pharmaceutical",    sector: "Healthcare", assetClass: "Equities", beta: 0.71 },
  { ticker: "DRREDDY",  name: "Dr. Reddy's Laboratories", sector: "Healthcare", assetClass: "Equities", beta: 0.68 },
  { ticker: "IN10Y",    name: "India 10Y G-Sec",       sector: "Fixed Income", assetClass: "Fixed Income", beta: -0.12 },
  { ticker: "IN5Y",     name: "India 5Y G-Sec",        sector: "Fixed Income", assetClass: "Fixed Income", beta: -0.09 },
  { ticker: "NIFTY-CE", name: "NIFTY 50 Call Option",  sector: "Derivatives", assetClass: "Derivatives", beta: 1.45 },
  { ticker: "GOLD-ETF", name: "Gold BeES ETF",         sector: "Alternatives", assetClass: "Alternatives", beta: 0.08 },
  { ticker: "REIT-INV", name: "Embassy Office REIT",   sector: "Real Estate", assetClass: "Alternatives", beta: 0.55 },
];

// ── Portfolio Summary ─────────────────────────────────────────────────────────
export function generatePortfolioSummary(isStale = false) {
  resetSeed(100);
  return {
    aum: 45.23,
    aumChange1D: 0.18,
    aumChangePct1D: 0.40,
    nav: 1847.62,
    navChange1D: 7.42,
    navChangePct1D: 0.40,
    totalReturn: 82.4,
    ytdReturn: 14.7,
    sharpeRatio: 1.68,
    sortinoRatio: 2.14,
    beta: 0.91,
    alpha: 3.2,
    maxDrawdown: -18.4,
    volatility: 12.8,
    cashWeight: 4.2,
    investedWeight: 95.8,
    lastUpdated: isStale
      ? new Date(Date.now() - 40000).toISOString()
      : new Date().toISOString(),
    isStale,
  };
}

// ── Holdings ──────────────────────────────────────────────────────────────────
export function generateHoldings(assetClass?: string, sector?: string) {
  resetSeed(200);
  const weights = [8.2, 7.8, 7.1, 6.9, 6.4, 5.8, 5.2, 4.9, 4.6, 4.3,
                   3.9, 3.7, 3.4, 3.1, 2.8, 6.3, 3.7, 2.4, 2.8, 1.6];

  return HOLDINGS_UNIVERSE
    .filter((h) => !assetClass || h.assetClass === assetClass)
    .filter((h) => !sector || h.sector === sector)
    .map((h, i) => {
      const price = 500 + seededRandom() * 3500;
      const avgCost = price * (0.85 + seededRandom() * 0.2);
      const qty = Math.round((weights[i] * 452300000) / price);
      const dayChangePct = gaussianRandom(0.04, 0.8);
      const totalReturnPct = ((price - avgCost) / avgCost) * 100;
      return {
        ticker: h.ticker,
        name: h.name,
        assetClass: h.assetClass,
        sector: h.sector,
        weight: weights[i],
        marketValue: Math.round(weights[i] * 452300000),
        quantity: qty,
        avgCost: Math.round(avgCost * 100) / 100,
        currentPrice: Math.round(price * 100) / 100,
        dayReturn: Math.round(weights[i] * 452300000 * (dayChangePct / 100)),
        dayReturnPct: Math.round(dayChangePct * 100) / 100,
        totalReturn: Math.round(weights[i] * 452300000 * (totalReturnPct / 100)),
        totalReturnPct: Math.round(totalReturnPct * 100) / 100,
        beta: h.beta,
        isStale: false,
      };
    });
}

// ── NAV Series ────────────────────────────────────────────────────────────────
export function generateNavSeries(period = "1Y", benchmark = "NIFTY50") {
  resetSeed(300);
  const days = periodToDays(period);
  const dates = dateRange(days);

  let portNav = 1500;
  let benchNav = 1500;

  const series = dates.map((d) => {
    const portDailyReturn = gaussianRandom(0.045 / 252, 0.128 / Math.sqrt(252));
    const benchDailyReturn = gaussianRandom(0.12 / 252, 0.16 / Math.sqrt(252));

    portNav *= 1 + portDailyReturn;
    benchNav *= 1 + benchDailyReturn;

    return {
      date: format(d, "yyyy-MM-dd"),
      portfolioNav: Math.round(portNav * 100) / 100,
      benchmarkNav: Math.round(benchNav * 100) / 100,
      portfolioReturn: Math.round(((portNav - 1500) / 1500) * 10000) / 100,
      benchmarkReturn: Math.round(((benchNav - 1500) / 1500) * 10000) / 100,
    };
  });

  return {
    period,
    benchmark,
    series,
    lastUpdated: new Date().toISOString(),
    isStale: false,
  };
}

// ── Sector Allocation ─────────────────────────────────────────────────────────
export function generateSectorAllocation() {
  resetSeed(400);
  const rawWeights = [24.2, 18.7, 9.3, 8.5, 8.2, 7.9, 7.4, 6.3, 5.6, 3.9];
  return SECTORS.map((sector, i) => ({
    name: sector,
    weight: rawWeights[i],
    benchmarkWeight: rawWeights[i] + gaussianRandom(0, 2),
    activeWeight: gaussianRandom(0, 2.5),
    return1Y: gaussianRandom(12, 8),
  }));
}

export function generateAssetClassAllocation() {
  resetSeed(450);
  const weights = [72.4, 16.3, 4.8, 2.4, 4.1];
  return ASSET_CLASSES.map((cls, i) => ({
    name: cls,
    weight: weights[i],
    benchmarkWeight: weights[i] + gaussianRandom(0, 2),
    activeWeight: gaussianRandom(0, 3),
    return1Y: gaussianRandom(10, 10),
  }));
}

// ── Risk Metrics ──────────────────────────────────────────────────────────────
export function generateRiskMetrics(isStale = false) {
  resetSeed(500);
  return {
    sharpeRatio: 1.68,
    sortinoRatio: 2.14,
    calmarRatio: 0.80,
    beta: 0.91,
    alpha: 3.2,
    rsquared: 0.87,
    trackingError: 4.8,
    informationRatio: 0.67,
    volatility30D: 10.4,
    volatility90D: 12.1,
    volatilityAnnual: 12.8,
    correlationToBenchmark: 0.93,
    lastUpdated: isStale
      ? new Date(Date.now() - 40000).toISOString()
      : new Date().toISOString(),
    isStale,
  };
}

// ── Value at Risk ─────────────────────────────────────────────────────────────
export function generateVaR(
  confidence = "0.95",
  horizon = "1D",
  method = "historical",
  isStale = false,
) {
  resetSeed(600);
  const horizonMultiplier = { "1D": 1, "5D": Math.sqrt(5), "10D": Math.sqrt(10), "1M": Math.sqrt(21) };
  const hm = horizonMultiplier[horizon as keyof typeof horizonMultiplier] ?? 1;
  const aum = 45230;

  const returns: number[] = Array.from({ length: 500 }, () => gaussianRandom(-0.04, 0.82));
  returns.sort((a, b) => a - b);

  const var95 = Math.abs(returns[Math.floor(returns.length * 0.05)]) * aum * hm / 100;
  const var99 = Math.abs(returns[Math.floor(returns.length * 0.01)]) * aum * hm / 100;
  const cvar95 = returns.slice(0, Math.floor(returns.length * 0.05)).reduce((s, r) => s + Math.abs(r), 0)
    / Math.floor(returns.length * 0.05) * aum * hm / 100;
  const cvar99 = returns.slice(0, Math.floor(returns.length * 0.01)).reduce((s, r) => s + Math.abs(r), 0)
    / Math.floor(returns.length * 0.01) * aum * hm / 100;

  return {
    var95: Math.round(var95 * 100) / 100,
    var99: Math.round(var99 * 100) / 100,
    cvar95: Math.round(cvar95 * 100) / 100,
    cvar99: Math.round(cvar99 * 100) / 100,
    varPct95: Math.round((var95 / aum) * 10000) / 100,
    varPct99: Math.round((var99 / aum) * 10000) / 100,
    method,
    horizon,
    confidence: parseFloat(confidence),
    returnDistribution: returns,
    lastUpdated: isStale
      ? new Date(Date.now() - 40000).toISOString()
      : new Date().toISOString(),
    isStale,
  };
}

// ── Drawdown ──────────────────────────────────────────────────────────────────
export function generateDrawdown(period = "3Y") {
  resetSeed(700);
  const days = periodToDays(period);
  const dates = dateRange(days);

  let value = 10000;
  let peak = 10000;
  const series: Array<{ date: string; drawdown: number; portfolioValue: number }> = [];

  // Inject a COVID-like crash around 40% into the series
  const crashStart = Math.floor(days * 0.38);
  const crashDuration = 40;
  const recoveryDuration = 80;

  for (let i = 0; i < dates.length; i++) {
    let dailyReturn = gaussianRandom(0.045 / 252, 0.128 / Math.sqrt(252));

    if (i >= crashStart && i < crashStart + crashDuration) {
      dailyReturn = -0.008 - seededRandom() * 0.01;
    } else if (i >= crashStart + crashDuration && i < crashStart + crashDuration + recoveryDuration) {
      dailyReturn = 0.006 + seededRandom() * 0.005;
    }

    value *= 1 + dailyReturn;
    if (value > peak) peak = value;
    const drawdown = ((value - peak) / peak) * 100;

    series.push({
      date: format(dates[i], "yyyy-MM-dd"),
      drawdown: Math.round(drawdown * 100) / 100,
      portfolioValue: Math.round(value * 100) / 100,
    });
  }

  const maxDrawdown = Math.min(...series.map((s) => s.drawdown));
  const maxDrawdownIdx = series.findIndex((s) => s.drawdown === maxDrawdown);
  const peakIdx = series.slice(0, maxDrawdownIdx).reduce((pi, _, i, arr) => {
    return series[i].portfolioValue > series[pi].portfolioValue ? i : pi;
  }, 0);

  const crashEnd = dates[crashStart + crashDuration];
  const recovEnd = dates[Math.min(crashStart + crashDuration + recoveryDuration, days - 1)];

  return {
    period,
    series,
    events: [
      {
        peakDate: format(dates[peakIdx], "yyyy-MM-dd"),
        troughDate: format(dates[maxDrawdownIdx], "yyyy-MM-dd"),
        recoveryDate: format(recovEnd, "yyyy-MM-dd"),
        maxDrawdown: Math.round(maxDrawdown * 100) / 100,
        durationDays: crashDuration,
        recoveryDays: recoveryDuration,
      },
      {
        peakDate: format(subDays(new Date(), 180), "yyyy-MM-dd"),
        troughDate: format(subDays(new Date(), 155), "yyyy-MM-dd"),
        recoveryDate: format(subDays(new Date(), 120), "yyyy-MM-dd"),
        maxDrawdown: -6.8,
        durationDays: 25,
        recoveryDays: 35,
      },
      {
        peakDate: format(subDays(new Date(), 60), "yyyy-MM-dd"),
        troughDate: format(subDays(new Date(), 45), "yyyy-MM-dd"),
        recoveryDate: null,
        maxDrawdown: -3.2,
        durationDays: 15,
        recoveryDays: null,
      },
    ],
    currentDrawdown: series[series.length - 1].drawdown,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    lastUpdated: new Date().toISOString(),
    isStale: false,
  };
}

// ── Correlation Matrix ────────────────────────────────────────────────────────
export function generateCorrelationMatrix(lookback = 90, limit = 10) {
  resetSeed(800);
  const n = Math.min(limit, HOLDINGS_UNIVERSE.filter((h) => h.assetClass === "Equities").length);
  const assets = HOLDINGS_UNIVERSE
    .filter((h) => h.assetClass === "Equities")
    .slice(0, n)
    .map((h) => h.ticker);

  const matrix: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (__, j) => {
      if (i === j) return 1;
      if (i > j) return 0;
      const base = HOLDINGS_UNIVERSE[i].sector === HOLDINGS_UNIVERSE[j].sector ? 0.65 : 0.35;
      return Math.round((base + gaussianRandom(0, 0.15)) * 100) / 100;
    }),
  );

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      matrix[j][i] = matrix[i][j];
    }
  }

  return {
    assets,
    matrix,
    lookbackDays: lookback,
    lastUpdated: new Date().toISOString(),
    isStale: false,
  };
}

// ── Brinson Attribution ───────────────────────────────────────────────────────
export function generateBrinsonAttribution(period = "1Y") {
  resetSeed(900);
  const sectors = SECTORS.slice(0, 8);
  const totalWeights = sectors.map(() => 8 + seededRandom() * 8);
  const sumW = totalWeights.reduce((a, b) => a + b, 0);

  const result = sectors.map((sector, i) => {
    const pw = Math.round((totalWeights[i] / sumW) * 1000) / 10;
    const bw = Math.round((8 + seededRandom() * 8) * 10) / 10;
    const pr = gaussianRandom(12, 8);
    const br = gaussianRandom(10, 6);
    const alloc = ((pw - bw) / 100) * br;
    const sel = (bw / 100) * (pr - br);
    const inter = ((pw - bw) / 100) * (pr - br);
    return {
      sector,
      portfolioWeight: pw,
      benchmarkWeight: bw,
      portfolioReturn: Math.round(pr * 100) / 100,
      benchmarkReturn: Math.round(br * 100) / 100,
      allocationEffect: Math.round(alloc * 100) / 100,
      selectionEffect: Math.round(sel * 100) / 100,
      interactionEffect: Math.round(inter * 100) / 100,
      totalActiveReturn: Math.round((alloc + sel + inter) * 100) / 100,
    };
  });

  const totAlloc = result.reduce((s, r) => s + r.allocationEffect, 0);
  const totSel = result.reduce((s, r) => s + r.selectionEffect, 0);
  const totInter = result.reduce((s, r) => s + r.interactionEffect, 0);

  return {
    period,
    sectors: result,
    totalAllocationEffect: Math.round(totAlloc * 100) / 100,
    totalSelectionEffect: Math.round(totSel * 100) / 100,
    totalInteractionEffect: Math.round(totInter * 100) / 100,
    totalActiveReturn: Math.round((totAlloc + totSel + totInter) * 100) / 100,
    lastUpdated: new Date().toISOString(),
    isStale: false,
  };
}

// ── Factor Exposures ──────────────────────────────────────────────────────────
export function generateFactorExposures() {
  resetSeed(1000);
  return [
    { factor: "Market", exposure: 0.91, tstat: 18.4, contribution: 11.2 },
    { factor: "SMB",    exposure: 0.12, tstat: 2.1,  contribution: 0.8 },
    { factor: "HML",    exposure: -0.18,tstat: -3.2, contribution: -1.1 },
    { factor: "MOM",    exposure: 0.24, tstat: 4.6,  contribution: 1.6 },
    { factor: "QMJ",    exposure: 0.31, tstat: 5.8,  contribution: 2.1 },
    { factor: "BAB",    exposure: 0.08, tstat: 1.4,  contribution: 0.5 },
  ];
}

// ── Stress Tests ──────────────────────────────────────────────────────────────
export function generateStressTests() {
  resetSeed(1100);
  return [
    { name: "COVID-19 Crash (Mar 2020)", category: "historical", estimatedLoss: -1820, estimatedLossPct: -4.03, description: "March 2020 equity selloff, 33% peak-to-trough" },
    { name: "Global Financial Crisis 2008", category: "historical", estimatedLoss: -4210, estimatedLossPct: -9.31, description: "Lehman collapse, credit markets seize" },
    { name: "Dot-com Bust 2000–02", category: "historical", estimatedLoss: -2850, estimatedLossPct: -6.31, description: "Tech sector collapse, 78% NASDAQ decline" },
    { name: "Flash Crash May 2010", category: "historical", estimatedLoss: -380, estimatedLossPct: -0.84, description: "Intraday 10% drop, algorithm-driven" },
    { name: "Taper Tantrum 2013", category: "historical", estimatedLoss: -690, estimatedLossPct: -1.53, description: "Fed tapering surprise, EM selloff" },
    { name: "+200bps Parallel Shift", category: "hypothetical", estimatedLoss: -1240, estimatedLossPct: -2.74, description: "Instantaneous 200bps rate rise across curve" },
    { name: "India Credit Crunch", category: "hypothetical", estimatedLoss: -2100, estimatedLossPct: -4.64, description: "Banking sector stress, credit spreads widen 300bps" },
    { name: "Oil Price Shock +50%", category: "hypothetical", estimatedLoss: 420, estimatedLossPct: 0.93, description: "Positive for energy holdings, negative for consumers" },
    { name: "Equity Vol Spike 3×", category: "hypothetical", estimatedLoss: -1580, estimatedLossPct: -3.49, description: "VIX equivalent spikes from 18 to 54" },
    { name: "Rupee Depreciation 20%", category: "hypothetical", estimatedLoss: -890, estimatedLossPct: -1.97, description: "USD/INR moves from 84 to 101" },
  ];
}

// ── Activity Feed ─────────────────────────────────────────────────────────────
export function generateActivityFeed(limit = 20) {
  resetSeed(1200);
  const items = [
    { type: "TRADE", message: "Bought 12,500 shares INFY @ ₹1,847.30 — Momentum signal", severity: "info", ticker: "INFY", value: 23091250 },
    { type: "ALERT", message: "HDFCBANK VaR breach: 3-day 99% VaR exceeded $42.1M threshold", severity: "critical", ticker: "HDFCBANK", value: 42100000 },
    { type: "THRESHOLD", message: "Technology sector overweight by 2.4% above max 25% limit", severity: "warning", ticker: null, value: 24.2 },
    { type: "TRADE", message: "Sold 8,000 shares MARUTI @ ₹12,340.50 — Profit take", severity: "info", ticker: "MARUTI", value: 98724000 },
    { type: "REBALANCE", message: "Monthly rebalance executed: 14 positions adjusted", severity: "info", ticker: null, value: null },
    { type: "ALERT", message: "Drawdown at -4.8%: approaching -5% soft stop", severity: "warning", ticker: null, value: -4.8 },
    { type: "COMPLIANCE", message: "Position limit check passed — all holdings within SEBI guidelines", severity: "info", ticker: null, value: null },
    { type: "TRADE", message: "Added NIFTY 50 Call Options hedge — 200 lots @ ₹245", severity: "info", ticker: "NIFTY-CE", value: 4900000 },
    { type: "ALERT", message: "Correlation spike detected: Top 10 holdings avg correlation +0.12 vs 60D baseline", severity: "warning", ticker: null, value: 0.78 },
    { type: "THRESHOLD", message: "Cash allocation at 4.2% — below 5% target", severity: "info", ticker: null, value: 4.2 },
    { type: "TRADE", message: "Initiated Gold ETF position — 50,000 units @ ₹62.40", severity: "info", ticker: "GOLD-ETF", value: 3120000 },
    { type: "COMPLIANCE", message: "NAV calculated: ₹1,847.62 published by 6:00 PM IST", severity: "info", ticker: null, value: 1847.62 },
    { type: "ALERT", message: "RELIANCE crosses 8% portfolio weight — review concentration", severity: "warning", ticker: "RELIANCE", value: 8.2 },
    { type: "TRADE", message: "Trimmed AXISBANK — 15,000 shares @ ₹1,124.80", severity: "info", ticker: "AXISBANK", value: 16872000 },
    { type: "THRESHOLD", message: "Fixed income duration extended to 6.2 years — above 5.5Y target", severity: "warning", ticker: null, value: 6.2 },
    { type: "REBALANCE", message: "Sector weights rebalanced post market close", severity: "info", ticker: null, value: null },
    { type: "ALERT", message: "Sharpe ratio improved to 1.68 — 90th percentile vs peer universe", severity: "info", ticker: null, value: 1.68 },
    { type: "TRADE", message: "Embassy REIT allocation initiated — 25,000 units", severity: "info", ticker: "REIT-INV", value: null },
    { type: "COMPLIANCE", message: "Derivative exposure within SEBI 100% AUM limit — current: 4.8%", severity: "info", ticker: null, value: 4.8 },
    { type: "ALERT", message: "Beta drift detected: 0.91 → 0.96 over 10 days, monitoring", severity: "warning", ticker: null, value: 0.96 },
  ];

  const now = new Date();
  return items.slice(0, limit).map((item, i) => ({
    id: `ACT-${String(i + 1).padStart(4, "0")}`,
    type: item.type,
    message: item.message,
    timestamp: new Date(now.getTime() - i * 18 * 60000).toISOString(),
    severity: item.severity,
    ticker: item.ticker ?? null,
    value: item.value ?? null,
  }));
}

// ── Dashboard Layout (default) ────────────────────────────────────────────────
export const DEFAULT_LAYOUT = {
  id: "default",
  name: "Default Dashboard",
  columns: 12,
  widgets: [
    { id: "w1",  type: "PORTFOLIO_SUMMARY",  x: 0, y: 0,  w: 12, h: 3,  settings: {} },
    { id: "w2",  type: "NAV_CHART",          x: 0, y: 3,  w: 8,  h: 5,  settings: { period: "1Y", benchmark: "NIFTY50" } },
    { id: "w3",  type: "VAR_GAUGE",          x: 8, y: 3,  w: 4,  h: 5,  settings: { confidence: "0.95", horizon: "1D" } },
    { id: "w4",  type: "HOLDINGS",           x: 0, y: 8,  w: 7,  h: 6,  settings: {} },
    { id: "w5",  type: "ATTRIBUTION",        x: 7, y: 8,  w: 5,  h: 6,  settings: { period: "1Y" } },
    { id: "w6",  type: "DRAWDOWN",           x: 0, y: 14, w: 6,  h: 5,  settings: { period: "3Y" } },
    { id: "w7",  type: "CORRELATION",        x: 6, y: 14, w: 6,  h: 5,  settings: { lookback: 90 } },
    { id: "w8",  type: "ALLOCATION",         x: 0, y: 19, w: 4,  h: 5,  settings: {} },
    { id: "w9",  type: "RISK_METRICS",       x: 4, y: 19, w: 4,  h: 5,  settings: {} },
    { id: "w10", type: "FACTORS",            x: 8, y: 19, w: 4,  h: 4,  settings: {} },
    { id: "w11", type: "STRESS_TEST",        x: 0, y: 24, w: 8,  h: 5,  settings: {} },
    { id: "w12", type: "ACTIVITY",           x: 8, y: 24, w: 4,  h: 5,  settings: { limit: 20 } },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ── Theme (default) ────────────────────────────────────────────────────────────
export const DEFAULT_THEME = {
  id: "meridian",
  name: "Meridian",
  preset: "meridian",
};
