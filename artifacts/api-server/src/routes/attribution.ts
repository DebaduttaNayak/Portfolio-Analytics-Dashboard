import { Router } from "express";
import { generateBrinsonAttribution } from "../lib/mockData";

const router = Router();

router.get("/attribution/brinson", (req, res) => {
  const period = (req.query.period as string) || "1Y";
  res.json(generateBrinsonAttribution(period));
});

export default router;
