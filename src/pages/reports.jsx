
import { useMemo, useState } from "react";
import "../assets/css/reports.css";

function Reports({ transactions }) {
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Format amounts as Indian Rupees
  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  // Create monthly reports from all transactions
  const monthlyReports = useMemo(() => {
    const reports = {};

    transactions.forEach((transaction) => {
      const month = transaction.date?.slice(0, 7);

      if (!month) return;

      if (!reports[month]) {
        reports[month] = {
          month,
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        reports[month].income += Number(transaction.amount);
      } else if (transaction.type === "expense") {
        reports[month].expense += Number(transaction.amount);
      }
    });

    return Object.values(reports).sort((a, b) =>
      b.month.localeCompare(a.month)
    );
  }, [transactions]);

  // Filter report rows by selected month
  const filteredReports = useMemo(() => {
    if (selectedMonth === "all") {
      return monthlyReports;
    }

    return monthlyReports.filter(
      (report) => report.month === selectedMonth
    );
  }, [monthlyReports, selectedMonth]);

  // Calculate totals for the displayed reports
  const totals = useMemo(() => {
    return filteredReports.reduce(
      (result, report) => ({
        income: result.income + report.income,
        expense: result.expense + report.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredReports]);

  // Export the displayed reports to CSV
  const exportCSV = () => {
    const headers = ["Month", "Income", "Expenses", "Balance"];

    const rows = filteredReports.map((report) => [
      new Date(`${report.month}-02T12:00:00`).toLocaleDateString(
        "en-IN",
        { month: "long", year: "numeric" }
      ),
      report.income,
      report.expense,
      report.income - report.expense,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      selectedMonth === "all"
        ? "monthly-financial-report.csv"
        : `financial-report-${selectedMonth}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <header className="reports-header">
        <h1>Financial Reports</h1>
        <p>Review your income, expenses, and savings.</p>
      </header>

      {/* Month filter */}
      <section className="reports-filter">
        <label htmlFor="report-month">Select report period</label>

        <select
          id="report-month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="all">All Months</option>

          {monthlyReports.map((report) => (
            <option key={report.month} value={report.month}>
              {new Date(`${report.month}-02T12:00:00`).toLocaleDateString(
                "en-IN",
                { month: "long", year: "numeric" }
              )}
            </option>
          ))}
        </select>
      </section>

      {/* Summary cards */}
      <section className="reports-summary">
        <div className="reports-summary-card">
          <h3>Total Income</h3>
          <p className="report-income">
            {formatAmount(totals.income)}
          </p>
        </div>

        <div className="reports-summary-card">
          <h3>Total Expenses</h3>
          <p className="report-expense">
            {formatAmount(totals.expense)}
          </p>
        </div>

        <div className="reports-summary-card">
          <h3>Net Balance</h3>
          <p
            className={
              totals.income - totals.expense < 0
                ? "report-expense"
                : "report-income"
            }
          >
            {formatAmount(totals.income - totals.expense)}
          </p>
        </div>
      </section>

      {/* Monthly report table */}
      <section className="reports-table-card">
        <div className="reports-table-header">
          <h2>Monthly Income vs. Expenses</h2>

          <button
            type="button"
            className="export-csv-btn"
            onClick={exportCSV}
            disabled={filteredReports.length === 0}
          >
            Export CSV
          </button>
        </div>

        {filteredReports.length === 0 ? (
          <p>No transaction data available for this period.</p>
        ) : (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => {
                  const balance = report.income - report.expense;

                  return (
                    <tr key={report.month}>
                      <td>
                        {new Date(
                          `${report.month}-02T12:00:00`
                        ).toLocaleDateString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })}
                      </td>

                      <td className="report-income">
                        {formatAmount(report.income)}
                      </td>

                      <td className="report-expense">
                        {formatAmount(report.expense)}
                      </td>

                      <td
                        className={
                          balance < 0
                            ? "report-expense"
                            : "report-income"
                        }
                      >
                        {formatAmount(balance)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Reports;
