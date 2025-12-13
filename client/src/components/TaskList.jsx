function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (!tasks.length) return <div style={{ opacity: 0.8 }}>No tasks yet.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {tasks.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #333",
          }}
        >
          <input type="checkbox" checked={t.done} onChange={() => onToggle(t.id)} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, textDecoration: t.done ? "line-through" : "none" }}>
              {t.title}
            </div>
            {t.dueDate ? (
              <div style={{ fontSize: 12, opacity: 0.8 }}>Due: {formatDate(t.dueDate)}</div>
            ) : null}
          </div>
          <button
            onClick={() => onDelete(t.id)}
            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #444", cursor: "pointer" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
