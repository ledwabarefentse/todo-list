import { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    await onCreate({
      title: trimmed,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });

    setTitle("");
    setDueDate("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #444" }}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ padding: 10, borderRadius: 8, border: "1px solid #444" }}
      />
      <button
        type="submit"
        style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #444", cursor: "pointer" }}
      >
        Add
      </button>
    </form>
  );
}
