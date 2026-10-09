
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import "../assets/css/expensechart.css";
import formatCurrency from "../utils/formatcurrency";

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.defaults.font.family = "Poppins, system-ui, sans-serif";
ChartJS.defaults.color = "#6b7280";

const COLORS = [
  "#1fd5b5",
  "#ffc107",
  "#5aa7b8",
  "#a8f0e2",
  "#ff8a65",
  "#94a3b8",
];

function ExpenseChart({ transactions }) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    const category = transaction.category || "Uncategorized";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(transaction.amount);
  });

  const categories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const totalExpenses = categories.reduce(
    (total, item) => total + item.amount,
    0
  );

  const highestCategory = categories[0];

  const labels = categories.map((item) => item.category);

  const data = {
    labels,
    datasets: [
      {
        data: categories.map((item) => item.amount),
        backgroundColor: labels.map(
          (_, index) => COLORS[index % COLORS.length]
        ),
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
        labels: {
          usePointStyle: true,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const percentage =
              totalExpenses > 0
                ? ((ctx.parsed / totalExpenses) * 100).toFixed(1)
                : "0.0";

            return ` ${ctx.label}: ${formatCurrency(ctx.parsed)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="expense-chart">
      <h2>Expense Breakdown</h2>

      {expenses.length > 0 ? (
        <>
          <div className="expense-insights">
            <div className="expense-insight-card">
              <span>Total Expenses</span>
              <strong>{formatCurrency(totalExpenses)}</strong>
            </div>

            <div className="expense-insight-card">
              <span>Highest Spending</span>
              <strong>{highestCategory.category}</strong>
              <small>
                {formatCurrency(highestCategory.amount)} (
                {((highestCategory.amount / totalExpenses) * 100).toFixed(1)}%)
              </small>
            </div>
          </div>

          <div className="chart-area">
            <Doughnut data={data} options={options} />
          </div>

          <div className="category-breakdown">
            <h3>Spending by Category</h3>

            {categories.map((item, index) => {
              const percentage =
                (item.amount / totalExpenses) * 100;

              return (
                <div className="category-item" key={item.category}>
                  <div className="category-item-header">
                    <span>
                      <i
                        className="category-dot"
                        style={{
                          backgroundColor:
                            COLORS[index % COLORS.length],
                        }}
                      />
                      {item.category}
                    </span>

                    <strong>{formatCurrency(item.amount)}</strong>
                  </div>

                  <div className="category-progress-track">
                    <div
                      className="category-progress-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          COLORS[index % COLORS.length],
                      }}
                    />
                  </div>

                  <small>{percentage.toFixed(1)}% of expenses</small>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="empty-state">
          No expenses yet. Add one on the Dashboard to see your breakdown.
        </p>
      )}
    </div>
  );
}

export default ExpenseChart;
