import { useState } from "react";
import "../assets/css/addexpense.css";

function AddExpense({ setExpense, setTransactions }) {

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = () => {

    if (!title || !category || !amount) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = Number(amount);

    setExpense((previousExpense) => previousExpense + newExpense);

    const newTransaction = {
      id: Date.now(),
      title,
      type: "expense",
      amount: newExpense,
      category,
      date: new Date().toLocaleDateString("en-IN")
    };

    setTransactions((previousTransactions) => [
      ...previousTransactions,
      newTransaction
    ]);

    setAmount("");
    setTitle("");
    setCategory("");
  };

  return (
    <div className="expense-container">

      <h2>Add Expense</h2>

      <input
        type="text"
        placeholder="Enter expense title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Other">Other</option>
      </select>


      <input
        type="number"
        placeholder="Enter expense amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Add Expense
      </button>

    </div>
  );
}

export default AddExpense;