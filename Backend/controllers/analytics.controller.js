import { getSummary, getByCategory, getMonthly } from "../services/analytics.service.js";

const summaryController = async (req, res, next) => {
  try {
    const data = await getSummary(req.user._id, { month: req.query.month });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const byCategoryController = async (req, res, next) => {
  try {
    const data = await getByCategory(req.user._id, { month: req.query.month });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const monthlyController = async (req, res, next) => {
  try {
    const data = await getMonthly(req.user._id, { year: req.query.year });
    res.status(200).json({ months: data });
  } catch (err) {
    next(err);
  }
};

export { summaryController, byCategoryController, monthlyController };