import "../assets/css/charts.css";

import FinanceChart from "../components/financechart";
import ExpenseChart from "../components/expensechart";
import MonthlySummary from "../components/monthlysummary";

function Charts({ income, expense, transactions }) {
  return (
    <div className="charts-page">
      <header className="charts-header">
        <h1>Charts &amp; Analytics</h1>
        <p>Understand your financial activity</p>
      </header>

      <section className="summary-card">
        <MonthlySummary
          income={income}
          expense={expense}
          transactions={transactions}
        />
      </section>

      <section className="charts-container">
        <div className="chart-card finance-card">
          <FinanceChart income={income} expense={expense} />
        </div>

        <div className="chart-card expense-card">
          <ExpenseChart transactions={transactions} />
        </div>
      </section>
    </div>
  );
}

export default Charts;