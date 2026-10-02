import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import "../assets/css/expensechart.css";
import formatCurrency from "../utils/formatcurrency";

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.defaults.font.family = "Poppins, system-ui, sans-serif";
ChartJS.defaults.color = "#6b7280";

const COLORS = [
  "#1fd5b5", // teal
  "#ffc107", // amber
  "#5aa7b8", // blue-teal
  "#a8f0e2", // mint
  "#ff8a65", // coral
  "#94a3b8", // slate
];

function ExpenseChart({ transactions }) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    categoryTotals[transaction.category] =
      (categoryTotals[transaction.category] || 0) + transaction.amount;
  });

  const labels = Object.keys(categoryTotals);

  const data = {
    labels,
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 3,
        borderColor: "#fff",
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 16 },
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="expense-chart">
      <h2>Expense Breakdown</h2>

      {expenses.length > 0 ? (
        <div className="chart-area">
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <p className="empty-state">
          No expenses yet. Add one on the Dashboard to see your breakdown.
        </p>
      )}
    </div>
  );
}

export default ExpenseChart;