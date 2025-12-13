import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { createTask, deleteTask, fetchTasks, toggleTask } from "./api/tasksApi";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      setError("Failed to load tasks. Is the backend running on port 3001?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    setError("");
    try {
      const created = await createTask(payload);
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      const apiErrors = e?.response?.data?.errors;
      setError(apiErrors?.join(", ") || "Failed to create task");
    }
  }

  async function handleToggle(id) {
    setError("");
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("Failed to toggle task");
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task");
    }
  }

  const visibleTasks = useMemo(() => {
    if (filter === "Open") return tasks.filter((t) => !t.done);
    if (filter === "Done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 6 }}>Tiny Tasks</h1>
      <div style={{ opacity: 0.8, marginBottom: 16 }}>Minimal SDLC practice app</div>

      <FilterBar filter={filter} setFilter={setFilter} />
      <TaskForm onCreate={handleCreate} />

      {error ? (
        <div style={{ marginBottom: 12, padding: 10, border: "1px solid #aa3333", borderRadius: 10 }}>
          {error}
        </div>
      ) : null}

      {loading ? <div>Loading…</div> : <TaskList tasks={visibleTasks} onToggle={handleToggle} onDelete={handleDelete} />}
    </div>
  );
}
