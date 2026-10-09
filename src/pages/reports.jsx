
import { useMemo } from "react";
import "../assets/css/reports.css";

function Reports({ transactions }) {
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

  const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

const exportCSV = () => {
    const headers = ["Month", "Income", "Expenses", "Balance"];

    const rows = monthlyReports.map((report) => [
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
    link.download = "monthly-financial-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    };


  return (
    <div className="reports-page">
      <header className="reports-header">
        <h1>Financial Reports</h1>
        <p>Review your monthly income, expenses, and savings.</p>
      </header>

      <section className="reports-table-card">
        <h2>Monthly Income vs. Expenses</h2>

        <button
        type="button"
        className="export-csv-btn"
        onClick={exportCSV}
        disabled={monthlyReports.length === 0}
        >
        Export CSV
        </button>

        {monthlyReports.length === 0 ? (
          <p>No transaction data available yet.</p>
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
                {monthlyReports.map((report) => (
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
                        report.income - report.expense < 0
                          ? "report-expense"
                          : "report-income"
                      }
                    >
                      {formatAmount(
                        report.income - report.expense
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Reports;
