import { Router } from "express";
import { deviationCoin, latestCoinDetails, scheduleCronJob } from "../controllers/coinController.js";
const router = Router();
router.post("/", scheduleCronJob);
router.get("/stat", latestCoinDetails);
router.get("/deviation", deviationCoin);
export { router };