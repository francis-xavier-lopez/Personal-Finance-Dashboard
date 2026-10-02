import { useState } from "react";

import Sidebar from "./components/sidebar";

import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";
import Charts from "./pages/charts";
import "./assets/css/app.css";

function App() {

  const [activePage, setActivePage] = useState("dashboard");

  const [income, setIncome] = useState(40000);
  const [expense, setExpense] = useState(25000);

  const balance = income - expense;

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      title: "Salary",
      type: "income",
      amount: 40000,
      category: "Salary",
      date: "2026-09-28"
    },
    {
      id: 2,
      title: "Food",
      type: "expense",
      amount: 500,
      category: "Food",
      date: "2026-09-28"
    },
    {
      id: 3,
      title: "Travel",
      type: "expense",
      amount: 300,
      category: "Travel",
      date: "2026-09-28"
    }
  ]);

  const deleteTransaction = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
      return;
    }

    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  const [editingTransaction, setEditingTransaction] = useState(null);
    const editTransaction = (id) => {

    const transaction = transactions.find(
      (transaction) => transaction.id === id
    );

    setEditingTransaction(transaction);
  };

  const saveEdit = () => {

    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        transaction.id === editingTransaction.id
          ? editingTransaction
          : transaction
      )
    );

    setEditingTransaction(null);
  };

  const renderPage = () => {

    if (activePage === "dashboard") {
      return (
        <Dashboard
          income={income}
          expense={expense}
          balance={balance}
          setIncome={setIncome}
          setExpense={setExpense}
          setTransactions={setTransactions}
        />
      );
    }

    if (activePage === "transactions") {
      return (
        <Transactions
          transactions={transactions}
          deleteTransaction={deleteTransaction}
          editTransaction={editTransaction}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          saveEdit={saveEdit}
        />
      );
    }

    if (activePage === "charts") {
      return (
        <Charts
          income={income}
          expense={expense}
          transactions={transactions}
        />
      );
    }

  };

  return (
    <div className="app-layout">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        {renderPage()}
      </main>

    </div>
  );
}

export default App;