import "../assets/css/transactions.css";
import TransactionList from "../components/transactionlist";
import EditTransaction from "../components/edittransaction";

function Transactions({
  transactions,
  deleteTransaction,
  editTransaction,
  editingTransaction,
  setEditingTransaction,
  saveEdit,
}) {
  return (
    <div className="transactions-page">
      <header className="transactions-header">
        <h1>Transactions</h1>
        <p>View and manage all your transactions</p>
      </header>

      {editingTransaction && (
        <div className="edit-wrapper">
          <EditTransaction
            editingTransaction={editingTransaction}
            setEditingTransaction={setEditingTransaction}
            saveEdit={saveEdit}
          />
        </div>
      )}

      <TransactionList
        transactions={transactions}
        deleteTransaction={deleteTransaction}
        editTransaction={editTransaction}
      />
    </div>
  );
}

export default Transactions;