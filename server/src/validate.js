function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidIsoDateOrEmpty(v) {
  if (v === undefined || v === null || v === "") return true;
  if (typeof v !== "string") return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
}

function validateCreateTask(body) {
  const errors = [];

  if (!isNonEmptyString(body?.title)) {
    errors.push("title is required");
  }

  if (!isValidIsoDateOrEmpty(body?.dueDate)) {
    errors.push("dueDate must be an ISO date string (or omitted)");
  }

  return errors;
}

module.exports = {
  validateCreateTask,
};
