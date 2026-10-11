
import { useEffect, useState } from "react";

import Sidebar from "./components/sidebar";

import Dashboard from "./pages/dashboard";
import Transactions from "./pages/transactions";
import Charts from "./pages/charts";
import Settings from "./pages/settings";
import Reports from "./pages/reports";
import Budgets from "./pages/budgets";

import "./assets/css/app.css";

import api from "./api/api";
import Login from "./components/login";
import Register from "./components/register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  const [showLogin, setShowLogin] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();

    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0")
    );
  });

  // Fetch transactions after login
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchTransactions = async () => {
      try {
        const response = await api.get("transactions/");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [isLoggedIn]);

  // Filter transactions by selected month
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.date?.startsWith(selectedMonth)
  );

  // Calculate monthly income
  const income = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  // Calculate monthly expenses
  const expense = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );

  const balance = income - expense;

  // Delete a transaction
  const deleteTransaction = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`transactions/${id}/`);

      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (transaction) => transaction.id !== id
        )
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const [editingTransaction, setEditingTransaction] = useState(null);

  // Select a transaction to edit
  const editTransaction = (id) => {
    const transaction = transactions.find(
      (transaction) => transaction.id === id
    );

    setEditingTransaction(transaction);
  };

  // Save transaction edits
  const saveEdit = async () => {
    if (!editingTransaction) return;

    try {
      const response = await api.put(
        `transactions/${editingTransaction.id}/`,
        {
          title: editingTransaction.title,
          amount: editingTransaction.amount,
          type: editingTransaction.type,
          category: editingTransaction.category,
          date: editingTransaction.date,
        }
      );

      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.id === editingTransaction.id
            ? response.data
            : transaction
        )
      );

      setEditingTransaction(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setIsLoggedIn(false);
    setTransactions([]);
    setActivePage("dashboard");
  };

  if (!isLoggedIn) {
    return showLogin ? (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        setShowLogin={setShowLogin}
      />
    ) : (
      <Register setShowLogin={setShowLogin} />
    );
  }

  // Render the selected page
  const renderPage = () => {
    if (activePage === "dashboard") {
      return (
        <Dashboard
          income={income}
          expense={expense}
          balance={balance}
          setTransactions={setTransactions}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
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
          transactions={filteredTransactions}
        />
      );
    }

    if (activePage === "settings") {
      return <Settings />;
    }

    if (activePage === "reports") {
      return <Reports transactions={transactions} />;
    }

    if (activePage === "budgets") {
      return <Budgets transactions={transactions} />;
    }

    return <Dashboard
      income={income}
      expense={expense}
      balance={balance}
      setTransactions={setTransactions}
      selectedMonth={selectedMonth}
      setSelectedMonth={setSelectedMonth}
    />;
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
