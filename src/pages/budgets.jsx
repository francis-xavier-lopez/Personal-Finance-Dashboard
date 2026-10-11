
import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import "../assets/css/budgets.css";

// Get the current month using local time
const getCurrentMonth = () => {
  const today = new Date();

  return (
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0")
  );
};

function Budgets({ transactions }) {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [budgets, setBudgets] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch budgets belonging to the logged-in user
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await api.get("budgets/");
        setBudgets(response.data);
      } catch (err) {
        console.error("Error fetching budgets:", err);
        setError("Unable to load budgets. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Find the budget for the selected month
  const currentBudget = useMemo(() => {
    return budgets.find(
      (budget) => budget.month?.slice(0, 7) === selectedMonth
    );
  }, [budgets, selectedMonth]);

  // Calculate expenses for the selected month
  const totalExpenses = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.date?.startsWith(selectedMonth)
      )
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  }, [transactions, selectedMonth]);

  const budgetAmount = Number(currentBudget?.amount || 0);
  const remaining = budgetAmount - totalExpenses;
  const percentage =
    budgetAmount > 0 ? (totalExpenses / budgetAmount) * 100 : 0;
  const progress = Math.min(percentage, 100);

  const formatAmount = (value) =>
    Number(value).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  // Update the amount field when the selected month changes
  useEffect(() => {
    setAmount(currentBudget ? String(currentBudget.amount) : "");
    setMessage("");
    setError("");
  }, [currentBudget]);

  // Create or update the selected month's budget
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const value = Number(amount);

    if (amount.trim() === "" || !Number.isFinite(value) || value <= 0) {
      setError("Enter a budget amount greater than zero.");
      return;
    }

    setSaving(true);

    try {
      const budgetData = {
        month: `${selectedMonth}-01`,
        amount: value.toFixed(2),
      };

      let response;

      if (currentBudget) {
        response = await api.patch(
          `budgets/${currentBudget.id}/`,
          budgetData
        );

        setBudgets((previousBudgets) =>
          previousBudgets.map((budget) =>
            budget.id === response.data.id ? response.data : budget
          )
        );
      } else {
        response = await api.post("budgets/", budgetData);

        setBudgets((previousBudgets) => [
          ...previousBudgets,
          response.data,
        ]);
      }

      setMessage("Monthly budget saved successfully.");
    } catch (err) {
      console.error("Error saving budget:", err);

      const responseData = err.response?.data;
      const detail =
        responseData?.detail ||
        responseData?.month?.[0] ||
        responseData?.amount?.[0] ||
        "Unable to save the budget. Please try again.";

      setError(detail);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="budgets-page">
      <header className="budgets-header">
        <h1>Monthly Budget</h1>
        <p>Set a spending limit and keep track of your expenses.</p>
      </header>

      <section className="budget-form-card">
        <label htmlFor="budget-month">Select Month</label>

        <input
          id="budget-month"
          type="month"
          value={selectedMonth}
          max={getCurrentMonth()}
          onChange={(event) => setSelectedMonth(event.target.value)}
        />

        <form onSubmit={handleSubmit}>
          <label htmlFor="budget-amount">Monthly Spending Limit (₹)</label>

          <input
            id="budget-amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter your monthly budget"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />

          <button type="submit" disabled={saving || loading}>
            {saving
              ? "Saving..."
              : currentBudget
                ? "Update Budget"
                : "Save Budget"}
          </button>
        </form>

        {loading && <p>Loading your budget...</p>}

        {error && (
          <p className="budget-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="budget-success" role="status">
            {message}
          </p>
        )}
      </section>

      <section className="budget-overview">
        <div className="budget-card">
          <h3>Monthly Budget</h3>
          <p>{formatAmount(budgetAmount)}</p>
        </div>

        <div className="budget-card">
          <h3>Total Expenses</h3>
          <p>{formatAmount(totalExpenses)}</p>
        </div>

        <div className="budget-card">
          <h3>{remaining < 0 ? "Over Budget" : "Budget Remaining"}</h3>
          <p className={remaining < 0 ? "budget-negative" : "budget-positive"}>
            {formatAmount(Math.abs(remaining))}
          </p>
        </div>
      </section>

      <section className="budget-progress-card">
        <h2>Spending Progress</h2>

        {budgetAmount <= 0 ? (
          <p>Set a monthly budget to track your spending progress.</p>
        ) : (
          <>
            <div className="budget-progress-labels">
              <span>{percentage.toFixed(1)}% used</span>
              <span>{formatAmount(budgetAmount)} limit</span>
            </div>

            <div
              className="budget-progress-track"
              role="progressbar"
              aria-label="Monthly budget used"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.min(Math.round(percentage), 100)}
            >
              <div
                className={`budget-progress-fill ${
                  percentage > 100 ? "over-budget" : ""
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {remaining < 0 ? (
              <p className="budget-error">
                You have exceeded your monthly budget by{" "}
                {formatAmount(Math.abs(remaining))}.
              </p>
            ) : percentage >= 80 ? (
              <p className="budget-warning">
                You have used at least 80% of your monthly budget.
              </p>
            ) : (
              <p className="budget-success">
                You are within your monthly spending limit.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Budgets;
