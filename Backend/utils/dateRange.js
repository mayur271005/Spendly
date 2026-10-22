const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// "2026-10" -> { $gte, $lt } covering that month in IST
export const monthRange = (month) => {
  if (typeof month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw httpError(400, "Month must be YYYY-MM");
  }
  const [y, m] = month.split("-").map(Number);
  return {
    $gte: new Date(Date.UTC(y, m - 1, 1) - IST_OFFSET_MS),
    $lt: new Date(Date.UTC(y, m, 1) - IST_OFFSET_MS),
  };
};

// "2026" -> { $gte, $lt } covering that year in IST
export const yearRange = (year) => {
  if (typeof year !== "string" || !/^\d{4}$/.test(year)) {
    throw httpError(400, "Year must be YYYY");
  }
  const y = Number(year);
  return {
    $gte: new Date(Date.UTC(y, 0, 1) - IST_OFFSET_MS),
    $lt: new Date(Date.UTC(y + 1, 0, 1) - IST_OFFSET_MS),
  };
};