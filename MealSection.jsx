import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mealIcons = {
  Breakfast: "🌅",
  Lunch: "☀️",
  Dinner: "🌙",
  Snacks: "🍎",
};

const mealColors = {
  Breakfast: "var(--warning)",
  Lunch:     "var(--accent)",
  Dinner:    "var(--primary)",
  Snacks:    "var(--secondary)",
};

export default function MealSection({ mealType, foods = [], onRemove, compact = false }) {
  const navigate = useNavigate();
  const total = foods.reduce((s, f) => s + f.calories, 0);

  return (
    <div className="meal-section card">
      <div className="meal-section-header">
        <div className="meal-title">
          <span className="meal-icon">{mealIcons[mealType]}</span>
          <span className="meal-name">{mealType}</span>
          {foods.length > 0 && (
            <span className="meal-cal-badge">{Math.round(total)} cal</span>
          )}
        </div>
        {!compact && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/search?meal=${mealType}`)}
          >
            + Add
          </button>
        )}
      </div>

      {foods.length === 0 ? (
        <p className="meal-empty">No foods logged</p>
      ) : (
        <div className="meal-foods">
          {foods.map((food) => (
            <div key={food.loggedId} className="meal-food-row animate-in">
              <span className="food-emoji">{food.emoji}</span>
              <div className="food-info">
                <span className="food-name">{food.name}</span>
                <span className="food-serving">
                  {food.quantity !== 1 ? `${food.quantity}× ` : ""}{food.serving}
                </span>
              </div>
              <div className="food-macros">
                <span className="chip chip-cal">{food.calories} cal</span>
              </div>
              {onRemove && (
                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => onRemove(food.loggedId)}
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .meal-section { margin-bottom: 0; }
        .meal-section-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
        }
        .meal-title { display: flex; align-items: center; gap: 8px; }
        .meal-icon { font-size: 1.2rem; }
        .meal-name { font-weight: 700; font-size: 0.95rem; }
        .meal-cal-badge {
          font-size: 0.7rem; font-weight: 600;
          background: rgba(255,255,255,0.08); padding: 2px 8px;
          border-radius: 99px; color: var(--text-secondary);
        }
        .meal-empty { font-size: 0.82rem; color: var(--text-muted); }
        .meal-foods { display: flex; flex-direction: column; gap: 8px; }
        .meal-food-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px; background: rgba(255,255,255,0.03);
          border-radius: 10px; border: 1px solid var(--glass-border);
        }
        .food-emoji { font-size: 1.3rem; min-width: 28px; text-align: center; }
        .food-info { flex: 1; min-width: 0; }
        .food-name { display: block; font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .food-serving { display: block; font-size: 0.72rem; color: var(--text-muted); margin-top: 1px; }
        .food-macros { display: flex; gap: 4px; flex-shrink: 0; }
      `}</style>
    </div>
  );
}
