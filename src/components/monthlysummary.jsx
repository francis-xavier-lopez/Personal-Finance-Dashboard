import "../assets/css/monthlysummary.css";
import formatCurrency from "../utils/formatcurrency";

function MonthlySummary({ income, expense, transactions }) {

  return (
    <div className="monthly-summary">

      <h2>Monthly Summary</h2>

      <div className="monthly-items">

        <div>
          <h3>Income</h3>
          <p>{formatCurrency(income)}</p>
        </div>

        <div>
          <h3>Expenses</h3>
          <p>{formatCurrency(expense)}</p>
        </div>

        <div>
          <h3>Savings</h3>
          <p>{formatCurrency(income - expense)}</p>
        </div>

        <div>
          <h3>Transactions</h3>
          <p>{transactions.length}</p>
        </div>

      </div>

    </div>
  );
}

export default MonthlySummary;