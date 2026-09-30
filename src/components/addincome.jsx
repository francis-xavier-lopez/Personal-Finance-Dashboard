import { useState } from "react";
import "../assets/css/addincome.css";

function AddIncome({ setIncome, setTransactions }) {

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  

  const handleSubmit = () => {

    if (!title || !category || !amount) {
      alert("Please fill all fields");
      return;
    }

    const newIncome = Number(amount);

    setIncome((previousIncome) => previousIncome + newIncome);

    const newTransaction = {
      id: Date.now(),
      title,
      type: "income",
      amount: newIncome,
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
    <div className="income-container">

      <h2>Add Income</h2>

      <input
        type="text"
        placeholder="Enter income title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>
        <option value="Salary">Salary</option>
        <option value="Freelance">Freelance</option>
        <option value="Business">Business</option>
        <option value="Investment">Investment</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="number"
        placeholder="Enter income amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Add Income
      </button>

    </div>
  );
}

export default AddIncome;