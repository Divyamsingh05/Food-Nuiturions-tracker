import "./MacroRing.css";

export default function MacroRing({ calories, goal }) {
  const pct = Math.min((calories / goal) * 100, 100);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;
  const remaining = goal - calories;
  const over = calories > goal;

  return (
    <div className="macro-ring-wrap">
      <svg className="macro-ring-svg" viewBox="0 0 180 180" width="180" height="180">
        {/* Track */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="14"
        />
        {/* Gradient def */}
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={over ? "#ff6584" : "#6c63ff"} />
            <stop offset="100%" stopColor={over ? "#ff94a8" : "#ff6584"} />
          </linearGradient>
        </defs>
        {/* Fill */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference * 0.25}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="macro-ring-center">
        <span className="ring-cal">{Math.round(calories)}</span>
        <span className="ring-label">kcal</span>
        <span className="ring-sub">
          {over
            ? <span style={{ color: "var(--secondary)" }}>+{Math.round(calories - goal)} over</span>
            : <span style={{ color: "var(--accent)" }}>{Math.round(remaining)} left</span>
          }
        </span>
      </div>
    </div>
  );
}
