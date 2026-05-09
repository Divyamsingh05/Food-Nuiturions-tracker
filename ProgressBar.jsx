export default function ProgressBar({ label, current, goal, color, unit = "g" }) {
  const pct = Math.min((current / goal) * 100, 100);
  const over = current > goal;

  const colorMap = {
    protein: "linear-gradient(90deg, #6c63ff, #9b8fff)",
    carbs:   "linear-gradient(90deg, #f6c90e, #ffd94d)",
    fat:     "linear-gradient(90deg, #ff6584, #ff94a8)",
    fiber:   "linear-gradient(90deg, #43e97b, #79f7a6)",
    calories:"linear-gradient(90deg, #6c63ff, #ff6584)",
  };

  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span className="progress-label" style={{ color: over ? "var(--secondary)" : "var(--text-primary)" }}>
          {label}
        </span>
        <span className="progress-value">
          <span style={{ color: over ? "var(--secondary)" : "var(--text-primary)", fontWeight: 600 }}>
            {Math.round(current)}
          </span>
          {" / "}
          {goal}{unit}
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: over
              ? "linear-gradient(90deg, #ff6584, #ff94a8)"
              : colorMap[color] || colorMap.calories,
          }}
        />
      </div>
    </div>
  );
}
