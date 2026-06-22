import { Router } from "express";
import {
  generateRiskMetrics,
  generateVaR,
  generateDrawdown,
  generateCorrelationMatrix,
  generateFactorExposures,
  generateStressTests,
} from "../lib/mockData";

const router = Router();

router.get("/risk/metrics", (req, res) => {
  const isStale = req.query.stale === "true";
  res.json(generateRiskMetrics(isStale));
});

router.get("/risk/var", (req, res) => {
  const confidence = (req.query.confidence as string) || "0.95";
  const horizon = (req.query.horizon as string) || "1D";
  const method = (req.query.method as string) || "historical";
  const isStale = req.query.stale === "true";
  res.json(generateVaR(confidence, horizon, method, isStale));
});

router.get("/risk/drawdown", (req, res) => {
  const period = (req.query.period as string) || "3Y";
  res.json(generateDrawdown(period));
});

router.get("/risk/correlation", (req, res) => {
  const lookback = parseInt(req.query.lookback as string) || 90;
  const limit = parseInt(req.query.limit as string) || 10;
  res.json(generateCorrelationMatrix(lookback, limit));
});

router.get("/risk/factors", (_req, res) => {
  res.json(generateFactorExposures());
});

router.get("/risk/stress-tests", (_req, res) => {
  res.json(generateStressTests());
});

export default router;
