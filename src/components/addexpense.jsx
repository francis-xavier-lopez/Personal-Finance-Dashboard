import { useState } from "react";
import "../assets/css/addexpense.css";
import api from "../api/api";

function AddExpense({ setTransactions }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});

  // Clear a field's error as soon as the user edits it
  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Enter a title for this expense.";
    if (!category) newErrors.category = "Select a category.";
    if (amount === "") newErrors.amount = "Enter an amount.";
    else if (Number(amount) <= 0)
      newErrors.amount = "Amount must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const newExpense = Number(amount);

    try {
      const response = await api.post("transactions/", {
        title: title.trim(),
        type: "expense",
        amount: newExpense,
        category: category,
        date: new Date().toISOString().split("T")[0],
      });

      // Add the transaction returned by Django
      setTransactions((previousTransactions) => [
        ...previousTransactions,
        response.data,
      ]);


      // Clear form
      setAmount("");
      setTitle("");
      setCategory("");
      setErrors({});

    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="expense-container">
      <h2>Add Expense</h2>

      <div className="field full">
        <input
          type="text"
          placeholder="Enter expense title"
          value={title}
          className={errors.title ? "invalid" : ""}
          aria-invalid={!!errors.title}
          onChange={(e) => {
            setTitle(e.target.value);
            clearError("title");
          }}
        />
        {errors.title && (
          <span className="field-error" role="alert">{errors.title}</span>
        )}
      </div>

      <div className="field">
        <select
          value={category}
          className={errors.category ? "invalid" : ""}
          aria-invalid={!!errors.category}
          onChange={(e) => {
            setCategory(e.target.value);
            clearError("category");
          }}
        >
          <option value="">Select category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
        {errors.category && (
          <span className="field-error" role="alert">{errors.category}</span>
        )}
      </div>

      <div className="field">
        <input
          type="number"
          min="0"
          step="any"
          placeholder="Enter expense amount"
          value={amount}
          className={errors.amount ? "invalid" : ""}
          aria-invalid={!!errors.amount}
          onChange={(e) => {
            setAmount(e.target.value);
            clearError("amount");
          }}
        />
        {errors.amount && (
          <span className="field-error" role="alert">{errors.amount}</span>
        )}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Add Expense
      </button>
    </div>
  );
}

export default AddExpense;