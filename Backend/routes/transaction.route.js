import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createTransactionController,
  getTransactionsController,
  updateTransactionController,
  deleteTransactionController,
} from "../controllers/transaction.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", createTransactionController);
router.get("/", getTransactionsController);
router.put("/:id", updateTransactionController);
router.delete("/:id", deleteTransactionController);

export default router;