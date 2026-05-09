import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import SearchBar from "../components/SearchBar";
import FoodCard from "../components/FoodCard";
import { foodDatabase, categories, searchFoods, getFoodsByCategory } from "../data/foods";
import { useNutrition } from "../hooks/useNutrition";

export default function FoodSearch() {
  const { today, addFood } = useNutrition();
  const [searchParams] = useSearchParams();
  const defaultMeal = searchParams.get("meal") || "Breakfast";

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [toastMsg, setToastMsg] = useState("");

  const results = useMemo(() => {
    if (query.trim()) return searchFoods(query);
    if (category !== "All") return getFoodsByCategory(category);
    return foodDatabase.slice(0, 30);
  }, [query, category]);

  const handleAdd = (food, meal, qty) => {
    addFood(today, meal, food, qty);
    setToastMsg(`${food.emoji} ${food.name} added to ${meal}!`);
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <div className="page-content animate-fade">
      <div className="mb-24">
        <h1 className="mb-8">Food <span className="gradient-text">Search</span></h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Browse 200+ foods and log them to your meals
        </p>
      </div>

      {/* Search */}
      <div className="mb-16">
        <SearchBar value={query} onChange={setQuery} placeholder="Search foods, e.g. 'chicken', 'banana'…" />
      </div>

      {/* Categories */}
      {!query && (
        <div className="category-scroll mb-20">
          {["All", ...categories].map(cat => (
            <button
              key={cat}
              className={`cat-chip ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="section-header mb-12">
        <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
          {results.length} result{results.length !== 1 ? "s" : ""}
          {query ? ` for "${query}"` : category !== "All" ? ` in ${category}` : " (showing top 30)"}
        </span>
      </div>

      {/* Food grid */}
      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p>No foods found. Try a different search.</p>
        </div>
      ) : (
        <div className="food-grid">
          {results.map(food => (
            <FoodCard key={food.id} food={food} onAdd={handleAdd} defaultMeal={defaultMeal} />
          ))}
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="toast animate-in">
          {toastMsg}
        </div>
      )}

      <style>{`
        .category-scroll {
          display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch;
        }
        .category-scroll::-webkit-scrollbar { display: none; }
        .cat-chip {
          flex-shrink: 0;
          padding: 6px 14px;
          border-radius: 99px;
          border: 1px solid var(--glass-border);
          background: var(--glass);
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .cat-chip.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 4px 12px var(--primary-glow);
        }
        .cat-chip:hover:not(.active) {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }
        .food-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .toast {
          position: fixed;
          bottom: 96px;
          left: 50%;
          transform: translateX(-50%);
          background: #1e1e36;
          border: 1px solid rgba(108,99,255,0.4);
          color: var(--text-primary);
          padding: 10px 20px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
          z-index: 200;
        }
      `}</style>
    </div>
  );
}
