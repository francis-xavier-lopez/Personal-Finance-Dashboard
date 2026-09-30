import "../assets/css/summarycards.css";

function SummaryCards({ income, expense, balance }) {

  return (
    <div className="summary-container">

      <div className="summary-card">
        <h3>Total Balance</h3>
        <p>₹{balance}</p>
      </div>

      <div className="summary-card">
        <h3>Total Income</h3>
        <p>₹{income}</p>
      </div>

      <div className="summary-card">
        <h3>Total Expenses</h3>
        <p>₹{expense}</p>
      </div>

    </div>
  );
}

export default SummaryCards;