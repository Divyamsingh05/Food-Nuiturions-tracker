import { useState } from "react";
import { Target, Calculator, Trash2, ChevronRight } from "lucide-react";
import { useNutrition } from "../hooks/useNutrition";

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: "Underweight", color: "var(--info)" };
  if (bmi < 25)   return { label: "Normal weight", color: "var(--accent)" };
  if (bmi < 30)   return { label: "Overweight", color: "var(--warning)" };
  return { label: "Obese", color: "var(--secondary)" };
}

export default function Settings() {
  const { goals, setGoals, clearData } = useNutrition();
  const [form, setForm] = useState({ ...goals });
  const [saved, setSaved] = useState(false);
  const [showClear, setShowClear] = useState(false);

  // BMI
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(1) : null;
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: Math.max(0, Number(e.target.value)) }));

  const handleSave = () => {
    setGoals(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const macros = [
    { key: "calories", label: "Daily Calories", unit: "kcal", color: "var(--primary)", max: 5000 },
    { key: "protein",  label: "Protein",         unit: "g",    color: "var(--protein-color)", max: 500 },
    { key: "carbs",    label: "Carbohydrates",   unit: "g",    color: "var(--carbs-color)",   max: 800 },
    { key: "fat",      label: "Fat",             unit: "g",    color: "var(--fat-color)",     max: 300 },
  ];

  // Suggested macros from calorie goal
  const pctSuggested = {
    protein: Math.round((form.calories * 0.25) / 4),
    carbs:   Math.round((form.calories * 0.50) / 4),
    fat:     Math.round((form.calories * 0.25) / 9),
  };

  return (
    <div className="page-content animate-fade">
      <div className="mb-24">
        <h1 className="mb-4">⚙️ <span className="gradient-text">Settings</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Personalize your goals and preferences</p>
      </div>

      {/* Goals */}
      <div className="card mb-16">
        <div className="section-header mb-20">
          <h2 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1rem" }}>
            <Target size={18} style={{ color: "var(--primary)" }} /> Daily Nutrition Goals
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {macros.map(m => (
            <div key={m.key}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ color: m.color, marginBottom: 0 }}>{m.label}</label>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Max {m.max} {m.unit}</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="range"
                  className="goal-slider"
                  min={m.key === "calories" ? 500 : 0}
                  max={m.max}
                  step={m.key === "calories" ? 50 : 5}
                  value={form[m.key]}
                  onChange={set(m.key)}
                  style={{ "--slider-color": m.color }}
                />
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    className="input"
                    value={form[m.key]}
                    onChange={set(m.key)}
                    style={{ width: 90, textAlign: "center", padding: "8px 10px" }}
                  />
                  <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", color: "var(--text-muted)", pointerEvents: "none" }}>{m.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion */}
        <div className="suggestion-banner mt-16">
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            💡 Suggested for {form.calories} kcal:&nbsp;
            <strong style={{ color: "var(--protein-color)" }}>P {pctSuggested.protein}g</strong>&nbsp;
            <strong style={{ color: "var(--carbs-color)" }}>C {pctSuggested.carbs}g</strong>&nbsp;
            <strong style={{ color: "var(--fat-color)" }}>F {pctSuggested.fat}g</strong>
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setForm(f => ({ ...f, ...pctSuggested }))}
            style={{ fontSize: "0.72rem", padding: "4px 10px" }}
          >
            Apply
          </button>
        </div>

        <button
          className={`btn btn-primary mt-16`}
          style={{ width: "100%" }}
          onClick={handleSave}
        >
          {saved ? "✓ Goals Saved!" : "Save Goals"}
        </button>
      </div>

      {/* BMI Calculator */}
      <div className="card mb-16">
        <h2 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1rem", marginBottom: 16 }}>
          <Calculator size={18} style={{ color: "var(--accent)" }} /> BMI Calculator
        </h2>

        <div className="grid-2 mb-16">
          <div>
            <label>Height (cm)</label>
            <input
              type="number"
              className="input"
              placeholder="175"
              value={height}
              onChange={e => setHeight(e.target.value)}
            />
          </div>
          <div>
            <label>Weight (kg)</label>
            <input
              type="number"
              className="input"
              placeholder="70"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </div>
        </div>

        {bmi && bmiInfo && (
          <div className="bmi-result animate-in">
            <div className="bmi-val">{bmi}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: bmiInfo.color }}>{bmiInfo.label}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 3 }}>Body Mass Index</div>
            </div>
          </div>
        )}

        <div className="bmi-scale">
          {[
            { label: "Underweight", range: "< 18.5", color: "var(--info)" },
            { label: "Normal",      range: "18.5–24.9", color: "var(--accent)" },
            { label: "Overweight",  range: "25–29.9", color: "var(--warning)" },
            { label: "Obese",       range: "≥ 30", color: "var(--secondary)" },
          ].map(r => (
            <div key={r.label} className="bmi-range">
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>{r.label}</span>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "auto" }}>{r.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ borderColor: "rgba(255,101,132,0.2)" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: 16, color: "var(--secondary)" }}>⚠️ Danger Zone</h2>
        {!showClear ? (
          <button className="btn btn-danger" style={{ width: "100%" }} onClick={() => setShowClear(true)}>
            <Trash2 size={15} /> Clear All Data
          </button>
        ) : (
          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 14 }}>
              This will permanently delete all your logged meals. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowClear(false)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => { clearData(); setShowClear(false); }}>
                Yes, Delete All
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .goal-slider {
          flex: 1;
          -webkit-appearance: none;
          height: 6px;
          border-radius: 99px;
          background: rgba(255,255,255,0.1);
          outline: none;
          cursor: pointer;
        }
        .goal-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--slider-color, var(--primary));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          border: 2px solid #0a0a14;
        }
        .suggestion-banner {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          background: rgba(108,99,255,0.08); border: 1px solid rgba(108,99,255,0.2);
          border-radius: 10px; padding: 10px 14px; flex-wrap: wrap;
        }
        .bmi-result {
          display: flex; align-items: center; gap: 16px;
          background: rgba(255,255,255,0.04); border-radius: 12px; padding: 16px;
          margin-bottom: 16px;
        }
        .bmi-val {
          font-size: 2.5rem; font-weight: 900; letter-spacing: -0.04em;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .bmi-scale { display: flex; flex-direction: column; gap: 6px; }
        .bmi-range { display: flex; align-items: center; gap: 8px; }
        .mt-16 { margin-top: 16px; }
      `}</style>
    </div>
  );
}
