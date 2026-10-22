import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  summaryController,
  byCategoryController,
  monthlyController,
} from "../controllers/analytics.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/summary", summaryController);
router.get("/by-category", byCategoryController);
router.get("/monthly", monthlyController);

export default router;