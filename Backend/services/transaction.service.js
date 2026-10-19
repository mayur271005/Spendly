import Transaction from "../models/transaction.model.js";
import { validateTransactionData, isValidCategory } from "../utils/validateTransaction.js";

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const createTransaction = async (userId, data = {}) => {
  const msg = validateTransactionData(data);
  if (msg) throw httpError(400, msg);
  if (!isValidCategory(data.type, data.category)) {
    throw httpError(400, `Invalid category for ${data.type}`);
  }

  return Transaction.create({
    user: userId, // always from req.user, never from the body
    type: data.type,
    amount: data.amount,
    category: data.category.trim(),
    description: data.description,
    date: data.date,
  });
};

const getTransactions = async (userId, query = {}) => {
  const filter = { user: userId };

  if (query.type !== undefined) {
    if (!["income", "expense"].includes(query.type)) throw httpError(400, "Invalid type");
    filter.type = query.type;
  }
  if (query.category !== undefined) {
    if (typeof query.category !== "string") throw httpError(400, "Invalid category");
    filter.category = query.category;
  }
  if (query.month !== undefined) {
    if (typeof query.month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(query.month)) {
      throw httpError(400, "Month must be YYYY-MM");
    }
    const [y, m] = query.month.split("-").map(Number);
    filter.date = {
      $gte: new Date(Date.UTC(y, m - 1, 1)),
      $lt: new Date(Date.UTC(y, m, 1)),
    };
  }

  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);

  const [data, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ date: -1, _id: -1 }) // _id breaks ties so pages never overlap
      .skip((page - 1) * limit)
      .limit(limit),
    Transaction.countDocuments(filter),
  ]);

  return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
};

const updateTransaction = async (userId, id, updates = {}) => {
  const msg = validateTransactionData(updates, { partial: true });
  if (msg) throw httpError(400, msg);

  const transaction = await Transaction.findOne({ _id: id, user: userId });
  if (!transaction) throw httpError(404, "Transaction not found");

  // Validate the final combination of old and new values
  const finalType = updates.type ?? transaction.type;
  const finalCategory = (updates.category ?? transaction.category).trim();
  if (!isValidCategory(finalType, finalCategory)) {
    throw httpError(400, `Invalid category for ${finalType}`);
  }

  const allowed = ["type", "amount", "category", "description", "date"];
  for (const key of allowed) {
    if (updates[key] !== undefined) transaction[key] = updates[key];
  }

  await transaction.save();
  return transaction;
};

const deleteTransaction = async (userId, id) => {
  const transaction = await Transaction.findOneAndDelete({ _id: id, user: userId });
  if (!transaction) throw httpError(404, "Transaction not found");
  return transaction;
};

export { createTransaction, getTransactions, updateTransaction, deleteTransaction };