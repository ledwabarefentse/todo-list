const fs = require("fs/promises");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "tasks.json");

async function readTasks() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    // If file missing, treat as empty list
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeTasks(tasks) {
  const tmpPath = DATA_PATH + ".tmp";
  const payload = JSON.stringify(tasks, null, 2);

  // Write-then-rename is safer than overwriting directly
  await fs.writeFile(tmpPath, payload, "utf8");
  await fs.rename(tmpPath, DATA_PATH);
}

module.exports = {
  readTasks,
  writeTasks,
  DATA_PATH,
};
