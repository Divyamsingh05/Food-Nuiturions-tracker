import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Plus, Flame } from "lucide-react";
import MacroRing from "../components/MacroRing";
import ProgressBar from "../components/ProgressBar";
import MealSection from "../components/MealSection";
import GoalModal from "../components/GoalModal";
import { useNutrition } from "../hooks/useNutrition";

export default function Dashboard() {
  const { goals, setGoals, today, getDateLog, removeFood, getDayTotals } = useNutrition();
  const [showGoal, setShowGoal] = useState(false);
  const navigate = useNavigate();

  const dateLog = getDateLog(today);
  const totals = getDayTotals(today);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning! 🌅";
    if (h < 17) return "Good afternoon! ☀️";
    return "Good evening! 🌙";
  };

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const totalFoods = mealTypes.reduce((n, m) => n + dateLog[m].length, 0);

  return (
    <div className="page-content animate-fade">
      {/* Header */}
      <div className="dash-header mb-24">
        <div>
          <h1 className="greeting">{greeting()}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 3 }}>
            {totalFoods === 0 ? "Start logging your meals" : `${totalFoods} food${totalFoods > 1 ? "s" : ""} logged today`}
          </p>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={() => setShowGoal(true)} title="Edit Goals">
          <Settings size={18} />
        </button>
      </div>

      {/* Calorie Ring + Macros */}
      <div className="card dash-ring-card mb-16">
        <div className="dash-ring-inner">
          <MacroRing calories={totals.calories} goal={goals.calories} />
          <div className="dash-stats">
            <div className="stat-item">
              <span className="stat-val" style={{ color: "var(--warning)" }}>{Math.round(totals.calories)}</span>
              <span className="stat-label">Eaten</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-val" style={{ color: "var(--primary)" }}>{goals.calories}</span>
              <span className="stat-label">Goal</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-val" style={{ color: "var(--accent)" }}>
                {Math.max(0, goals.calories - totals.calories)}
              </span>
              <span className="stat-label">Remaining</span>
            </div>
          </div>
        </div>

        <div className="dash-macros">
          <ProgressBar label="Protein" current={totals.protein} goal={goals.protein} color="protein" />
          <ProgressBar label="Carbs"   current={totals.carbs}   goal={goals.carbs}   color="carbs" />
          <ProgressBar label="Fat"     current={totals.fat}     goal={goals.fat}     color="fat" />
        </div>
      </div>

      {/* Macro micro-stats */}
      <div className="grid-3 mb-24">
        {[
          { label: "Protein", val: totals.protein, unit: "g", color: "var(--protein-color)" },
          { label: "Carbs",   val: totals.carbs,   unit: "g", color: "var(--carbs-color)" },
          { label: "Fat",     val: totals.fat,     unit: "g", color: "var(--fat-color)" },
        ].map(m => (
          <div key={m.label} className="card card-sm" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: m.color }}>{Math.round(m.val)}<span style={{ fontSize: "0.7rem", fontWeight: 500 }}>{m.unit}</span></div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Meals */}
      <div className="section-header">
        <h2 className="section-title"><Flame size={18} style={{ color: "var(--secondary)" }} /> Today's Meals</h2>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/search")}>
          <Plus size={14} /> Add Food
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mealTypes.map(m => (
          <MealSection
            key={m}
            mealType={m}
            foods={dateLog[m]}
            onRemove={(id) => removeFood(today, m, id)}
          />
        ))}
      </div>

      {showGoal && (
        <GoalModal goals={goals} onSave={setGoals} onClose={() => setShowGoal(false)} />
      )}

      <style>{`
        .dash-header { display: flex; align-items: flex-start; justify-content: space-between; }
        .greeting { font-size: 1.5rem; font-weight: 800; }
        .dash-ring-card { padding: 24px; }
        .dash-ring-inner { display: flex; align-items: center; gap: 24px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center; }
        .dash-stats { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 180px; justify-content: center; }
        .stat-item { text-align: center; }
        .stat-val { display: block; font-size: 1.5rem; font-weight: 800; }
        .stat-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
        .stat-divider { width: 1px; height: 40px; background: var(--glass-border); }
        .dash-macros { display: flex; flex-direction: column; gap: 12px; }
      `}</style>
    </div>
  );
}
