import "../assets/css/transactions.css";
import TransactionList from "../components/transactionlist";
import EditTransaction from "../components/edittransaction";

function Transactions({
  transactions,
  deleteTransaction,
  editTransaction,
  editingTransaction,
  setEditingTransaction,
  saveEdit
}) {

  return (
    <div className="transactions-page">

      <h1>Transactions</h1>

      <p>View and manage all your transactions</p>

      {editingTransaction && (
        <EditTransaction
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
          saveEdit={saveEdit}
        />
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