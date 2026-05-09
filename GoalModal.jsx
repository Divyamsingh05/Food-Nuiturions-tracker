import { useState } from "react";
import { X } from "lucide-react";

export default function GoalModal({ goals, onSave, onClose }) {
  const [form, setForm] = useState({ ...goals });

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: Math.max(0, Number(e.target.value)) }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎯 Set Daily Goals</h2>
          <button className="btn btn-icon btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label>Daily Calories (kcal)</label>
            <input className="input" type="number" value={form.calories} onChange={set("calories")} min={500} max={5000} />
          </div>
          <div>
            <label>Protein (g)</label>
            <input className="input" type="number" value={form.protein} onChange={set("protein")} min={0} max={500} />
          </div>
          <div>
            <label>Carbohydrates (g)</label>
            <input className="input" type="number" value={form.carbs} onChange={set("carbs")} min={0} max={800} />
          </div>
          <div>
            <label>Fat (g)</label>
            <input className="input" type="number" value={form.fat} onChange={set("fat")} min={0} max={300} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            style={{ flex: 2 }}
            onClick={() => { onSave(form); onClose(); }}
          >
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
}
