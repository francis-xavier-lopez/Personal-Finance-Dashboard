
import { useState } from "react";
import "../assets/css/addexpense.css";
import api from "../api/api";

// Get today's date in local time
const getLocalDate = () => {
  const today = new Date();

  return (
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0")
  );
};

function AddExpense({ setTransactions }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(getLocalDate());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear a field's error when the user edits it
  const clearError = (field) => {
    setErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));
  };

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Enter a title for this expense.";
    }

    if (!category) {
      newErrors.category = "Select a category.";
    }

    if (amount === "") {
      newErrors.amount = "Enter an amount.";
    } else if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!date) {
      newErrors.date = "Select the expense date.";
    } else if (date > getLocalDate()) {
      newErrors.date = "Expense date cannot be in the future.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit expense to Django backend
  const handleSubmit = async () => {
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);

    try {
      const response = await api.post("transactions/", {
        title: title.trim(),
        type: "expense",
        amount: Number(amount),
        category: category,
        date: date,
      });

      // Add the saved transaction to the dashboard
      setTransactions((previousTransactions) => [
        ...previousTransactions,
        response.data,
      ]);

      // Reset the form
      setAmount("");
      setTitle("");
      setCategory("");
      setDate(getLocalDate());
      setErrors({});
    } catch (error) {
      console.error("Error adding expense:", error);

      setErrors((previousErrors) => ({
        ...previousErrors,
        submit:
          error.response?.data?.detail ||
          "Unable to add expense. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="expense-container">
      <h2>Add Expense</h2>

      {/* Expense title */}
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
          <span className="field-error" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      {/* Expense category */}
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
          <span className="field-error" role="alert">
            {errors.category}
          </span>
        )}
      </div>

      {/* Expense amount */}
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
          <span className="field-error" role="alert">
            {errors.amount}
          </span>
        )}
      </div>

      {/* Expense date */}
      <div className="field full">
        <label htmlFor="expense-date">Expense Date</label>

        <input
          id="expense-date"
          type="date"
          value={date}
          max={getLocalDate()}
          className={errors.date ? "invalid" : ""}
          aria-invalid={!!errors.date}
          onChange={(e) => {
            setDate(e.target.value);
            clearError("date");
          }}
        />

        {errors.date && (
          <span className="field-error" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      {/* Submission error */}
      {errors.submit && (
        <p className="field-error" role="alert">
          {errors.submit}
        </p>
      )}

      {/* Submit button */}
      <button
        type="button"
        className="submit-btn"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding Expense..." : "Add Expense"}
      </button>
    </div>
  );
}

export default AddExpense;
