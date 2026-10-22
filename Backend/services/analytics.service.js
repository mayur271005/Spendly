import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import { monthRange, yearRange } from "../utils/dateRange.js";

const TZ = "Asia/Kolkata";
const round2 = (n) => Math.round(n * 100) / 100;

// Aggregation does not auto-cast, so convert the id explicitly
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

export const getSummary = async (userId, { month } = {}) => {
  const match = { user: toObjectId(userId) };
  if (month !== undefined) match.date = monthRange(month);

  const rows = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);

  let totalIncome = 0;
  let totalExpense = 0;
  for (const row of rows) {
    if (row._id === "income") totalIncome = row.total;
    if (row._id === "expense") totalExpense = row.total;
  }

  return {
    totalIncome: round2(totalIncome),
    totalExpense: round2(totalExpense),
    balance: round2(totalIncome - totalExpense),
  };
};

export const getByCategory = async (userId, { month } = {}) => {
  const match = { user: toObjectId(userId), type: "expense" };
  if (month !== undefined) match.date = monthRange(month);

  const rows = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);

  const categories = rows.map((r) => ({
    category: r._id,
    total: round2(r.total),
    count: r.count,
    percentage: grandTotal ? round2((r.total / grandTotal) * 100) : 0,
  }));

  return { totalExpense: round2(grandTotal), categories };
};

export const getMonthly = async (userId, { year } = {}) => {
  const match = { user: toObjectId(userId) };
  if (year !== undefined) match.date = yearRange(year);

  const rows = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: { date: "$date", timezone: TZ } },
          month: { $month: { date: "$date", timezone: TZ } },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Merge income/expense rows into one object per month
  const byMonth = new Map();
  for (const row of rows) {
    const key = `${row._id.year}-${String(row._id.month).padStart(2, "0")}`;
    if (!byMonth.has(key)) byMonth.set(key, { month: key, income: 0, expense: 0 });
    byMonth.get(key)[row._id.type] = row.total;
  }

  return [...byMonth.values()].map((m) => ({
    month: m.month,
    income: round2(m.income),
    expense: round2(m.expense),
    balance: round2(m.income - m.expense),
  }));
};