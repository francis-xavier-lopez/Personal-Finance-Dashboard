import "../assets/css/edittransaction.css";

function EditTransaction({
  editingTransaction,
  setEditingTransaction,
  saveEdit
}) {

  return (
    <div className="edit-transaction">
      <h2>Edit Transaction</h2>

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

      <input
        type="text"
        value={editingTransaction.category}
        onChange={(e) =>
          setEditingTransaction({
            ...editingTransaction,
            category: e.target.value
          })
        }
      />

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