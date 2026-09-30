import "../assets/css/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Personal Finance</h2>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Transactions</a>
        <a href="#">Reports</a>
      </div>
    </nav>
  );
}

export default Navbar;