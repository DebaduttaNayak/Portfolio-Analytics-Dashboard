import { Router } from "express";
import { generateSectorAllocation, generateAssetClassAllocation } from "../lib/mockData";

const router = Router();

router.get("/allocation/sectors", (_req, res) => {
  res.json(generateSectorAllocation());
});

router.get("/allocation/asset-classes", (_req, res) => {
  res.json(generateAssetClassAllocation());
});

export default router;
