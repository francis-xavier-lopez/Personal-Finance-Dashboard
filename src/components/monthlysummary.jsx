import "../assets/css/monthlysummary.css";
import formatCurrency from "../utils/formatcurrency";

function MonthlySummary({ income, expense, transactions }) {
  const savings = income - expense;

  return (
    <div className="monthly-summary">
      <h2>Monthly Summary</h2>

      <div className="monthly-items">
        <div className="tile tile-income">
          <h3>Income</h3>
          <p>{formatCurrency(income)}</p>
        </div>

        <div className="tile tile-expense">
          <h3>Expenses</h3>
          <p>{formatCurrency(expense)}</p>
        </div>

        <div className={savings < 0 ? "tile tile-negative" : "tile tile-savings"}>
          <h3>Savings</h3>
          <p>{formatCurrency(savings)}</p>
        </div>

        <div className="tile tile-count">
          <h3>Transactions</h3>
          <p>{transactions.length}</p>
        </div>
      </div>
    </div>
  );
}

export default MonthlySummary;