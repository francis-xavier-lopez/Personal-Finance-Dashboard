import { useState } from "react";
import "../assets/css/transactionlist.css";
import formatCurrency from "../utils/formatcurrency";

function TransactionList({
  transactions,
  deleteTransaction,
  editTransaction
}) {

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const filteredTransactions = transactions.filter((transaction) => {

    const matchesFilter =
      filter === "all" || transaction.type === filter;

    const matchesSearch =
      transaction.title.toLowerCase().includes(search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {

    if (sort === "low") {
      return a.amount - b.amount;
    }

    if (sort === "high") {
      return b.amount - a.amount;
    }

    return 0;
  });

  return (
    <div className="transaction-container">

      <h2>Recent Transactions</h2>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="low">Amount: Low → High</option>
        <option value="high">Amount: High → Low</option>
      </select>

      {filteredTransactions.length === 0 && (
        <p>No transactions found.</p>
      )}

      {sortedTransactions.map((transaction) => (

        <div className="transaction" key={transaction.id}>

          <div>
            <h3>{transaction.title}</h3>

            <p>
              {transaction.type} • {transaction.category} • {transaction.date}
            </p>
          </div>

          <p
            className={
              transaction.type === "income"
                ? "income-amount"
                : "expense-amount"
            }
          >
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>

          <button onClick={() => editTransaction(transaction.id)}>
            Edit
          </button>

          <button onClick={() => deleteTransaction(transaction.id)}>
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default TransactionList;