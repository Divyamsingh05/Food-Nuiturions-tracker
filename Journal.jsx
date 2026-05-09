import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MealSection from "../components/MealSection";
import ProgressBar from "../components/ProgressBar";
import { useNutrition } from "../hooks/useNutrition";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export default function Journal() {
  const { today, getDateLog, removeFood, getDayTotals, goals, MEAL_TYPES } = useNutrition();
  const [selectedDate, setSelectedDate] = useState(today);

  const dateLog = getDateLog(selectedDate);
  const totals = getDayTotals(selectedDate);
  const isToday = selectedDate === today;
  const isFuture = selectedDate > today;

  const totalFoods = MEAL_TYPES.reduce((n, m) => n + dateLog[m].length, 0);

  return (
    <div className="page-content animate-fade">
      <div className="mb-20">
        <h1 className="mb-4">Food <span className="gradient-text">Journal</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>View and manage your daily meal logs</p>
      </div>

      {/* Date Picker */}
      <div className="card date-nav mb-16">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setSelectedDate(d => addDays(d, -1))}
        >
          <ChevronLeft size={18} />
        </button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            {isToday ? "Today" : formatDate(selectedDate)}
          </div>
          {!isToday && (
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
              {formatDate(selectedDate)}
            </div>
          )}
        </div>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setSelectedDate(d => addDays(d, 1))}
          disabled={isToday}
          style={{ opacity: isToday ? 0.3 : 1 }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {isFuture ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔮</div>
          <p>No data for future dates.</p>
        </div>
      ) : totalFoods === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p>No meals logged on this day.</p>
        </div>
      ) : (
        <>
          {/* Day Summary */}
          <div className="card mb-16" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontWeight: 700 }}>Day Summary</span>
              <div className="chip chip-cal">
                {Math.round(totals.calories)} / {goals.calories} kcal
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ProgressBar label="Protein" current={totals.protein} goal={goals.protein} color="protein" />
              <ProgressBar label="Carbs"   current={totals.carbs}   goal={goals.carbs}   color="carbs" />
              <ProgressBar label="Fat"     current={totals.fat}     goal={goals.fat}     color="fat" />
            </div>
          </div>

          {/* Meals */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MEAL_TYPES.map(m => (
              dateLog[m].length > 0 && (
                <MealSection
                  key={m}
                  mealType={m}
                  foods={dateLog[m]}
                  onRemove={isToday ? (id) => removeFood(selectedDate, m, id) : null}
                  compact={!isToday}
                />
              )
            ))}
          </div>
        </>
      )}

      <style>{`
        .date-nav {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
        }
      `}</style>
    </div>
  );
}
