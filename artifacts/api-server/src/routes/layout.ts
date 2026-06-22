import { Router } from "express";
import { DEFAULT_LAYOUT } from "../lib/mockData";

const router = Router();

type WidgetConfig = {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  settings: Record<string, unknown>;
};

type Layout = typeof DEFAULT_LAYOUT & { widgets: WidgetConfig[] };

// In-memory store (resets on server restart — for persistence use DB)
let currentLayout: Layout = { ...DEFAULT_LAYOUT, updatedAt: new Date().toISOString() } as Layout;

router.get("/layout", (_req, res) => {
  res.json(currentLayout);
});

router.put("/layout", (req, res) => {
  const { name, widgets, columns } = req.body as {
    name?: string;
    widgets?: WidgetConfig[];
    columns?: number;
  };

  currentLayout = {
    ...currentLayout,
    name: name ?? currentLayout.name,
    widgets: widgets ?? currentLayout.widgets,
    columns: columns ?? currentLayout.columns,
    updatedAt: new Date().toISOString(),
  };

  res.json(currentLayout);
});

export default router;
