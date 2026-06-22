import { Router } from "express";
import {
  generatePortfolioSummary,
  generateHoldings,
  generateActivityFeed,
} from "../lib/mockData";

const router = Router();

router.get("/portfolio/summary", (req, res) => {
  const isStale = req.query.stale === "true";
  res.json(generatePortfolioSummary(isStale));
});

router.get("/portfolio/holdings", (req, res) => {
  const assetClass = req.query.assetClass as string | undefined;
  const sector = req.query.sector as string | undefined;
  res.json(generateHoldings(assetClass, sector));
});

router.get("/portfolio/activity", (req, res) => {
  const limit = parseInt(req.query.limit as string) || 20;
  res.json(generateActivityFeed(limit));
});

export default router;
