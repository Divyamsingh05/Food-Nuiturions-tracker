import { useLocalStorage } from "./useLocalStorage";

const DEFAULT_GOALS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 65,
};

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export function useNutrition() {
  const [goals, setGoals] = useLocalStorage("nutrition_goals", DEFAULT_GOALS);
  const [log, setLog] = useLocalStorage("nutrition_log", {});

  const today = new Date().toISOString().split("T")[0];

  const getDateLog = (date) => log[date] || { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };

  const addFood = (date, mealType, food, quantity = 1) => {
    setLog((prev) => {
      const dateLog = prev[date] || { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };
      return {
        ...prev,
        [date]: {
          ...dateLog,
          [mealType]: [
            ...dateLog[mealType],
            {
              ...food,
              quantity,
              loggedId: Date.now() + Math.random(),
              calories: Math.round(food.calories * quantity),
              protein: Math.round(food.protein * quantity * 10) / 10,
              carbs: Math.round(food.carbs * quantity * 10) / 10,
              fat: Math.round(food.fat * quantity * 10) / 10,
              fiber: Math.round((food.fiber || 0) * quantity * 10) / 10,
            },
          ],
        },
      };
    });
  };

  const removeFood = (date, mealType, loggedId) => {
    setLog((prev) => {
      const dateLog = prev[date] || { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };
      return {
        ...prev,
        [date]: {
          ...dateLog,
          [mealType]: dateLog[mealType].filter((f) => f.loggedId !== loggedId),
        },
      };
    });
  };

  const getDayTotals = (date) => {
    const dateLog = getDateLog(date);
    return MEAL_TYPES.reduce(
      (totals, meal) => {
        dateLog[meal].forEach((food) => {
          totals.calories += food.calories;
          totals.protein += food.protein;
          totals.carbs += food.carbs;
          totals.fat += food.fat;
          totals.fiber += food.fiber || 0;
        });
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const getWeekData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const totals = getDayTotals(dateStr);
      days.push({
        date: dateStr,
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        ...totals,
      });
    }
    return days;
  };

  const getStreak = () => {
    let streak = 0;
    let d = new Date();
    while (true) {
      const dateStr = d.toISOString().split("T")[0];
      const totals = getDayTotals(dateStr);
      if (totals.calories === 0) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const clearData = () => {
    setLog({});
  };

  return {
    goals,
    setGoals,
    log,
    today,
    getDateLog,
    addFood,
    removeFood,
    getDayTotals,
    getWeekData,
    getStreak,
    clearData,
    MEAL_TYPES,
  };
}
