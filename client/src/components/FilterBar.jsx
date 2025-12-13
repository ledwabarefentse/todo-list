export default function FilterBar({ filter, setFilter }) {
  const items = ["All", "Open", "Done"];

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      {items.map((name) => {
        const active = filter === name;
        return (
          <button
            key={name}
            onClick={() => setFilter(name)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #444",
              cursor: "pointer",
              fontWeight: active ? 700 : 400,
              opacity: active ? 1 : 0.8,
            }}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
