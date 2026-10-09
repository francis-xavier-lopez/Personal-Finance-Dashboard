
import { useState } from "react";
import "../assets/css/addincome.css";
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

function AddIncome({ setTransactions }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(getLocalDate());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear a field's error when the user edits it
  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  // Validate the form
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Enter a title for this income.";
    }

    if (!category) {
      newErrors.category = "Select a category.";
    }

    if (amount === "") {
      newErrors.amount = "Enter an amount.";
    } else if (
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!date) {
      newErrors.date = "Select the income date.";
    } else if (date > getLocalDate()) {
      newErrors.date = "Income date cannot be in the future.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit income to Django backend
  const handleSubmit = async () => {
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);

    try {
      const response = await api.post("transactions/", {
        title: title.trim(),
        type: "income",
        amount: Number(amount),
        category: category,
        date: date,
      });

      // Update React state using the transaction returned by Django
      setTransactions((previousTransactions) => [
        ...previousTransactions,
        response.data,
      ]);

      // Clear the form and reset the date to today
      setAmount("");
      setTitle("");
      setCategory("");
      setDate(getLocalDate());
      setErrors({});
    } catch (error) {
      console.error("Error adding income:", error);

      setErrors((prev) => ({
        ...prev,
        submit:
          error.response?.data?.detail ||
          "Unable to add income. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="income-container">
      <h2>Add Income</h2>

      {/* Income title */}
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
          <span className="field-error" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      {/* Income category */}
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
          <span className="field-error" role="alert">
            {errors.category}
          </span>
        )}
      </div>

      {/* Income amount */}
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
          <span className="field-error" role="alert">
            {errors.amount}
          </span>
        )}
      </div>

      {/* Income date */}
      <div className="field full">
        <label htmlFor="income-date">Income Date</label>

        <input
          id="income-date"
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
        {isSubmitting ? "Adding Income..." : "Add Income"}
      </button>
    </div>
  );
}

export default AddIncome;
