import "../assets/css/edittransaction.css";

function EditTransaction({
  editingTransaction,
  setEditingTransaction,
  saveEdit
}) {

  return (
    <div className="edit-transaction">
      <h2>Edit Transaction</h2>
      <p>
        Type: <strong>{editingTransaction.type}</strong>
      </p>

      <label>Title</label>
      <input
        type="text"
        value={editingTransaction.title}
        onChange={(e) =>
          setEditingTransaction({
            ...editingTransaction,
            title: e.target.value
          })
        }
      />

      <label>Amount</label>
      <input
        type="number"
        value={editingTransaction.amount}
        onChange={(e) =>
          setEditingTransaction({
            ...editingTransaction,
            amount: Number(e.target.value)
          })
        }
      />

      <label>Category</label>
      <select
        value={editingTransaction.category}
        onChange={(e) =>
          setEditingTransaction({
            ...editingTransaction,
            category: e.target.value
          })
        }
      >
        <option value="">Select category</option>

        {editingTransaction.type === "income" ? (
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

      <button onClick={saveEdit}>
        Save Changes
      </button>

      <button onClick={() => setEditingTransaction(null)}>
        Cancel
      </button>

    </div>
  );
}

export default EditTransaction;