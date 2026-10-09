
import { useState } from "react";
import "../assets/css/transactions.css";
import TransactionList from "../components/transactionlist";
import EditTransaction from "../components/edittransaction";

function Transactions({
  transactions,
  deleteTransaction,
  editTransaction,
  editingTransaction,
  setEditingTransaction,
  saveEdit,
}) {
  const [selectedMonth, setSelectedMonth] = useState("all");

  const filteredTransactions =
    selectedMonth === "all"
      ? transactions
      : transactions.filter((transaction) =>
          transaction.date?.startsWith(selectedMonth)
        );

  return (
    <div className="transactions-page">
      <header className="transactions-header">
        <h1>Transactions</h1>
        <p>View and manage all your transactions</p>
      </header>

      <div className="transaction-filter">
        <label htmlFor="transaction-month">
          Filter by month:
        </label>

        <select
          id="transaction-month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="all">All Months</option>
          {[
            ...new Set(
              transactions
                .map((transaction) => transaction.date?.slice(0, 7))
                .filter(Boolean)
            ),
          ]
            .sort()
            .reverse()
            .map((month) => (
              <option key={month} value={month}>
                {new Date(`${month}-02T12:00:00`).toLocaleDateString(
                  undefined,
                  { month: "long", year: "numeric" }
                )}
              </option>
            ))}
        </select>
      </div>

      {editingTransaction && (
        <div className="edit-wrapper">
          <EditTransaction
            editingTransaction={editingTransaction}
            setEditingTransaction={setEditingTransaction}
            saveEdit={saveEdit}
          />
        </div>
      )}

      <TransactionList
        transactions={filteredTransactions}
        deleteTransaction={deleteTransaction}
        editTransaction={editTransaction}
      />
    </div>
  );
}

export default Transactions;
