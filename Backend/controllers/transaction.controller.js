import mongoose from "mongoose";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction.service.js";

const checkId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    const err = new Error("Invalid transaction id");
    err.status = 400;
    throw err;
  }
};

const createTransactionController = async (req, res, next) => {
  try {
    const transaction = await createTransaction(req.user._id, req.body);
    res.status(201).json({ message: "Transaction created", transaction });
  } catch (err) {
    next(err);
  }
};

const getTransactionsController = async (req, res, next) => {
  try {
    const result = await getTransactions(req.user._id, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const updateTransactionController = async (req, res, next) => {
  try {
    checkId(req.params.id);
    const transaction = await updateTransaction(req.user._id, req.params.id, req.body);
    res.status(200).json({ message: "Transaction updated", transaction });
  } catch (err) {
    next(err);
  }
};

const deleteTransactionController = async (req, res, next) => {
  try {
    checkId(req.params.id);
    await deleteTransaction(req.user._id, req.params.id);
    res.status(200).json({ message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
};

export {
  createTransactionController,
  getTransactionsController,
  updateTransactionController,
  deleteTransactionController,
};