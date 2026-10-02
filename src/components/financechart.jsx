import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import "../assets/css/financechart.css";
import formatCurrency from "../utils/formatcurrency";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

ChartJS.defaults.font.family = "Poppins, system-ui, sans-serif";
ChartJS.defaults.color = "#6b7280";

function FinanceChart({ income, expense }) {
  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense],
        backgroundColor: ["#1fd5b5", "#ffc107"],
        hoverBackgroundColor: ["#0fb99b", "#e6ac00"],
        borderRadius: 12,
        borderSkipped: false,
        maxBarThickness: 90,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) => formatCurrency(ctx.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f1f3f5" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="finance-chart">
      <h2>Income vs Expenses</h2>

      <div className="chart-area">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default FinanceChart;