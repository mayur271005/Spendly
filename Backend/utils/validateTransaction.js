import { CATEGORIES } from "../constants/category.js";

const TYPES = ["income", "expense"];

export const validateTransactionData = (data = {}, { partial = false } = {}) => {
  const { type, amount, category, description, date } = data;

  if (!partial || type !== undefined) {
    if (!TYPES.includes(type)) {
      return "Type must be income or expense";
    }
  }

  if (!partial || amount !== undefined) {
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return "Amount must be a positive number";
    }
  }

  if (!partial || category !== undefined) {
    if (typeof category !== "string" || !category.trim()) {
      return "Category is required";
    }
  }

  if (description !== undefined) {
    if (typeof description !== "string" || description.length > 200) {
      return "Description must be a string of up to 200 characters";
    }
  }

  if (date !== undefined) {
    const validType = typeof date === "string" || typeof date === "number";
    if (!validType || Number.isNaN(new Date(date).getTime())) {
      return "Invalid date";
    }
  }

  return null;
};

export const isValidCategory = (type, category) =>
  TYPES.includes(type) &&
  typeof category === "string" &&
  CATEGORIES[type].includes(category.trim());