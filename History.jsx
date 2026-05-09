import { CalorieLineChart, MacroBarChart } from "../components/WeeklyChart";
import { useNutrition } from "../hooks/useNutrition";
import { TrendingUp, Flame, Zap, Award } from "lucide-react";

export default function History() {
  const { getWeekData, getDayTotals, goals, getStreak } = useNutrition();
  const weekData = getWeekData();
  const streak = getStreak();

  const avgCal = Math.round(
    weekData.reduce((s, d) => s + d.calories, 0) / weekData.filter(d => d.calories > 0).length || 0
  );

  const bestDay = weekData.reduce((best, d) => (d.calories > best.calories ? d : best), weekData[0]);
  const daysLogged = weekData.filter(d => d.calories > 0).length;

  const stats = [
    { icon: <Flame size={18} />, label: "Avg Daily", val: `${avgCal || 0} kcal`, color: "var(--secondary)" },
    { icon: <Award size={18} />, label: "Streak",    val: `${streak} day${streak !== 1 ? "s" : ""}`, color: "var(--warning)" },
    { icon: <Zap size={18} />,   label: "Days Logged", val: `${daysLogged} / 7`, color: "var(--accent)" },
    { icon: <TrendingUp size={18} />, label: "Best Day", val: bestDay?.calories > 0 ? `${Math.round(bestDay.calories)} kcal` : "—", color: "var(--primary)" },
  ];

  return (
    <div className="page-content animate-fade">
      <div className="mb-24">
        <h1 className="mb-4">Weekly <span className="gradient-text">History</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Your nutrition trends over the last 7 days</p>
      </div>

      {/* Stats row */}
      <div className="grid-2 mb-16">
        {stats.map(s => (
          <div key={s.label} className="card card-sm stat-card">
            <div className="stat-icon-wrap" style={{ color: s.color }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{s.val}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 1 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Calorie Chart */}
      <div className="card mb-16">
        <div className="section-header mb-16">
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} style={{ color: "var(--primary)" }} />
            Calorie Trend
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Goal: {goals.calories} kcal</span>
        </div>
        {daysLogged === 0 ? (
          <div className="empty-state" style={{ padding: "32px 20px" }}>
            <div className="empty-state-icon">📈</div>
            <p>Start logging meals to see your trend</p>
          </div>
        ) : (
          <CalorieLineChart data={weekData} goalLine={goals.calories} />
        )}
      </div>

      {/* Macro Chart */}
      <div className="card mb-16">
        <div className="section-header mb-16">
          <h3>Macro Breakdown</h3>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Stacked daily</span>
        </div>
        {daysLogged === 0 ? (
          <div className="empty-state" style={{ padding: "32px 20px" }}>
            <div className="empty-state-icon">📊</div>
            <p>No data yet</p>
          </div>
        ) : (
          <MacroBarChart data={weekData} />
        )}
      </div>

      {/* Daily breakdown table */}
      <div className="card">
        <h3 className="mb-16">Daily Breakdown</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {weekData.map((day) => (
            <div key={day.date} className={`day-row ${day.date === new Date().toISOString().split("T")[0] ? "today-row" : ""}`}>
              <span className="day-name">{day.label}</span>
              <div className="day-macros">
                {day.calories > 0 ? (
                  <>
                    <span className="chip chip-cal">{Math.round(day.calories)} cal</span>
                    <span className="chip chip-protein">P {Math.round(day.protein)}g</span>
                    <span className="chip chip-carbs">C {Math.round(day.carbs)}g</span>
                    <span className="chip chip-fat">F {Math.round(day.fat)}g</span>
                  </>
                ) : (
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>No data</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stat-card { display: flex; align-items: center; gap: 12px; }
        .stat-icon-wrap { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.06); border-radius: 10px; flex-shrink: 0; }
        .day-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 10px; gap: 8px; flex-wrap: wrap; }
        .today-row { background: rgba(108,99,255,0.08); border: 1px solid rgba(108,99,255,0.2); }
        .day-name { font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); min-width: 36px; }
        .day-macros { display: flex; gap: 5px; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}
