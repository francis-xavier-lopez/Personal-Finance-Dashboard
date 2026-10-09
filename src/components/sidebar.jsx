import "../assets/css/sidebar.css";

const items = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "transactions", label: "Transactions", icon: "💳" },
  { id: "charts", label: "Charts", icon: "📊" },
  { id: "reports", label: "Reports", icon: "📑" },
];

function Sidebar({ activePage, setActivePage, onLogout }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-brand">
        <span className="brand-icon" aria-hidden="true">💰</span>
        <span className="brand-text">Personal Finance</span>
      </h2>

      <nav>
        <span className="sidebar-title">Navigation</span>

        {items.map((item) => (
          <button
            key={item.id}
            className={activePage === item.id ? "active" : ""}
            onClick={() => setActivePage(item.id)}
            aria-current={activePage === item.id ? "page" : undefined}
            title={item.label}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Pinned to the bottom */}
      <div className="sidebar-bottom">
        <button
          className={activePage === "settings" ? "active" : ""}
          onClick={() => setActivePage("settings")}
          aria-current={activePage === "settings" ? "page" : undefined}
          title="Settings"
        >
          <span className="nav-icon" aria-hidden="true">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>

        <button
          className="logout-btn"
          onClick={onLogout}
          title="Logout"
        >
          <span className="nav-icon" aria-hidden="true">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;