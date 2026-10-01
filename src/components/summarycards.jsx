import "../assets/css/summarycards.css";
import formatCurrency from "../utils/formatcurrency";

function SummaryCards({ income, expense, balance }) {

  return (
    <div className="summary-container">

      <div className="summary-card">
        <h3>Total Balance</h3>
        <p>{formatCurrency(balance)}</p>
      </div>

      <div className="summary-card">
        <h3>Total Income</h3>
        <p>{formatCurrency(income)}</p>
      </div>

      <div className="summary-card">
        <h3>Total Expenses</h3>
        <p>{formatCurrency(expense)}</p>
      </div>

    </div>
  );
}

export default SummaryCards;