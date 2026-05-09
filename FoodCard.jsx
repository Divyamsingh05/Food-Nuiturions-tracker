import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mealOptions = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export default function FoodCard({ food, onAdd, defaultMeal = "Breakfast" }) {
  const [qty, setQty] = useState(1);
  const [meal, setMeal] = useState(defaultMeal);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(food, meal, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const scaled = (val) => Math.round(val * qty * 10) / 10;

  return (
    <div className="food-card card">
      <div className="fc-header">
        <span className="fc-emoji">{food.emoji}</span>
        <div className="fc-info">
          <h3 className="fc-name">{food.name}</h3>
          <p className="fc-serving">{food.serving}</p>
        </div>
        <span className="fc-cal">{scaled(food.calories)} <sub>cal</sub></span>
      </div>

      <div className="fc-chips">
        <span className="chip chip-protein">P {scaled(food.protein)}g</span>
        <span className="chip chip-carbs">C {scaled(food.carbs)}g</span>
        <span className="chip chip-fat">F {scaled(food.fat)}g</span>
        {food.fiber > 0 && <span className="chip chip-fiber">Fiber {scaled(food.fiber)}g</span>}
      </div>

      <div className="fc-actions">
        <div className="fc-qty-wrap">
          <button className="qty-btn" onClick={() => setQty(q => Math.max(0.5, q - 0.5))}>−</button>
          <span className="qty-val">{qty}×</span>
          <button className="qty-btn" onClick={() => setQty(q => q + 0.5)}>+</button>
        </div>

        <select
          className="input fc-meal-sel"
          value={meal}
          onChange={e => setMeal(e.target.value)}
        >
          {mealOptions.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <button
          className={`btn btn-primary btn-sm fc-add-btn ${added ? "fc-added" : ""}`}
          onClick={handleAdd}
        >
          {added ? "✓ Added!" : "+ Log"}
        </button>
      </div>

      <style>{`
        .food-card { display: flex; flex-direction: column; gap: 12px; transition: all 0.25s ease; }
        .food-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
        .fc-header { display: flex; align-items: flex-start; gap: 12px; }
        .fc-emoji { font-size: 2rem; }
        .fc-info { flex: 1; min-width: 0; }
        .fc-name { font-size: 0.95rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .fc-serving { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
        .fc-cal { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; }
        .fc-cal sub { font-size: 0.6rem; font-weight: 500; color: var(--text-muted); }
        .fc-chips { display: flex; flex-wrap: wrap; gap: 5px; }
        .fc-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .fc-qty-wrap { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 2px 6px; }
        .qty-btn { background: none; border: none; color: var(--text-primary); font-size: 1rem; cursor: pointer; padding: 2px 4px; line-height: 1; font-weight: 700; }
        .qty-btn:hover { color: var(--primary); }
        .qty-val { font-size: 0.85rem; font-weight: 700; min-width: 28px; text-align: center; }
        .fc-meal-sel { flex: 1; min-width: 90px; padding: 7px 10px; font-size: 0.8rem; cursor: pointer; }
        .fc-add-btn { flex-shrink: 0; transition: all 0.25s ease !important; }
        .fc-added { background: linear-gradient(135deg, var(--accent), #79f7a6) !important; }
      `}</style>
    </div>
  );
}
