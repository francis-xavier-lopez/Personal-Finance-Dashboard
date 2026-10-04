import { useState } from "react";
import "../assets/css/addincome.css";
import api from "../api/api";

function AddIncome({ setIncome, setTransactions }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});

  // Clear a field's error as soon as the user edits it
  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Enter a title for this income.";
    if (!category) newErrors.category = "Select a category.";
    if (amount === "") newErrors.amount = "Enter an amount.";
    else if (Number(amount) <= 0)
      newErrors.amount = "Amount must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const newIncome = Number(amount);

    try {
      const response = await api.post("transactions/", {
        title: title.trim(),
        type: "income",
        amount: newIncome,
        category: category,
        date: new Date().toISOString().split("T")[0],
      });

      // Update React state using the transaction returned by Django
      setTransactions((previousTransactions) => [
        ...previousTransactions,
        response.data,
      ]);

      setIncome((previousIncome) => previousIncome + newIncome);

      // Clear form
      setAmount("");
      setTitle("");
      setCategory("");
      setErrors({});

    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  return (
    <div className="income-container">
      <h2>Add Income</h2>

      <div className="field full">
        <input
          type="text"
          placeholder="Enter income title"
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
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Business">Business</option>
          <option value="Investment">Investment</option>
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
          placeholder="Enter income amount"
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
        Add Income
      </button>
    </div>
  );
}

export default AddIncome;