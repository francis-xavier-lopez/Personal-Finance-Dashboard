import { useState } from "react";
import "../assets/css/transactionlist.css";
import formatCurrency from "../utils/formatcurrency";

function TransactionList({
  transactions,
  deleteTransaction,
  editTransaction,
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.type === filter;

    const matchesSearch =
      transaction.title.toLowerCase().includes(search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(search.toLowerCase());

    const matchesFromDate = !dateFrom || transaction.date >= dateFrom;
    const matchesToDate = !dateTo || transaction.date <= dateTo;

    return matchesFilter && matchesSearch && matchesFromDate && matchesToDate;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sort === "low") return a.amount - b.amount;
    if (sort === "high") return b.amount - a.amount;

    // "latest": newest date first, then newest entry first
    return b.date.localeCompare(a.date) || b.id - a.id;
  });

  const hasActiveFilters =
    filter !== "all" || search || dateFrom || dateTo || sort !== "latest";

  const resetFilters = () => {
    setFilter("all");
    setSearch("");
    setSort("latest");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2>Recent Transactions</h2>
        <span className="result-count">
          {sortedTransactions.length} of {transactions.length}
        </span>
      </div>

      {/* Filters */}
      <div className="toolbar">
        <div className="tool search">
          <label htmlFor="tx-search">Search</label>
          <input
            id="tx-search"
            type="text"
            placeholder="Search by title or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tool">
          <label htmlFor="tx-type">Type</label>
          <select
            id="tx-type"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="tool">
          <label htmlFor="tx-sort">Sort by</label>
          <select
            id="tx-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="low">Amount: Low → High</option>
            <option value="high">Amount: High → Low</option>
          </select>
        </div>

        <div className="tool">
          <label htmlFor="tx-from">From</label>
          <input
            id="tx-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="tool">
          <label htmlFor="tx-to">To</label>
          <input
            id="tx-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button className="reset-btn" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* List */}
      {sortedTransactions.length === 0 && (
        <p className="empty-state">
          {transactions.length === 0
            ? "No transactions yet. Add income or an expense on the Dashboard."
            : "No transactions match your filters."}
        </p>
      )}

      <div className="transaction-list">
        {sortedTransactions.map((transaction) => (
          <div
            className={`transaction ${transaction.type}`}
            key={transaction.id}
          >
            <span className="tx-icon" aria-hidden="true">
              {transaction.type === "income" ? "↑" : "↓"}
            </span>

            <div className="tx-details">
              <h3>{transaction.title}</h3>
              <p>
                <span className="badge">{transaction.type}</span>
                <span>{transaction.category}</span>
                <span className="dot" aria-hidden="true">•</span>
                <span>{transaction.date}</span>
              </p>
            </div>

            <p
              className={
                transaction.type === "income"
                  ? "tx-amount income-amount"
                  : "tx-amount expense-amount"
              }
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>

            <div className="tx-actions">
              <button
                className="edit-btn"
                onClick={() => editTransaction(transaction.id)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteTransaction(transaction.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;