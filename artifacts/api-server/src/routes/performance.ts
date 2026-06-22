import { Router } from "express";
import { generateNavSeries } from "../lib/mockData";

const router = Router();

router.get("/performance/nav", (req, res) => {
  const period = (req.query.period as string) || "1Y";
  const benchmark = (req.query.benchmark as string) || "NIFTY50";
  res.json(generateNavSeries(period, benchmark));
});

export default router;
