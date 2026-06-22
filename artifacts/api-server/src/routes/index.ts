import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import performanceRouter from "./performance";
import allocationRouter from "./allocation";
import riskRouter from "./risk";
import attributionRouter from "./attribution";
import layoutRouter from "./layout";
import themeRouter from "./theme";

const router: IRouter = Router();

router.use(healthRouter);
router.use(portfolioRouter);
router.use(performanceRouter);
router.use(allocationRouter);
router.use(riskRouter);
router.use(attributionRouter);
router.use(layoutRouter);
router.use(themeRouter);

export default router;
