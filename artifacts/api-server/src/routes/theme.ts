import { Router } from "express";
import { DEFAULT_THEME } from "../lib/mockData";

const router = Router();

let currentTheme = { ...DEFAULT_THEME };

router.get("/theme", (_req, res) => {
  res.json(currentTheme);
});

router.put("/theme", (req, res) => {
  const { preset } = req.body as { preset: string };
  const VALID_PRESETS = ["bloomberg", "refinitiv", "midnight", "arctic", "meridian"];

  if (!VALID_PRESETS.includes(preset)) {
    res.status(400).json({ error: "Invalid preset" });
    return;
  }

  currentTheme = {
    id: preset,
    name: preset.charAt(0).toUpperCase() + preset.slice(1),
    preset,
  };

  res.json(currentTheme);
});

export default router;
