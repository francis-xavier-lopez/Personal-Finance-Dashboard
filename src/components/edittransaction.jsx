import { useEffect, useRef, useState } from "react";
import "../assets/css/edittransaction.css";

function EditTransaction({
  editingTransaction,
  setEditingTransaction,
  saveEdit,
}) {
  const [errors, setErrors] = useState({});
  const cardRef = useRef(null);

  // Bring the form into view when Edit is clicked far down the list
  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const update = (field, value) => {
    setEditingTransaction({ ...editingTransaction, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!editingTransaction.title.trim())
      newErrors.title = "Enter a title.";
    if (!editingTransaction.category)
      newErrors.category = "Select a category.";
    if (!(Number(editingTransaction.amount) > 0))
      newErrors.amount = "Amount must be greater than 0.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) saveEdit();
  };

  const isIncome = editingTransaction.type === "income";

  return (
    <div
      ref={cardRef}
      className={`edit-transaction ${isIncome ? "income" : "expense"}`}
    >
      <div className="edit-header">
        <h2>Edit Transaction</h2>
        <span className="type-badge">{editingTransaction.type}</span>
      </div>

      <div className="edit-field full">
        <label htmlFor="edit-title">Title</label>
        <input
          id="edit-title"
          type="text"
          value={editingTransaction.title}
          className={errors.title ? "invalid" : ""}
          aria-invalid={!!errors.title}
          onChange={(e) => update("title", e.target.value)}
        />
        {errors.title && (
          <span className="field-error" role="alert">{errors.title}</span>
        )}
      </div>

      <div className="edit-field">
        <label htmlFor="edit-category">Category</label>
        <select
          id="edit-category"
          value={editingTransaction.category}
          className={errors.category ? "invalid" : ""}
          aria-invalid={!!errors.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">Select category</option>

          {isIncome ? (
            <>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Business">Business</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </>
          ) : (
            <>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </>
          )}
        </select>
        {errors.category && (
          <span className="field-error" role="alert">{errors.category}</span>
        )}
      </div>

      <div className="edit-field">
        <label htmlFor="edit-amount">Amount</label>
        <input
          id="edit-amount"
          type="number"
          min="0"
          step="any"
          value={editingTransaction.amount}
          className={errors.amount ? "invalid" : ""}
          aria-invalid={!!errors.amount}
          onChange={(e) => update("amount", Number(e.target.value))}
        />
        {errors.amount && (
          <span className="field-error" role="alert">{errors.amount}</span>
        )}
      </div>

      <div className="edit-actions full">
        <button className="cancel-btn" onClick={() => setEditingTransaction(null)}>
          Cancel
        </button>
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditTransaction;