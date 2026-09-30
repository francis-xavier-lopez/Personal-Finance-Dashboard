import { useState } from "react";
import "../assets/css/transactionlist.css";

function TransactionList({
  transactions,
  deleteTransaction,
  editTransaction
}) {

  const [filter, setFilter] = useState("all");

  const filteredTransactions = transactions.filter((transaction) => {

    if (filter === "all") {
      return true;
    }

    return transaction.type === filter;
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

      {filteredTransactions.map((transaction) => (

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
            ₹{transaction.amount}
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