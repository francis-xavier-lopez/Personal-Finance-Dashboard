import "../assets/css/dashboard.css";

import AddIncome from "../components/addincome";
import AddExpense from "../components/addexpense";

const fmt = (n) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const navItems = ["Dashboard", "Incomes", "Expenses", "Savings", "Reports"];

function Dashboard({
  income,
  expense,
  balance,
  setTransactions,
  selectedMonth,
  setSelectedMonth,
}) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const savingsRate =
    Number(income) > 0 ? Math.round((Number(balance) / Number(income)) * 100) : 0;

  return (
    <div className="dashboard-page">

      {/* Main */}
      <main className="main">
        
        <header className="topbar">
          <span className="date">{today}</span>

          <div className="month-selector">
            <label htmlFor="selected-month">Select month:</label>
            <input
              id="selected-month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>

          <div className="user">
            <span>Welcome back</span>
            <div className="avatar">U</div>
          </div>
        </header>


        {/* Stats strip */}
        <section className="stats-strip">
          <div className="stat">
            <small>Income from sources</small>
            <strong>{fmt(income)}</strong>
            <small>
              {new Date(`${selectedMonth}-02T12:00:00`).toLocaleDateString(
                undefined,
                { month: "long", year: "numeric" }
              )}
            </small>
          </div>
          <div className="stat">
            <small>Total expenses</small>
            <strong>{fmt(expense)}</strong>
            <small>
              {new Date(`${selectedMonth}-02T12:00:00`).toLocaleDateString(
                undefined,
                { month: "long", year: "numeric" }
              )}
            </small>
          </div>
          <div className="stat">
            <small>Total savings</small>
            <strong>{fmt(balance)}</strong>
            <small>
              {new Date(`${selectedMonth}-02T12:00:00`).toLocaleDateString(
                undefined,
                { month: "long", year: "numeric" }
              )}
            </small>
          </div>
        </section>

        {/* Quick overview */}
        <h2 className="section-title">Quick Overview</h2>
        <section className="overview">
          <div className="o-card mint">
            <span className="o-value">{fmt(income)}</span>
            <span className="o-label">Total Income</span>
            <div className="bars" aria-hidden="true">
              {[40, 65, 50, 80, 35, 60, 90, 55].map((h, i) => (
                <i key={i} style={{ height: h + "%" }} />
              ))}
            </div>
          </div>

          <div className="o-card teal">
            <span className="o-value">{fmt(expense)}</span>
            <span className="o-label">Total Expenses</span>
            <svg className="wave" viewBox="0 0 200 60" aria-hidden="true">
              <path
                d="M0 40 C25 5, 40 5, 60 35 S95 60, 120 20 S170 0, 200 40"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          <div className="o-card amber">
            <span className="o-value">{fmt(balance)}</span>
            <span className="o-label">Balance</span>
          </div>

          <div className="o-card sky">
            <span className="o-value">{savingsRate}%</span>
            <span className="o-label">Savings rate</span>
          </div>
        </section>

        {/* Forms */}
        <h2 className="section-title">Add Transaction</h2>
        <section className="forms-container">
          <div className="form-card income-card">
            <AddIncome setTransactions={setTransactions} />
          </div>
          <div className="form-card expense-card">
            <AddExpense
              setTransactions={setTransactions}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;