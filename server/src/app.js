const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { readTasks, writeTasks } = require("./storage");
const { validateCreateTask } = require("./validate");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "64kb" }));

  app.get("/health", (req, res) => {
    res.json({ ok: true });
  });

  app.get("/tasks", async (req, res, next) => {
    try {
      const tasks = await readTasks();
      res.json(tasks);
    } catch (e) {
      next(e);
    }
  });

  app.post("/tasks", async (req, res, next) => {
    try {
      const errors = validateCreateTask(req.body);
      if (errors.length) return res.status(400).json({ errors });

      const tasks = await readTasks();

      const now = new Date().toISOString();
      const task = {
        id: uuidv4(),
        title: req.body.title.trim(),
        dueDate: req.body.dueDate ? new Date(req.body.dueDate).toISOString() : null,
        done: false,
        createdAt: now,
      };

      tasks.unshift(task);
      await writeTasks(tasks);

      res.status(201).json(task);
    } catch (e) {
      next(e);
    }
  });

  app.patch("/tasks/:id/toggle", async (req, res, next) => {
    try {
      const { id } = req.params;
      const tasks = await readTasks();

      const idx = tasks.findIndex((t) => t.id === id);
      if (idx === -1) return res.status(404).json({ error: "task not found" });

      tasks[idx] = { ...tasks[idx], done: !tasks[idx].done };
      await writeTasks(tasks);

      res.json(tasks[idx]);
    } catch (e) {
      next(e);
    }
  });

  app.delete("/tasks/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const tasks = await readTasks();

      const nextTasks = tasks.filter((t) => t.id !== id);
      if (nextTasks.length === tasks.length) {
        return res.status(404).json({ error: "task not found" });
      }

      await writeTasks(nextTasks);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });

  // Error handler (kept simple for v1)
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "internal_server_error" });
  });

  return app;
}

module.exports = { createApp };
