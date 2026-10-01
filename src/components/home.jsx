import { useState } from "react";
import "../assets/css/home.css";
import Navbar from "./navbar";
import SummaryCards from "./summarycards";
import AddIncome from "./addincome";
import AddExpense from "./addexpense";
import TransactionList from "./transactionlist";
import EditTransaction from "./edittransaction";
import MonthlySummary from "./monthlysummary";

function Home() {

  const [income, setIncome] = useState(40000);
  const [expense, setExpense] = useState(25000);
  const [editingTransaction, setEditingTransaction] = useState(null);
  

  const balance = income - expense;

  const deleteTransaction = (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
      return;
    }

    const transaction = transactions.find(
      (transaction) => transaction.id === id
    );

    if (transaction.type === "income") {
      setIncome((previousIncome) => previousIncome - transaction.amount);
    } else {
      setExpense((previousExpense) => previousExpense - transaction.amount);
    }

    setTransactions((previousTransactions) =>
      previousTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  };

  const editTransaction = (id) => {

    const transaction = transactions.find(
      (transaction) => transaction.id === id
    );

    setEditingTransaction(transaction);
  };

  const [transactions, setTransactions] = useState([
  {
    id: 1,
    title: "Salary",
    type: "income",
    amount: 40000,
    category: "Salary",
    date: "28/09/2026"
  },
  {
    id: 2,
    title: "Food",
    type: "expense",
    amount: 500,
    category: "Food",
    date: "28/09/2026"
  },
  {
    id: 3,
    title: "Travel",
    type: "expense",
    amount: 300,
    category: "Travel",
    date: "28/09/2026"
  }
]);

  const saveEdit = () => {

    const oldTransaction = transactions.find(
      (transaction) => transaction.id === editingTransaction.id
    );

    if (oldTransaction.type === "income") {

      setIncome(
        (previousIncome) =>
          previousIncome - oldTransaction.amount + editingTransaction.amount
      );

    } else {

      setExpense(
        (previousExpense) =>
          previousExpense - oldTransaction.amount + editingTransaction.amount
      );
    }

    setTransactions((previousTransactions) =>
      previousTransactions.map((transaction) =>
        transaction.id === editingTransaction.id
          ? editingTransaction
          : transaction
      )
    );

    setEditingTransaction(null);
  };

  return (
    <div className="home">

      <Navbar />

      <h1>Personal Finance Dashboard</h1>

      <p>Manage your income and expenses</p>

      <SummaryCards
        income={income}
        expense={expense}
        balance={balance}
      />

      <MonthlySummary
        income={income}
        expense={expense}
        transactions={transactions}
      />

      <div className="forms-container">

        <AddIncome
          setIncome={setIncome}
          setTransactions={setTransactions}
        />

        <AddExpense
          setExpense={setExpense}
          setTransactions={setTransactions}
        />

      </div>

      <TransactionList
        transactions={transactions}
        deleteTransaction={deleteTransaction}
        editTransaction={editTransaction}
      />

      {editingTransaction && (
        <EditTransaction
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          saveEdit={saveEdit}
        />
      )}

    </div>
  );
}

export default Home;