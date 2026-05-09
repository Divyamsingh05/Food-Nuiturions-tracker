import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Tooltip, Legend, Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Tooltip, Legend, Filler
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(16,16,28,0.95)",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#f0f0ff",
      bodyColor: "rgba(240,240,255,0.7)",
      cornerRadius: 10,
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,0.04)" },
      ticks: { color: "rgba(240,240,255,0.5)", font: { size: 11, family: "Inter" } },
      border: { display: false },
    },
    y: {
      grid: { color: "rgba(255,255,255,0.04)" },
      ticks: { color: "rgba(240,240,255,0.5)", font: { size: 11, family: "Inter" } },
      border: { display: false },
    },
  },
};

export function CalorieLineChart({ data, goalLine }) {
  const labels = data.map(d => d.label);
  const values = data.map(d => Math.round(d.calories));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Calories",
        data: values,
        borderColor: "#6c63ff",
        backgroundColor: "rgba(108,99,255,0.12)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6c63ff",
        pointBorderColor: "#0a0a14",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Goal",
        data: Array(labels.length).fill(goalLine),
        borderColor: "rgba(255,101,132,0.5)",
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const opts = {
    ...baseOptions,
    plugins: { ...baseOptions.plugins, legend: { display: true, labels: { color: "rgba(240,240,255,0.6)", boxWidth: 10, font: { size: 11 } } } },
    scales: { ...baseOptions.scales, y: { ...baseOptions.scales.y, min: 0 } },
  };

  return (
    <div style={{ height: 220 }}>
      <Line data={chartData} options={opts} />
    </div>
  );
}

export function MacroBarChart({ data }) {
  const labels = data.map(d => d.label);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Protein",
        data: data.map(d => Math.round(d.protein)),
        backgroundColor: "rgba(108,99,255,0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Carbs",
        data: data.map(d => Math.round(d.carbs)),
        backgroundColor: "rgba(246,201,14,0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: "Fat",
        data: data.map(d => Math.round(d.fat)),
        backgroundColor: "rgba(255,101,132,0.7)",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const opts = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: { display: true, labels: { color: "rgba(240,240,255,0.6)", boxWidth: 10, font: { size: 11 } } },
    },
    scales: {
      ...baseOptions.scales,
      x: { ...baseOptions.scales.x, stacked: true },
      y: { ...baseOptions.scales.y, stacked: true, min: 0 },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Bar data={chartData} options={opts} />
    </div>
  );
}
